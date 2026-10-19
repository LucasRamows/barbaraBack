"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    const username = process.argv[2];
    const password = process.argv[3];
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
    }
    else {
        console.log('\n   (passe a senha como 3º argumento para verificá-la)');
    }
}
main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=check-user.js.map