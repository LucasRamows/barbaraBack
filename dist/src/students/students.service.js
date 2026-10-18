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
exports.StudentsService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcryptjs"));
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let StudentsService = class StudentsService {
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
    async assertOwnership(personalId, studentId) {
        const link = await this.prisma.personalStudent.findFirst({
            where: { personalId, studentId },
        });
        if (!link)
            throw new common_1.ForbiddenException('Aluno não pertence a este personal.');
    }
    async create(dto, currentUser) {
        const personal = await this.getPersonalProfile(currentUser.sub);
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
                role: client_1.Role.ALUNO,
                mustChangePassword: true,
                studentProfile: {
                    create: {
                        name: dto.name,
                        email: dto.email,
                        phone: dto.phone,
                        birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
                        sex: dto.sex,
                        height: dto.height,
                        objective: dto.objective,
                        experienceLevel: dto.experienceLevel,
                        restrictions: dto.restrictions,
                        observations: dto.observations,
                    },
                },
            },
            include: { studentProfile: true },
        });
        await this.prisma.personalStudent.create({
            data: {
                personalId: personal.id,
                studentId: user.studentProfile.id,
            },
        });
        const { passwordHash: _ph, ...safeUser } = user;
        return safeUser;
    }
    async findAll(currentUser) {
        const personal = await this.getPersonalProfile(currentUser.sub);
        const links = await this.prisma.personalStudent.findMany({
            where: { personalId: personal.id },
            include: {
                student: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                status: true,
                                createdAt: true,
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return links
            .filter((l) => l.student.deletedAt === null)
            .map((l) => ({
            ...l.student,
            user: l.student.user,
        }));
    }
    async findOne(id, currentUser) {
        const personal = await this.getPersonalProfile(currentUser.sub);
        const student = await this.prisma.studentProfile.findFirst({
            where: { id, deletedAt: null },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        status: true,
                        mustChangePassword: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
            },
        });
        if (!student)
            throw new common_1.NotFoundException('Aluno não encontrado.');
        await this.assertOwnership(personal.id, id);
        return student;
    }
    async update(id, dto, currentUser) {
        const personal = await this.getPersonalProfile(currentUser.sub);
        await this.findOne(id, currentUser);
        return this.prisma.studentProfile.update({
            where: { id },
            data: {
                name: dto.name,
                email: dto.email,
                phone: dto.phone,
                birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
                sex: dto.sex,
                height: dto.height,
                objective: dto.objective,
                experienceLevel: dto.experienceLevel,
                restrictions: dto.restrictions,
                observations: dto.observations,
            },
        });
    }
    async remove(id, currentUser) {
        const student = await this.findOne(id, currentUser);
        await this.prisma.user.update({
            where: { id: student.user.id },
            data: { deletedAt: new Date(), status: client_1.UserStatus.INACTIVE },
        });
        await this.prisma.studentProfile.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
    async updateStatus(id, status, currentUser) {
        const student = await this.findOne(id, currentUser);
        return this.prisma.user.update({
            where: { id: student.user.id },
            data: { status },
            select: { id: true, status: true },
        });
    }
    async resetPassword(id, newPassword, currentUser) {
        const student = await this.findOne(id, currentUser);
        const passwordHash = await bcrypt.hash(newPassword, 12);
        await this.prisma.user.update({
            where: { id: student.user.id },
            data: { passwordHash, mustChangePassword: true },
        });
        await this.prisma.refreshToken.updateMany({
            where: { userId: student.user.id, revokedAt: null },
            data: { revokedAt: new Date() },
        });
    }
};
exports.StudentsService = StudentsService;
exports.StudentsService = StudentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StudentsService);
//# sourceMappingURL=students.service.js.map