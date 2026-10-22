import { PrismaClient } from '@prisma/client';
import {
  auditIdentities,
  type IdentityAuditRecord,
} from '../src/identity/identity-audit';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      personalProfile: { select: { email: true } },
      studentProfile: { select: { email: true } },
    },
    orderBy: { createdAt: 'asc' },
  });

  const records: IdentityAuditRecord[] = users.map((user) => ({
    id: user.id,
    username: user.username,
    emails: [
      { source: 'user', value: user.email },
      { source: 'personalProfile', value: user.personalProfile?.email },
      { source: 'studentProfile', value: user.studentProfile?.email },
    ],
  }));

  const report = auditIdentities(records);
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
