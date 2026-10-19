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
exports.WorkoutPlansService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const DAY_WITH_EXERCISES = {
    orderBy: { order: 'asc' },
    include: {
        exercises: {
            orderBy: { order: 'asc' },
            include: {
                exercise: {
                    include: { images: { orderBy: { order: 'asc' } } },
                },
            },
        },
    },
};
let WorkoutPlansService = class WorkoutPlansService {
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
    async getOwnedPlan(id, personalId) {
        const plan = await this.prisma.workoutPlan.findFirst({
            where: { id, personalId, deletedAt: null },
        });
        if (!plan)
            throw new common_1.NotFoundException('Ficha não encontrada.');
        return plan;
    }
    async getOwnedDay(planId, dayId, personalId) {
        await this.getOwnedPlan(planId, personalId);
        const day = await this.prisma.workoutPlanDay.findFirst({
            where: { id: dayId, workoutPlanId: planId },
        });
        if (!day)
            throw new common_1.NotFoundException('Dia não encontrado.');
        return day;
    }
    async createPlan(dto, currentUser) {
        const personal = await this.getPersonal(currentUser.sub);
        return this.prisma.workoutPlan.create({
            data: {
                personalId: personal.id,
                name: dto.name,
                description: dto.description,
                objective: dto.objective,
                estimatedMinutes: dto.estimatedMinutes,
            },
        });
    }
    async findAllPlans(currentUser) {
        const personal = await this.getPersonal(currentUser.sub);
        return this.prisma.workoutPlan.findMany({
            where: { personalId: personal.id, deletedAt: null },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOnePlan(id, currentUser) {
        const personal = await this.getPersonal(currentUser.sub);
        const plan = await this.prisma.workoutPlan.findFirst({
            where: { id, personalId: personal.id, deletedAt: null },
            include: { days: DAY_WITH_EXERCISES },
        });
        if (!plan)
            throw new common_1.NotFoundException('Ficha não encontrada.');
        return plan;
    }
    async updatePlan(id, dto, currentUser) {
        const personal = await this.getPersonal(currentUser.sub);
        await this.getOwnedPlan(id, personal.id);
        return this.prisma.workoutPlan.update({
            where: { id },
            data: {
                name: dto.name,
                description: dto.description,
                objective: dto.objective,
                estimatedMinutes: dto.estimatedMinutes,
                isActive: dto.isActive,
            },
        });
    }
    async removePlan(id, currentUser) {
        const personal = await this.getPersonal(currentUser.sub);
        await this.getOwnedPlan(id, personal.id);
        await this.prisma.workoutPlan.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
    async duplicatePlan(id, currentUser) {
        const personal = await this.getPersonal(currentUser.sub);
        const original = await this.prisma.workoutPlan.findFirst({
            where: { id, personalId: personal.id, deletedAt: null },
            include: { days: DAY_WITH_EXERCISES },
        });
        if (!original)
            throw new common_1.NotFoundException('Ficha não encontrada.');
        return this.prisma.$transaction(async (tx) => {
            const copy = await tx.workoutPlan.create({
                data: {
                    personalId: personal.id,
                    name: `${original.name} (cópia)`,
                    description: original.description,
                    objective: original.objective,
                    estimatedMinutes: original.estimatedMinutes,
                    version: 1,
                },
            });
            for (const day of original.days) {
                const newDay = await tx.workoutPlanDay.create({
                    data: {
                        workoutPlanId: copy.id,
                        dayOfWeek: day.dayOfWeek,
                        label: day.label,
                        order: day.order,
                    },
                });
                for (const ex of day.exercises) {
                    await tx.workoutExercise.create({
                        data: {
                            workoutPlanDayId: newDay.id,
                            exerciseId: ex.exerciseId,
                            order: ex.order,
                            sets: ex.sets,
                            minReps: ex.minReps,
                            maxReps: ex.maxReps,
                            weight: ex.weight,
                            weightUnit: ex.weightUnit,
                            restSeconds: ex.restSeconds,
                            rpeTarget: ex.rpeTarget,
                            notes: ex.notes,
                            progressionEnabled: ex.progressionEnabled,
                        },
                    });
                }
            }
            return tx.workoutPlan.findUnique({
                where: { id: copy.id },
                include: { days: DAY_WITH_EXERCISES },
            });
        });
    }
    async createDay(planId, dto, currentUser) {
        const personal = await this.getPersonal(currentUser.sub);
        await this.getOwnedPlan(planId, personal.id);
        return this.prisma.workoutPlanDay.create({
            data: {
                workoutPlanId: planId,
                dayOfWeek: dto.dayOfWeek,
                label: dto.label,
                order: dto.order ?? 0,
            },
        });
    }
    async updateDay(planId, dayId, dto, currentUser) {
        const personal = await this.getPersonal(currentUser.sub);
        await this.getOwnedDay(planId, dayId, personal.id);
        return this.prisma.workoutPlanDay.update({
            where: { id: dayId },
            data: { dayOfWeek: dto.dayOfWeek, label: dto.label, order: dto.order },
        });
    }
    async removeDay(planId, dayId, currentUser) {
        const personal = await this.getPersonal(currentUser.sub);
        await this.getOwnedDay(planId, dayId, personal.id);
        await this.prisma.workoutPlanDay.delete({ where: { id: dayId } });
    }
    async addExerciseToDay(planId, dayId, dto, currentUser) {
        const personal = await this.getPersonal(currentUser.sub);
        await this.getOwnedDay(planId, dayId, personal.id);
        const exercise = await this.prisma.exercise.findFirst({
            where: { id: dto.exerciseId, personalId: personal.id, deletedAt: null },
        });
        if (!exercise)
            throw new common_1.NotFoundException('Exercício não encontrado.');
        const count = await this.prisma.workoutExercise.count({
            where: { workoutPlanDayId: dayId },
        });
        return this.prisma.workoutExercise.create({
            data: {
                workoutPlanDayId: dayId,
                exerciseId: dto.exerciseId,
                order: dto.order ?? count,
                sets: dto.sets,
                minReps: dto.minReps,
                maxReps: dto.maxReps,
                weight: dto.weight,
                weightUnit: dto.weightUnit ?? 'KG',
                restSeconds: dto.restSeconds ?? 60,
                rpeTarget: dto.rpeTarget,
                notes: dto.notes,
                progressionEnabled: dto.progressionEnabled ?? true,
            },
            include: { exercise: { include: { images: true } } },
        });
    }
    async updateExerciseOnDay(planId, dayId, workoutExId, dto, currentUser) {
        const personal = await this.getPersonal(currentUser.sub);
        await this.getOwnedDay(planId, dayId, personal.id);
        const existing = await this.prisma.workoutExercise.findFirst({
            where: { id: workoutExId, workoutPlanDayId: dayId },
        });
        if (!existing)
            throw new common_1.NotFoundException('Exercício na ficha não encontrado.');
        return this.prisma.workoutExercise.update({
            where: { id: workoutExId },
            data: {
                order: dto.order,
                sets: dto.sets,
                minReps: dto.minReps,
                maxReps: dto.maxReps,
                weight: dto.weight,
                weightUnit: dto.weightUnit,
                restSeconds: dto.restSeconds,
                rpeTarget: dto.rpeTarget,
                notes: dto.notes,
                progressionEnabled: dto.progressionEnabled,
            },
            include: { exercise: { include: { images: true } } },
        });
    }
    async removeExerciseFromDay(planId, dayId, workoutExId, currentUser) {
        const personal = await this.getPersonal(currentUser.sub);
        await this.getOwnedDay(planId, dayId, personal.id);
        const existing = await this.prisma.workoutExercise.findFirst({
            where: { id: workoutExId, workoutPlanDayId: dayId },
        });
        if (!existing)
            throw new common_1.NotFoundException('Exercício na ficha não encontrado.');
        await this.prisma.workoutExercise.delete({ where: { id: workoutExId } });
    }
    async reorderExercises(planId, dayId, dto, currentUser) {
        const personal = await this.getPersonal(currentUser.sub);
        await this.getOwnedDay(planId, dayId, personal.id);
        await this.prisma.$transaction(dto.items.map((item) => this.prisma.workoutExercise.update({
            where: { id: item.id },
            data: { order: item.order },
        })));
    }
};
exports.WorkoutPlansService = WorkoutPlansService;
exports.WorkoutPlansService = WorkoutPlansService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WorkoutPlansService);
//# sourceMappingURL=workout-plans.service.js.map