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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonalsService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcryptjs"));
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let PersonalsService = class PersonalsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const existing = await this.prisma.user.findFirst({
            where: { username: dto.username },
        });
        if (existing) {
            throw new common_1.BadRequestException('Nome de usuário já está em uso.');
        }
        const passwordHash = await bcrypt.hash(dto.password, 12);
        const user = await this.prisma.user.create({
            data: {
                username: dto.username,
                passwordHash,
                role: client_1.Role.PERSONAL,
                mustChangePassword: true,
                personalProfile: {
                    create: {
                        name: dto.name,
                        email: dto.email,
                        phone: dto.phone,
                    },
                },
            },
            select: {
                id: true,
                username: true,
                role: true,
                status: true,
                createdAt: true,
                personalProfile: {
                    select: { id: true, name: true, email: true, phone: true },
                },
            },
        });
        return user;
    }
    async findAll() {
        return this.prisma.user.findMany({
            where: { role: client_1.Role.PERSONAL, deletedAt: null },
            select: {
                id: true,
                username: true,
                role: true,
                status: true,
                createdAt: true,
                personalProfile: {
                    select: { id: true, name: true, email: true, phone: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const user = await this.prisma.user.findFirst({
            where: { id, role: client_1.Role.PERSONAL, deletedAt: null },
            select: {
                id: true,
                username: true,
                role: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                personalProfile: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        bio: true,
                        avatarUrl: true,
                    },
                },
            },
        });
        if (!user)
            throw new common_1.NotFoundException('Personal não encontrado.');
        return user;
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.user.update({
            where: { id },
            data: {
                personalProfile: {
                    update: {
                        name: dto.name,
                        email: dto.email,
                        phone: dto.phone,
                        bio: dto.bio,
                    },
                },
            },
            select: {
                id: true,
                username: true,
                personalProfile: {
                    select: { id: true, name: true, email: true, phone: true, bio: true },
                },
            },
        });
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.user.update({
            where: { id },
            data: { deletedAt: new Date(), status: client_1.UserStatus.INACTIVE },
        });
    }
    async updateStatus(id, status) {
        await this.findOne(id);
        return this.prisma.user.update({
            where: { id },
            data: { status },
            select: { id: true, status: true },
        });
    }
    async resetPassword(id, newPassword) {
        await this.findOne(id);
        const passwordHash = await bcrypt.hash(newPassword, 12);
        await this.prisma.user.update({
            where: { id },
            data: { passwordHash, mustChangePassword: true },
        });
        await this.prisma.refreshToken.updateMany({
            where: { userId: id, revokedAt: null },
            data: { revokedAt: new Date() },
        });
    }
};
exports.PersonalsService = PersonalsService;
exports.PersonalsService = PersonalsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PersonalsService);
//# sourceMappingURL=personals.service.js.map