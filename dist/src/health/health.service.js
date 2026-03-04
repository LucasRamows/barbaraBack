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
exports.HealthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let HealthService = class HealthService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createHealth(data, userId) {
        try {
            const { title, note, date, category } = data;
            return await this.prisma.health.create({
                data: {
                    title,
                    note,
                    category,
                    date: date ? new Date(date) : new Date(),
                    userId,
                },
            });
        }
        catch (error) {
            throw new common_1.BadRequestException({ error: 'Erro ao registrar dados de saúde', details: error.message });
        }
    }
    async getHealths(userId) {
        try {
            return await this.prisma.health.findMany({
                where: { userId },
                orderBy: { date: 'desc' },
            });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException({ error: 'Erro ao procurar registros de saúde' });
        }
    }
    async updateHealth(id, data, userId) {
        try {
            const { title, note, date, category } = data;
            return await this.prisma.health.update({
                where: { id, userId },
                data: {
                    title,
                    note,
                    category,
                    date: date ? new Date(date) : undefined,
                },
            });
        }
        catch (error) {
            throw new common_1.BadRequestException({ error: 'Erro ao atualizar registro de saúde' });
        }
    }
    async deleteHealth(id, userId) {
        try {
            await this.prisma.health.delete({ where: { id, userId } });
            return;
        }
        catch (error) {
            throw new common_1.BadRequestException({ error: 'Erro ao eliminar registro de saúde' });
        }
    }
};
exports.HealthService = HealthService;
exports.HealthService = HealthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HealthService);
//# sourceMappingURL=health.service.js.map