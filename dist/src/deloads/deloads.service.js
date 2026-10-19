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
exports.DeloadsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let DeloadsService = class DeloadsService {
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
    async assertPersonalOwnsStudent(personalId, studentId) {
        const link = await this.prisma.personalStudent.findFirst({
            where: { personalId, studentId },
        });
        if (!link)
            throw new common_1.ForbiddenException('Aluno não pertence a este personal.');
    }
    async create(dto, currentUser) {
        const personal = await this.getPersonalProfile(currentUser.sub);
        await this.assertPersonalOwnsStudent(personal.id, dto.studentId);
        return this.prisma.deloadPeriod.create({
            data: {
                studentId: dto.studentId,
                personalId: personal.id,
                startDate: new Date(dto.startDate),
                endDate: new Date(dto.endDate),
                reductionPercent: dto.reductionPercent,
                reason: dto.reason,
                observations: dto.observations,
            },
        });
    }
    async findAll(currentUser, studentId) {
        let targetStudentId;
        if (currentUser.role === client_1.Role.ALUNO) {
            const student = await this.prisma.studentProfile.findUnique({
                where: { userId: currentUser.sub },
            });
            if (!student)
                throw new common_1.ForbiddenException('Perfil de aluno não encontrado.');
            targetStudentId = student.id;
        }
        else {
            if (!studentId)
                throw new common_1.ForbiddenException('studentId obrigatório para personal.');
            const personal = await this.getPersonalProfile(currentUser.sub);
            await this.assertPersonalOwnsStudent(personal.id, studentId);
            targetStudentId = studentId;
        }
        return this.prisma.deloadPeriod.findMany({
            where: { studentId: targetStudentId },
            orderBy: { startDate: 'desc' },
        });
    }
    async findActive(studentId) {
        const now = new Date();
        return this.prisma.deloadPeriod.findFirst({
            where: {
                studentId,
                status: 'ACTIVE',
                startDate: { lte: now },
                endDate: { gte: now },
            },
        });
    }
    async update(id, dto, currentUser) {
        const personal = await this.getPersonalProfile(currentUser.sub);
        const deload = await this.prisma.deloadPeriod.findUnique({ where: { id } });
        if (!deload)
            throw new common_1.NotFoundException('Período de deload não encontrado.');
        if (deload.personalId !== personal.id)
            throw new common_1.ForbiddenException('Acesso negado.');
        return this.prisma.deloadPeriod.update({
            where: { id },
            data: {
                startDate: dto.startDate ? new Date(dto.startDate) : undefined,
                endDate: dto.endDate ? new Date(dto.endDate) : undefined,
                reductionPercent: dto.reductionPercent,
                reason: dto.reason,
                observations: dto.observations,
                status: dto.status,
            },
        });
    }
    async remove(id, currentUser) {
        const personal = await this.getPersonalProfile(currentUser.sub);
        const deload = await this.prisma.deloadPeriod.findUnique({ where: { id } });
        if (!deload)
            throw new common_1.NotFoundException('Período de deload não encontrado.');
        if (deload.personalId !== personal.id)
            throw new common_1.ForbiddenException('Acesso negado.');
        await this.prisma.deloadPeriod.delete({ where: { id } });
    }
};
exports.DeloadsService = DeloadsService;
exports.DeloadsService = DeloadsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DeloadsService);
//# sourceMappingURL=deloads.service.js.map