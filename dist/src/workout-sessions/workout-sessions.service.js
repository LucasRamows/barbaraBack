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
exports.WorkoutSessionsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const load_progression_service_1 = require("../load-progression/load-progression.service");
let WorkoutSessionsService = class WorkoutSessionsService {
    prisma;
    loadProgressionService;
    constructor(prisma, loadProgressionService) {
        this.prisma = prisma;
        this.loadProgressionService = loadProgressionService;
    }
    async getStudentProfile(userId) {
        const profile = await this.prisma.studentProfile.findUnique({
            where: { userId },
        });
        if (!profile)
            throw new common_1.ForbiddenException('Perfil de aluno não encontrado.');
        return profile;
    }
    async assertPersonalOwnsStudent(personalUserId, studentId) {
        const personal = await this.prisma.personalProfile.findUnique({
            where: { userId: personalUserId, deletedAt: null },
        });
        if (!personal)
            throw new common_1.ForbiddenException('Perfil de personal não encontrado.');
        const link = await this.prisma.personalStudent.findFirst({
            where: { personalId: personal.id, studentId },
        });
        if (!link)
            throw new common_1.ForbiddenException('Aluno não pertence a este personal.');
        return personal;
    }
    async start(dto, currentUser) {
        const student = await this.getStudentProfile(currentUser.sub);
        const active = await this.prisma.workoutSession.findFirst({
            where: { studentId: student.id, status: client_1.WorkoutSessionStatus.IN_PROGRESS },
        });
        if (active)
            throw new common_1.ConflictException('Você já tem um treino em andamento.');
        const planDay = await this.prisma.workoutPlanDay.findUnique({
            where: { id: dto.workoutPlanDayId },
            include: {
                exercises: {
                    orderBy: { order: 'asc' },
                    include: {
                        exercise: {
                            include: { images: { take: 1 } },
                        },
                    },
                },
                workoutPlan: true,
            },
        });
        if (!planDay || planDay.workoutPlanId !== dto.workoutPlanId) {
            throw new common_1.NotFoundException('Dia de treino não encontrado.');
        }
        const now = new Date();
        const activeDeload = await this.prisma.deloadPeriod.findFirst({
            where: {
                studentId: student.id,
                startDate: { lte: now },
                endDate: { gte: now },
                status: 'ACTIVE',
            },
        });
        const isDeload = !!activeDeload;
        const reductionPercent = activeDeload?.reductionPercent ?? 0;
        const planSnapshot = {
            planId: planDay.workoutPlanId,
            planName: planDay.workoutPlan.name,
            dayId: planDay.id,
            dayLabel: planDay.label ?? planDay.dayOfWeek,
            exercises: planDay.exercises.map((we) => ({
                id: we.id,
                exerciseId: we.exerciseId,
                name: we.exercise.name,
                muscleGroup: we.exercise.muscleGroup,
                sets: we.sets,
                minReps: we.minReps,
                maxReps: we.maxReps,
                weight: we.weight,
                weightUnit: we.weightUnit,
                restSeconds: we.restSeconds,
                rpeTarget: we.rpeTarget,
                order: we.order,
            })),
        };
        const session = await this.prisma.workoutSession.create({
            data: {
                studentId: student.id,
                workoutPlanId: dto.workoutPlanId,
                scheduledPlanId: dto.scheduledPlanId,
                planSnapshot,
                isDeload,
                exercises: {
                    create: planDay.exercises.map((we) => ({
                        exerciseId: we.exerciseId,
                        exerciseName: we.exercise.name,
                        exerciseSnapshot: {
                            exerciseId: we.exerciseId,
                            name: we.exercise.name,
                            muscleGroup: we.exercise.muscleGroup,
                            sets: we.sets,
                            minReps: we.minReps,
                            maxReps: we.maxReps,
                            weight: we.weight,
                            weightUnit: we.weightUnit,
                            restSeconds: we.restSeconds,
                            rpeTarget: we.rpeTarget,
                            imageUrl: we.exercise.images[0]?.url ?? null,
                        },
                        order: we.order,
                        sets: {
                            create: Array.from({ length: we.sets }, (_, i) => {
                                let plannedWeight = we.weight ?? null;
                                if (isDeload && plannedWeight !== null) {
                                    const reduced = plannedWeight * (1 - reductionPercent / 100);
                                    plannedWeight = Math.round(reduced * 2) / 2;
                                    plannedWeight = Math.max(0, plannedWeight);
                                }
                                return {
                                    setNumber: i + 1,
                                    plannedReps: we.minReps,
                                    plannedWeight,
                                    weightUnit: we.weightUnit,
                                };
                            }),
                        },
                    })),
                },
            },
            include: {
                exercises: {
                    orderBy: { order: 'asc' },
                    include: {
                        sets: { orderBy: { setNumber: 'asc' } },
                    },
                },
            },
        });
        return session;
    }
    async findActive(currentUser) {
        const student = await this.getStudentProfile(currentUser.sub);
        const session = await this.prisma.workoutSession.findFirst({
            where: { studentId: student.id, status: client_1.WorkoutSessionStatus.IN_PROGRESS },
            include: {
                exercises: {
                    orderBy: { order: 'asc' },
                    include: {
                        sets: { orderBy: { setNumber: 'asc' } },
                    },
                },
            },
        });
        return { session: session ?? null };
    }
    async findAll(currentUser, studentId, skip = 0, take = 20) {
        let targetStudentId;
        if (currentUser.role === client_1.Role.ALUNO) {
            const student = await this.getStudentProfile(currentUser.sub);
            targetStudentId = student.id;
        }
        else {
            if (!studentId)
                throw new common_1.ForbiddenException('studentId obrigatório para personal.');
            await this.assertPersonalOwnsStudent(currentUser.sub, studentId);
            targetStudentId = studentId;
        }
        const sessions = await this.prisma.workoutSession.findMany({
            where: { studentId: targetStudentId },
            select: {
                id: true,
                startedAt: true,
                finishedAt: true,
                status: true,
                durationSeconds: true,
                isDeload: true,
                partialReason: true,
                planSnapshot: true,
            },
            orderBy: { startedAt: 'desc' },
            skip,
            take,
        });
        return sessions.map((s) => ({
            ...s,
            planName: s.planSnapshot?.planName ?? null,
        }));
    }
    async findOne(id, currentUser) {
        const session = await this.prisma.workoutSession.findUnique({
            where: { id },
            include: {
                exercises: {
                    orderBy: { order: 'asc' },
                    include: {
                        sets: { orderBy: { setNumber: 'asc' } },
                    },
                },
            },
        });
        if (!session)
            throw new common_1.NotFoundException('Sessão não encontrada.');
        if (currentUser.role === client_1.Role.ALUNO) {
            const student = await this.getStudentProfile(currentUser.sub);
            if (session.studentId !== student.id)
                throw new common_1.ForbiddenException('Acesso negado.');
        }
        else if (currentUser.role === client_1.Role.PERSONAL) {
            await this.assertPersonalOwnsStudent(currentUser.sub, session.studentId);
        }
        return session;
    }
    async finish(id, dto, currentUser) {
        const student = await this.getStudentProfile(currentUser.sub);
        const session = await this.prisma.workoutSession.findUnique({ where: { id } });
        if (!session)
            throw new common_1.NotFoundException('Sessão não encontrada.');
        if (session.studentId !== student.id)
            throw new common_1.ForbiddenException('Acesso negado.');
        if (session.status !== client_1.WorkoutSessionStatus.IN_PROGRESS) {
            throw new common_1.ConflictException('Esta sessão não está em andamento.');
        }
        const now = new Date();
        const durationSeconds = Math.floor((now.getTime() - session.startedAt.getTime()) / 1000);
        const updated = await this.prisma.workoutSession.update({
            where: { id },
            data: {
                finishedAt: now,
                durationSeconds,
                status: dto.isPartial ? client_1.WorkoutSessionStatus.PARTIAL : client_1.WorkoutSessionStatus.COMPLETED,
                partialReason: dto.isPartial ? dto.partialReason : null,
            },
        });
        this.loadProgressionService.analyzeSession(id).catch(() => { });
        return updated;
    }
    async abandonSession(id, currentUser) {
        const student = await this.getStudentProfile(currentUser.sub);
        const session = await this.prisma.workoutSession.findUnique({ where: { id } });
        if (!session)
            throw new common_1.NotFoundException('Sessão não encontrada.');
        if (session.studentId !== student.id)
            throw new common_1.ForbiddenException('Acesso negado.');
        await this.prisma.workoutSession.update({
            where: { id },
            data: {
                status: client_1.WorkoutSessionStatus.CANCELLED,
                finishedAt: new Date(),
            },
        });
    }
};
exports.WorkoutSessionsService = WorkoutSessionsService;
exports.WorkoutSessionsService = WorkoutSessionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        load_progression_service_1.LoadProgressionService])
], WorkoutSessionsService);
//# sourceMappingURL=workout-sessions.service.js.map