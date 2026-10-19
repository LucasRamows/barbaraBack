"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const users = await prisma.user.findMany({
        select: { id: true, username: true, role: true, status: true, deletedAt: true },
        orderBy: { createdAt: 'asc' },
    });
    if (users.length === 0) {
        console.log('Nenhum usuário no banco.');
        return;
    }
    console.log(`\n${users.length} usuário(s) encontrado(s):\n`);
    for (const u of users) {
        console.log(`  username: ${u.username}`);
        console.log(`  role:     ${u.role}`);
        console.log(`  status:   ${u.status}`);
        console.log(`  deleted:  ${u.deletedAt ?? 'não'}`);
        console.log('  ---');
    }
}
main().catch(console.error).finally(() => prisma.$disconnect());
//# sourceMappingURL=list-users.js.map