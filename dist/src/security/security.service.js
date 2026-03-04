"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SecurityService = class SecurityService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createCredential(data, userId) {
        try {
            const { site, email, password } = data;
            if (!site || !email || !password) {
                throw new common_1.BadRequestException({ error: "Campos obrigatórios em falta" });
            }
            return await this.prisma.security.create({
                data: {
                    site,
                    email,
                    password,
                    userId,
                },
            });
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException)
                throw error;
            throw new common_1.BadRequestException({ error: "Erro ao registar credencial", details: error.message });
        }
    }
    async updatePublicKey(key, userId) {
        try {
            return await this.prisma.settings.update({
                where: { userId },
                data: { publicKey: key },
            });
        }
        catch (error) {
            throw new common_1.BadRequestException({ error: "Erro ao registrar key", details: error.message });
        }
    }
    async getPublicKey(userId) {
        try {
            return await this.prisma.settings.findMany({ where: { userId } });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException({ error: "Erro ao procurar key" });
        }
    }
    async getCredentials(userId) {
        try {
            return await this.prisma.security.findMany({
                where: { userId },
                orderBy: { createdAt: "desc" },
            });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException({ error: "Erro ao procurar credenciais" });
        }
    }
    async updateCredential(id, data, userId) {
        try {
            const { site, email, password } = data;
            return await this.prisma.security.update({
                where: { id, userId },
                data: { site, email, password },
            });
        }
        catch (error) {
            throw new common_1.BadRequestException({ error: "Erro ao atualizar credencial" });
        }
    }
    async deleteCredential(id, userId) {
        try {
            await this.prisma.security.delete({ where: { id, userId } });
            return;
        }
        catch (error) {
            throw new common_1.BadRequestException({ error: "Erro ao eliminar credencial" });
        }
    }
    async getStats(userId) {
        try {
            const count = await this.prisma.security.count({ where: { userId } });
            return { totalCredentials: count };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException({ error: "Erro ao obter estatísticas" });
        }
    }
};
exports.SecurityService = SecurityService;
exports.SecurityService = SecurityService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SecurityService);
//# sourceMappingURL=security.service.js.map