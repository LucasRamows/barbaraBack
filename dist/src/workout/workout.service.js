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
exports.WorkoutService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let WorkoutService = class WorkoutService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createPlan(data, userId) {
        try {
            const { name, description } = data;
            return await this.prisma.workoutPlan.create({
                data: { name, description, userId },
            });
        }
        catch (error) {
            throw new common_1.BadRequestException({ error: "Erro ao criar plano de treino", details: error.message });
        }
    }
    async getPlans(userId) {
        try {
            return await this.prisma.workoutPlan.findMany({
                where: { userId },
                include: { days: { include: { exercises: { include: { exercise: true } } } } },
            });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException({ error: "Erro ao buscar planos de treino" });
        }
    }
    async updatePlan(id, data, userId) {
        try {
            const { name, description, isActive } = data;
            return await this.prisma.workoutPlan.update({
                where: { id, userId },
                data: { name, description, isActive },
            });
        }
        catch (error) {
            throw new common_1.BadRequestException({ error: "Erro ao atualizar plano" });
        }
    }
    async deletePlan(id, userId) {
        try {
            await this.prisma.workoutPlan.delete({ where: { id, userId } });
            return;
        }
        catch (error) {
            throw new common_1.BadRequestException({ error: "Erro ao remover plano" });
        }
    }
    async addDayToPlan(planId, data, userId) {
        try {
            const { day, label } = data;
            const plan = await this.prisma.workoutPlan.findFirst({ where: { id: planId, userId } });
            if (!plan)
                throw new common_1.NotFoundException({ error: "Plano não encontrado" });
            return await this.prisma.workoutDay.create({
                data: { day, label, workoutPlanId: planId },
            });
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.BadRequestException({ error: "Erro ao adicionar dia de treino", details: error.message });
        }
    }
    async addExerciseToDay(dayId, data) {
        try {
            const { exerciseId, order, sets, reps, weight, restTime } = data;
            return await this.prisma.exerciseOnDay.create({
                data: { order, sets, reps, weight, restTime, exerciseId, workoutDayId: dayId },
            });
        }
        catch (error) {
            throw new common_1.BadRequestException({ error: "Erro ao adicionar exercício", details: error.message });
        }
    }
    async updateExerciseOnDay(id, data) {
        try {
            const { order, sets, reps, weight, restTime, exerciseId } = data;
            return await this.prisma.exerciseOnDay.update({
                where: { id },
                data: { order, sets, reps, weight, restTime, exerciseId },
                include: { exercise: true },
            });
        }
        catch (error) {
            throw new common_1.BadRequestException({ error: "Erro ao atualizar exercício no dia" });
        }
    }
    getTodayEnum() {
        const jsDay = new Date().getDay();
        switch (jsDay) {
            case 0: return client_1.DayOfWeek.SUNDAY;
            case 1: return client_1.DayOfWeek.MONDAY;
            case 2: return client_1.DayOfWeek.TUESDAY;
            case 3: return client_1.DayOfWeek.WEDNESDAY;
            case 4: return client_1.DayOfWeek.THURSDAY;
            case 5: return client_1.DayOfWeek.FRIDAY;
            case 6: return client_1.DayOfWeek.SATURDAY;
            default: throw new Error("Dia inválido");
        }
    }
    async getExercisesToday(phone) {
        try {
            const user = await this.prisma.user.findUnique({ where: { phone } });
            if (!user)
                throw new common_1.NotFoundException({ error: "Usuário não encontrado" });
            const today = this.getTodayEnum();
            const workoutDays = await this.prisma.workoutDay.findMany({
                where: { day: today, workoutPlan: { userId: user.id, isActive: true } },
                include: { exercises: { orderBy: { order: "asc" }, include: { exercise: true } } },
            });
            return workoutDays.flatMap(day => day.exercises.map(e => ({
                id: e.exercise.id,
                name: e.exercise.name,
                targetMuscle: e.exercise.targetMuscle,
                videoUrl: e.exercise.videoUrl,
                order: e.order,
                sets: e.sets,
                reps: e.reps,
                weight: e.weight,
                restTime: e.restTime,
                plan: e.id,
            })));
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            throw new common_1.InternalServerErrorException({ error: "Erro ao buscar exercícios" });
        }
    }
    async createExercise(data) {
        try {
            const { name, targetMuscle, videoUrl } = data;
            if (!name || !targetMuscle)
                throw new common_1.BadRequestException({ error: "Nome e músculo alvo são obrigatórios" });
            return await this.prisma.exercise.create({
                data: { name, targetMuscle, videoUrl },
            });
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException)
                throw error;
            if (error.code === "P2002")
                throw new common_1.ConflictException({ error: "Já existe um exercício com esse nome" });
            throw new common_1.BadRequestException({ error: "Erro ao criar exercício", details: error.message });
        }
    }
    async getExercises(search) {
        try {
            return await this.prisma.exercise.findMany({
                where: search ? { name: { contains: search, mode: "insensitive" } } : undefined,
                orderBy: { name: "asc" },
            });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException({ error: "Erro ao buscar exercícios", details: error.message });
        }
    }
    async deleteExerciseOnDay(id) {
        try {
            await this.prisma.exerciseOnDay.delete({ where: { id } });
            return;
        }
        catch (error) {
            throw new common_1.BadRequestException({ error: "Erro ao remover exercício", details: error.message });
        }
    }
};
exports.WorkoutService = WorkoutService;
exports.WorkoutService = WorkoutService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WorkoutService);
//# sourceMappingURL=workout.service.js.map