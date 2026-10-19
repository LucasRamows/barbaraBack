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
exports.LoadProgressionService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const PAIN_KEYWORDS = ['dor', 'dói', 'lesão', 'machucou', 'machuca', 'lesionei'];
let LoadProgressionService = class LoadProgressionService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async analyzeSession(sessionId) {
        const session = await this.prisma.workoutSession.findUnique({
            where: { id: sessionId },
            include: {
                exercises: {
                    where: { isCompleted: true },
                },
            },
        });
        if (!session)
            return;
        if (session.status !== client_1.WorkoutSessionStatus.COMPLETED)
            return;
        if (session.isDeload)
            return;
        for (const exercise of session.exercises) {
            await this.analyzeExercise(session.studentId, exercise.exerciseId).catch(() => { });
        }
    }
    async analyzeExercise(studentId, exerciseId) {
        const link = await this.prisma.personalStudent.findFirst({
            where: { studentId },
        });
        if (!link)
            return;
        const exercise = await this.prisma.exercise.findUnique({
            where: { id: exerciseId },
        });
        if (!exercise)
            return;
        const rules = await this.prisma.loadProgressionRule.findMany({
            where: { personalId: link.personalId },
            orderBy: [{ isDefault: 'asc' }, { createdAt: 'asc' }],
        });
        let rule = rules.find((r) => r.muscleGroup === exercise.muscleGroup && !r.isDefault);
        if (!rule)
            rule = rules.find((r) => r.isDefault);
        if (!rule)
            return;
        const sessions = await this.prisma.workoutSession.findMany({
            where: {
                studentId,
                status: client_1.WorkoutSessionStatus.COMPLETED,
                isDeload: false,
                exercises: { some: { exerciseId } },
            },
            include: {
                exercises: {
                    where: { exerciseId },
                    include: {
                        sets: { orderBy: { setNumber: 'asc' } },
                    },
                },
            },
            orderBy: { startedAt: 'desc' },
            take: rule.sessionsRequired,
        });
        if (sessions.length < rule.sessionsRequired)
            return;
        for (const sess of sessions) {
            const exInSession = sess.exercises[0];
            if (!exInSession)
                return;
            const allSetsCompleted = exInSession.sets.every((s) => s.isCompleted);
            if (!allSetsCompleted)
                return;
            const allRepsOk = exInSession.sets.every((s) => (s.completedReps ?? 0) >= exercise.maxReps);
            if (!allRepsOk)
                return;
            const rpeValues = exInSession.sets.filter((s) => s.rpe !== null).map((s) => s.rpe);
            if (rpeValues.length > 0) {
                const avgRpe = rpeValues.reduce((a, b) => a + b, 0) / rpeValues.length;
                if (avgRpe > rule.maxRpe)
                    return;
            }
            const hasPain = exInSession.sets.some((s) => {
                if (!s.notes)
                    return false;
                const lower = s.notes.toLowerCase();
                return PAIN_KEYWORDS.some((kw) => lower.includes(kw));
            });
            if (hasPain)
                return;
        }
        const existing = await this.prisma.loadSuggestion.findFirst({
            where: { studentId, exerciseId, isAccepted: null },
        });
        if (existing)
            return;
        const lastSession = sessions[0];
        const lastExercise = lastSession.exercises[0];
        const lastSets = lastSession.exercises[0]?.sets ?? [];
        const lastSet = lastSets[lastSets.length - 1];
        const currentWeight = lastSet?.usedWeight ?? lastSet?.plannedWeight ?? 0;
        if (!currentWeight)
            return;
        let suggestedWeight = currentWeight;
        if (rule.incrementFixed) {
            suggestedWeight = currentWeight + rule.incrementFixed;
        }
        else if (rule.incrementPercent) {
            suggestedWeight = currentWeight * (1 + rule.incrementPercent / 100);
        }
        if (rule.roundingStep) {
            suggestedWeight = Math.round(suggestedWeight / rule.roundingStep) * rule.roundingStep;
        }
        suggestedWeight = Math.max(rule.minWeight ?? 0, suggestedWeight);
        if (rule.maxWeight) {
            suggestedWeight = Math.min(rule.maxWeight, suggestedWeight);
        }
        const rpeValues = lastExercise.sets.filter((s) => s.rpe !== null).map((s) => s.rpe);
        const avgRpe = rpeValues.length > 0
            ? rpeValues.reduce((a, b) => a + b, 0) / rpeValues.length
            : 0;
        const justification = `Nas últimas ${rule.sessionsRequired} sessões, você completou todas as séries com ` +
            `${exercise.maxReps} repetições e RPE médio de ${avgRpe.toFixed(1)}. ` +
            `Sugerimos aumentar a carga de ${currentWeight}kg para ${suggestedWeight}kg.`;
        await this.prisma.loadSuggestion.create({
            data: {
                studentId,
                exerciseId,
                currentWeight,
                suggestedWeight,
                justification,
            },
        });
    }
    async getSuggestions(currentUser, studentId) {
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
        return this.prisma.loadSuggestion.findMany({
            where: { studentId: targetStudentId, isAccepted: null },
            orderBy: { createdAt: 'desc' },
        });
    }
    async respondSuggestion(id, isAccepted, currentUser) {
        const suggestion = await this.prisma.loadSuggestion.findUnique({ where: { id } });
        if (!suggestion)
            throw new common_1.NotFoundException('Sugestão não encontrada.');
        if (currentUser.role === client_1.Role.ALUNO) {
            const student = await this.prisma.studentProfile.findUnique({
                where: { userId: currentUser.sub },
            });
            if (!student || suggestion.studentId !== student.id) {
                throw new common_1.ForbiddenException('Acesso negado.');
            }
        }
        else if (currentUser.role === client_1.Role.PERSONAL) {
            const personal = await this.prisma.personalProfile.findUnique({
                where: { userId: currentUser.sub, deletedAt: null },
            });
            if (!personal)
                throw new common_1.ForbiddenException('Perfil de personal não encontrado.');
            const link = await this.prisma.personalStudent.findFirst({
                where: { personalId: personal.id, studentId: suggestion.studentId },
            });
            if (!link)
                throw new common_1.ForbiddenException('Acesso negado.');
        }
        const now = new Date();
        const updated = await this.prisma.loadSuggestion.update({
            where: { id },
            data: {
                isAccepted,
                acceptedAt: isAccepted ? now : null,
                rejectedAt: isAccepted ? null : now,
            },
        });
        if (isAccepted) {
            const exercise = await this.prisma.exercise.findUnique({
                where: { id: suggestion.exerciseId },
            });
            await this.prisma.loadChangeHistory.create({
                data: {
                    studentId: suggestion.studentId,
                    exerciseId: suggestion.exerciseId,
                    exerciseName: exercise?.name ?? 'Exercício',
                    previousWeight: suggestion.currentWeight,
                    newWeight: suggestion.suggestedWeight,
                    changedById: currentUser.sub,
                    origin: client_1.LoadChangeOrigin.ALGORITHMIC,
                    reason: 'Sugestão de progressão de carga aceita',
                },
            });
        }
        return updated;
    }
};
exports.LoadProgressionService = LoadProgressionService;
exports.LoadProgressionService = LoadProgressionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LoadProgressionService);
//# sourceMappingURL=load-progression.service.js.map