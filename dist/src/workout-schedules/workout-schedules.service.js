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
exports.WorkoutSchedulesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let WorkoutSchedulesService = class WorkoutSchedulesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getPersonal(userId) {
        const profile = await this.prisma.personalProfile.findUnique({
            where: { userId, deletedAt: null },
        });
        if (!profile)
            throw new common_1.ForbiddenException('Perfil de personal não encontrado.');
        return profile;
    }
    async assertStudentOwnership(personalId, studentId) {
        const link = await this.prisma.personalStudent.findFirst({
            where: { personalId, studentId },
        });
        if (!link)
            throw new common_1.ForbiddenException('Aluno não pertence a este personal.');
    }
    async assertPlanOwnership(personalId, planId) {
        const plan = await this.prisma.workoutPlan.findFirst({
            where: { id: planId, personalId, deletedAt: null },
        });
        if (!plan)
            throw new common_1.NotFoundException('Ficha não encontrada ou não pertence a este personal.');
    }
    async create(dto, currentUser) {
        const personal = await this.getPersonal(currentUser.sub);
        await this.assertStudentOwnership(personal.id, dto.studentId);
        await this.assertPlanOwnership(personal.id, dto.workoutPlanId);
        const existing = await this.prisma.workoutSchedule.findFirst({
            where: { studentId: dto.studentId, dayOfWeek: dto.dayOfWeek, isActive: true },
        });
        if (existing) {
            return this.prisma.workoutSchedule.update({
                where: { id: existing.id },
                data: {
                    workoutPlanId: dto.workoutPlanId,
                    validFrom: dto.validFrom ? new Date(dto.validFrom) : undefined,
                    validUntil: dto.validUntil ? new Date(dto.validUntil) : undefined,
                },
                include: { workoutPlan: { select: { id: true, name: true } } },
            });
        }
        return this.prisma.workoutSchedule.create({
            data: {
                studentId: dto.studentId,
                workoutPlanId: dto.workoutPlanId,
                dayOfWeek: dto.dayOfWeek,
                validFrom: dto.validFrom ? new Date(dto.validFrom) : undefined,
                validUntil: dto.validUntil ? new Date(dto.validUntil) : undefined,
            },
            include: { workoutPlan: { select: { id: true, name: true } } },
        });
    }
    async findByStudent(studentId, currentUser) {
        const personal = await this.getPersonal(currentUser.sub);
        await this.assertStudentOwnership(personal.id, studentId);
        return this.prisma.workoutSchedule.findMany({
            where: { studentId, isActive: true },
            include: {
                workoutPlan: { select: { id: true, name: true, estimatedMinutes: true, objective: true } },
            },
            orderBy: { dayOfWeek: 'asc' },
        });
    }
    async update(id, dto, currentUser) {
        const personal = await this.getPersonal(currentUser.sub);
        const schedule = await this.prisma.workoutSchedule.findUnique({ where: { id } });
        if (!schedule)
            throw new common_1.NotFoundException('Programação não encontrada.');
        await this.assertStudentOwnership(personal.id, schedule.studentId);
        if (dto.workoutPlanId)
            await this.assertPlanOwnership(personal.id, dto.workoutPlanId);
        return this.prisma.workoutSchedule.update({
            where: { id },
            data: {
                workoutPlanId: dto.workoutPlanId,
                dayOfWeek: dto.dayOfWeek,
                validFrom: dto.validFrom ? new Date(dto.validFrom) : undefined,
                validUntil: dto.validUntil ? new Date(dto.validUntil) : undefined,
            },
            include: { workoutPlan: { select: { id: true, name: true } } },
        });
    }
    async remove(id, currentUser) {
        const personal = await this.getPersonal(currentUser.sub);
        const schedule = await this.prisma.workoutSchedule.findUnique({ where: { id } });
        if (!schedule)
            throw new common_1.NotFoundException('Programação não encontrada.');
        await this.assertStudentOwnership(personal.id, schedule.studentId);
        await this.prisma.workoutSchedule.delete({ where: { id } });
    }
};
exports.WorkoutSchedulesService = WorkoutSchedulesService;
exports.WorkoutSchedulesService = WorkoutSchedulesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WorkoutSchedulesService);
//# sourceMappingURL=workout-schedules.service.js.map