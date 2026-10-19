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
exports.GiftsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let GiftsService = class GiftsService {
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
        return this.prisma.gift.create({
            data: {
                personalId: personal.id,
                name: dto.name,
                description: dto.description,
                imageUrl: dto.imageUrl,
                instructions: dto.instructions,
                isActive: dto.isActive ?? true,
            },
        });
    }
    async findAll(currentUser) {
        if (currentUser.role === client_1.Role.SUPER_ADMIN) {
            return this.prisma.gift.findMany({
                where: { deletedAt: null },
                orderBy: { createdAt: 'desc' },
                include: { personal: { select: { id: true, name: true } } },
            });
        }
        const personal = await this.getPersonalProfile(currentUser.sub);
        return this.prisma.gift.findMany({
            where: { personalId: personal.id, deletedAt: null },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id, currentUser) {
        const gift = await this.prisma.gift.findFirst({
            where: { id, deletedAt: null },
        });
        if (!gift)
            throw new common_1.NotFoundException('Gift não encontrado.');
        if (currentUser.role === client_1.Role.PERSONAL) {
            const personal = await this.getPersonalProfile(currentUser.sub);
            if (gift.personalId !== personal.id)
                throw new common_1.ForbiddenException();
        }
        return gift;
    }
    async update(id, dto, currentUser) {
        await this.findOne(id, currentUser);
        return this.prisma.gift.update({
            where: { id },
            data: {
                name: dto.name,
                description: dto.description,
                imageUrl: dto.imageUrl,
                instructions: dto.instructions,
                isActive: dto.isActive,
            },
        });
    }
    async remove(id, currentUser) {
        await this.findOne(id, currentUser);
        await this.prisma.gift.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
};
exports.GiftsService = GiftsService;
exports.GiftsService = GiftsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GiftsService);
//# sourceMappingURL=gifts.service.js.map