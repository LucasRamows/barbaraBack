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
exports.WorkoutSetsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let WorkoutSetsService = class WorkoutSetsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStudentProfile(userId) {
        const profile = await this.prisma.studentProfile.findUnique({ where: { userId } });
        if (!profile)
            throw new common_1.ForbiddenException('Perfil de aluno não encontrado.');
        return profile;
    }
    async assertSetOwnership(setId, studentId) {
        const set = await this.prisma.workoutSet.findUnique({
            where: { id: setId },
            include: {
                sessionExercise: {
                    include: { session: true },
                },
            },
        });
        if (!set)
            throw new common_1.NotFoundException('Série não encontrada.');
        if (set.sessionExercise.session.studentId !== studentId) {
            throw new common_1.ForbiddenException('Acesso negado.');
        }
        if (set.sessionExercise.session.status !== client_1.WorkoutSessionStatus.IN_PROGRESS) {
            throw new common_1.ForbiddenException('Esta sessão não está em andamento.');
        }
        return set;
    }
    async update(setId, dto, currentUser) {
        const student = await this.getStudentProfile(currentUser.sub);
        const set = await this.assertSetOwnership(setId, student.id);
        const completedAt = dto.isCompleted ? new Date() : set.completedAt;
        const updated = await this.prisma.workoutSet.update({
            where: { id: setId },
            data: {
                completedReps: dto.completedReps ?? set.completedReps,
                usedWeight: dto.usedWeight !== undefined ? dto.usedWeight : set.usedWeight,
                rpe: dto.rpe ?? set.rpe,
                isCompleted: dto.isCompleted ?? set.isCompleted,
                notes: dto.notes !== undefined ? dto.notes : set.notes,
                completedAt,
            },
        });
        if (dto.isCompleted) {
            const allSets = await this.prisma.workoutSet.findMany({
                where: { sessionExerciseId: set.sessionExerciseId },
            });
            const allDone = allSets.every((s) => s.isCompleted);
            if (allDone) {
                await this.prisma.workoutSessionExercise.update({
                    where: { id: set.sessionExerciseId },
                    data: { isCompleted: true },
                });
            }
        }
        return updated;
    }
    async addExtraSet(sessionExerciseId, currentUser) {
        const student = await this.getStudentProfile(currentUser.sub);
        const sessionExercise = await this.prisma.workoutSessionExercise.findUnique({
            where: { id: sessionExerciseId },
            include: {
                session: true,
                sets: { orderBy: { setNumber: 'desc' }, take: 1 },
            },
        });
        if (!sessionExercise)
            throw new common_1.NotFoundException('Exercício da sessão não encontrado.');
        if (sessionExercise.session.studentId !== student.id)
            throw new common_1.ForbiddenException('Acesso negado.');
        if (sessionExercise.session.status !== client_1.WorkoutSessionStatus.IN_PROGRESS) {
            throw new common_1.ForbiddenException('Esta sessão não está em andamento.');
        }
        const lastSet = sessionExercise.sets[0];
        const newSetNumber = lastSet ? lastSet.setNumber + 1 : 1;
        return this.prisma.workoutSet.create({
            data: {
                sessionExerciseId,
                setNumber: newSetNumber,
                plannedReps: lastSet?.plannedReps ?? 8,
                plannedWeight: lastSet?.plannedWeight ?? null,
                weightUnit: lastSet?.weightUnit ?? 'KG',
            },
        });
    }
};
exports.WorkoutSetsService = WorkoutSetsService;
exports.WorkoutSetsService = WorkoutSetsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WorkoutSetsService);
//# sourceMappingURL=workout-sets.service.js.map