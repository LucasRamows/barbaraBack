import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const username = process.env.SEED_ADMIN_USERNAME ?? 'admin';
  const password = process.env.SEED_ADMIN_PASSWORD ?? 'Admin@1234';

  const existing = await prisma.user.findFirst({ where: { username } });
  if (existing) {
    console.log(`Usuário "${username}" já existe — nada alterado.`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      passwordHash,
      role: Role.SUPER_ADMIN,
    },
  });

  console.log(`✓ Admin criado: username="${user.username}" | role=${user.role}`);
  console.log(`  Senha inicial: ${password}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
