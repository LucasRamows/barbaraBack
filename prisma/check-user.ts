import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const username = process.argv[2];
  const password  = process.argv[3];

  if (!username) {
    console.log('Uso: npx ts-node -r tsconfig-paths/register prisma/check-user.ts <username> [senha]');
    return;
  }

  const user = await prisma.user.findFirst({
    where: { username },
    select: {
      id: true,
      username: true,
      role: true,
      status: true,
      mustChangePassword: true,
      deletedAt: true,
      passwordHash: true,
    },
  });

  if (!user) {
    console.log(`❌  Usuário "${username}" NÃO encontrado no banco.`);
    return;
  }

  console.log('\n✅  Usuário encontrado:');
  console.log(`   id:                 ${user.id}`);
  console.log(`   username:           ${user.username}`);
  console.log(`   role:               ${user.role}`);
  console.log(`   status:             ${user.status}`);
  console.log(`   mustChangePassword: ${user.mustChangePassword}`);
  console.log(`   deletedAt:          ${user.deletedAt ?? 'null (ativo)'}`);

  if (password) {
    const match = await bcrypt.compare(password, user.passwordHash);
    console.log(`\n   Senha "${password}": ${match ? '✅ CORRETA' : '❌ INCORRETA'}`);
  } else {
    console.log('\n   (passe a senha como 3º argumento para verificá-la)');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
