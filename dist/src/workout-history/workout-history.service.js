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
exports.WorkoutHistoryService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let WorkoutHistoryService = class WorkoutHistoryService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getExerciseHistory(exerciseId, currentUser, studentId) {
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
            const personal = await this.prisma.personalProfile.findUnique({
                where: { userId: currentUser.sub, deletedAt: null },
            });
            if (!personal)
                throw new common_1.ForbiddenException('Perfil de personal não encontrado.');
            const link = await this.prisma.personalStudent.findFirst({
                where: { personalId: personal.id, studentId },
            });
            if (!link)
                throw new common_1.ForbiddenException('Aluno não pertence a este personal.');
            targetStudentId = studentId;
        }
        const sessionExercises = await this.prisma.workoutSessionExercise.findMany({
            where: {
                exerciseId,
                session: {
                    studentId: targetStudentId,
                    status: { in: [client_1.WorkoutSessionStatus.COMPLETED, client_1.WorkoutSessionStatus.PARTIAL] },
                },
            },
            include: {
                session: {
                    select: {
                        id: true,
                        startedAt: true,
                        isDeload: true,
                        status: true,
                    },
                },
                sets: { orderBy: { setNumber: 'asc' } },
            },
            orderBy: { session: { startedAt: 'asc' } },
            take: 50,
        });
        return sessionExercises.map((se) => {
            const usedWeights = se.sets
                .filter((s) => s.usedWeight !== null)
                .map((s) => s.usedWeight);
            const maxWeight = usedWeights.length > 0 ? Math.max(...usedWeights) : null;
            return {
                sessionId: se.session.id,
                date: se.session.startedAt,
                isDeload: se.session.isDeload,
                sessionStatus: se.session.status,
                sets: se.sets.map((s) => ({
                    setNumber: s.setNumber,
                    usedWeight: s.usedWeight,
                    completedReps: s.completedReps,
                    rpe: s.rpe,
                    isCompleted: s.isCompleted,
                })),
                maxWeight,
            };
        });
    }
};
exports.WorkoutHistoryService = WorkoutHistoryService;
exports.WorkoutHistoryService = WorkoutHistoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WorkoutHistoryService);
//# sourceMappingURL=workout-history.service.js.map