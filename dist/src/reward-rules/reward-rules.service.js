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
exports.RewardRulesService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const client_2 = require("@prisma/client");
let RewardRulesService = class RewardRulesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getPersonalProfile(userId) {
        const profile = await this.prisma.personalProfile.findUnique({
            where: { userId, deletedAt: null },
        });
        if (!profile)
            throw new common_1.ForbiddenException('Perfil de personal não encontrado.');
        return profile;
    }
    async create(dto, currentUser) {
        const personal = await this.getPersonalProfile(currentUser.sub);
        return this.prisma.rewardRule.create({
            data: {
                personalId: personal.id,
                name: dto.name,
                description: dto.description,
                type: dto.type,
                targetValue: dto.targetValue,
                period: dto.period,
                conditions: dto.conditions ?? client_2.Prisma.JsonNull,
                startDate: dto.startDate ? new Date(dto.startDate) : undefined,
                endDate: dto.endDate ? new Date(dto.endDate) : undefined,
                requiresApproval: dto.requiresApproval ?? true,
                isActive: dto.isActive ?? true,
                giftId: dto.giftId,
            },
            include: { gift: true },
        });
    }
    async findAll(currentUser) {
        if (currentUser.role === client_1.Role.SUPER_ADMIN) {
            return this.prisma.rewardRule.findMany({
                orderBy: { createdAt: 'desc' },
                include: { gift: true, personal: { select: { id: true, name: true } } },
            });
        }
        const personal = await this.getPersonalProfile(currentUser.sub);
        return this.prisma.rewardRule.findMany({
            where: { personalId: personal.id },
            orderBy: { createdAt: 'desc' },
            include: { gift: true },
        });
    }
    async findOne(id, currentUser) {
        const rule = await this.prisma.rewardRule.findUnique({
            where: { id },
            include: { gift: true },
        });
        if (!rule)
            throw new common_1.NotFoundException('Regra de recompensa não encontrada.');
        if (currentUser.role === client_1.Role.PERSONAL) {
            const personal = await this.getPersonalProfile(currentUser.sub);
            if (rule.personalId !== personal.id)
                throw new common_1.ForbiddenException();
        }
        return rule;
    }
    async update(id, dto, currentUser) {
        await this.findOne(id, currentUser);
        return this.prisma.rewardRule.update({
            where: { id },
            data: {
                name: dto.name,
                description: dto.description,
                type: dto.type,
                targetValue: dto.targetValue,
                period: dto.period,
                conditions: dto.conditions !== undefined ? dto.conditions : undefined,
                startDate: dto.startDate ? new Date(dto.startDate) : undefined,
                endDate: dto.endDate ? new Date(dto.endDate) : undefined,
                requiresApproval: dto.requiresApproval,
                isActive: dto.isActive,
                giftId: dto.giftId,
            },
            include: { gift: true },
        });
    }
    async remove(id, currentUser) {
        await this.findOne(id, currentUser);
        await this.prisma.rewardRule.delete({ where: { id } });
    }
};
exports.RewardRulesService = RewardRulesService;
exports.RewardRulesService = RewardRulesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RewardRulesService);
//# sourceMappingURL=reward-rules.service.js.map