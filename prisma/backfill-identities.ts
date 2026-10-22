import { PrismaClient } from '@prisma/client';
import {
  applyIdentityBackfillInBatches,
  buildIdentityBackfillPlan,
  IdentityBackfillBlockedError,
  type IdentityBackfillRecord,
} from '../src/identity/identity-backfill';

const prisma = new PrismaClient();
const apply = process.argv.includes('--apply');
const batchArgument = process.argv.find((argument) =>
  argument.startsWith('--batch-size='),
);
const batchSize = Number(batchArgument?.split('=')[1] ?? 100);

async function main() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      usernameNormalized: true,
      email: true,
      emailNormalized: true,
      personalProfile: { select: { email: true } },
      studentProfile: { select: { email: true } },
    },
    orderBy: { id: 'asc' },
  });

  const records: IdentityBackfillRecord[] = users.map((user) => ({
    id: user.id,
    username: user.username,
    usernameNormalized: user.usernameNormalized,
    email: user.email,
    emailNormalized: user.emailNormalized,
    emails: [
      { source: 'user', value: user.email },
      { source: 'personalProfile', value: user.personalProfile?.email },
      { source: 'studentProfile', value: user.studentProfile?.email },
    ],
  }));
  const plan = buildIdentityBackfillPlan(records);

  if (!apply) {
    process.stdout.write(
      `${JSON.stringify({ mode: 'dry-run', batchSize, ...plan }, null, 2)}\n`,
    );
    return;
  }

  const applied = await applyIdentityBackfillInBatches(
    plan.changes,
    batchSize,
    async (batch) => {
      await prisma.$transaction(
        batch.map((change) =>
          prisma.user.update({
            where: { id: change.id },
            data: {
              usernameNormalized: change.usernameNormalized,
              email: change.email,
              emailNormalized: change.emailNormalized,
            },
          }),
        ),
      );
    },
  );

  process.stdout.write(
    `${JSON.stringify({ mode: 'apply', batchSize, applied }, null, 2)}\n`,
  );
}

main()
  .catch((error: unknown) => {
    if (error instanceof IdentityBackfillBlockedError) {
      console.error(JSON.stringify(error.plan, null, 2));
    } else {
      console.error(error);
    }
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
