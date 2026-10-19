import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LoadChangeOrigin, Role, WorkoutSessionStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CurrentUserPayload } from '../auth/current-user.decorator';

const PAIN_KEYWORDS = ['dor', 'dói', 'lesão', 'machucou', 'machuca', 'lesionei'];

@Injectable()
export class LoadProgressionService {
  constructor(private prisma: PrismaService) {}

  async analyzeSession(sessionId: string): Promise<void> {
    const session = await this.prisma.workoutSession.findUnique({
      where: { id: sessionId },
      include: {
        exercises: {
          where: { isCompleted: true },
        },
      },
    });

    if (!session) return;
    if (session.status !== WorkoutSessionStatus.COMPLETED) return;
    if (session.isDeload) return;

    for (const exercise of session.exercises) {
      await this.analyzeExercise(session.studentId, exercise.exerciseId).catch(() => {});
    }
  }

  private async analyzeExercise(studentId: string, exerciseId: string): Promise<void> {
    const link = await this.prisma.personalStudent.findFirst({
      where: { studentId },
    });
    if (!link) return;

    const exercise = await this.prisma.exercise.findUnique({
      where: { id: exerciseId },
    });
    if (!exercise) return;

    // Find rule: specific by exerciseId match via muscleGroup or default
    const rules = await this.prisma.loadProgressionRule.findMany({
      where: { personalId: link.personalId },
      orderBy: [{ isDefault: 'asc' }, { createdAt: 'asc' }],
    });

    let rule = rules.find((r) => r.muscleGroup === exercise.muscleGroup && !r.isDefault);
    if (!rule) rule = rules.find((r) => r.isDefault);
    if (!rule) return;

    const sessions = await this.prisma.workoutSession.findMany({
      where: {
        studentId,
        status: WorkoutSessionStatus.COMPLETED,
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

    if (sessions.length < rule.sessionsRequired) return;

    // Check criteria
    for (const sess of sessions) {
      const exInSession = sess.exercises[0];
      if (!exInSession) return;

      const allSetsCompleted = exInSession.sets.every((s) => s.isCompleted);
      if (!allSetsCompleted) return;

      const allRepsOk = exInSession.sets.every(
        (s) => (s.completedReps ?? 0) >= exercise.maxReps,
      );
      if (!allRepsOk) return;

      const rpeValues = exInSession.sets.filter((s) => s.rpe !== null).map((s) => s.rpe!);
      if (rpeValues.length > 0) {
        const avgRpe = rpeValues.reduce((a, b) => a + b, 0) / rpeValues.length;
        if (avgRpe > rule.maxRpe) return;
      }

      const hasPain = exInSession.sets.some((s) => {
        if (!s.notes) return false;
        const lower = s.notes.toLowerCase();
        return PAIN_KEYWORDS.some((kw) => lower.includes(kw));
      });
      if (hasPain) return;
    }

    // Check no existing pending suggestion
    const existing = await this.prisma.loadSuggestion.findFirst({
      where: { studentId, exerciseId, isAccepted: null },
    });
    if (existing) return;

    const lastSession = sessions[0];
    const lastExercise = lastSession.exercises[0];
    const lastSets = lastSession.exercises[0]?.sets ?? [];
    const lastSet = lastSets[lastSets.length - 1];
    const currentWeight = lastSet?.usedWeight ?? lastSet?.plannedWeight ?? 0;
    if (!currentWeight) return;

    let suggestedWeight = currentWeight;
    if (rule.incrementFixed) {
      suggestedWeight = currentWeight + rule.incrementFixed;
    } else if (rule.incrementPercent) {
      suggestedWeight = currentWeight * (1 + rule.incrementPercent / 100);
    }

    if (rule.roundingStep) {
      suggestedWeight = Math.round(suggestedWeight / rule.roundingStep) * rule.roundingStep;
    }

    suggestedWeight = Math.max(rule.minWeight ?? 0, suggestedWeight);
    if (rule.maxWeight) {
      suggestedWeight = Math.min(rule.maxWeight, suggestedWeight);
    }

    const rpeValues = lastExercise.sets.filter((s) => s.rpe !== null).map((s) => s.rpe!);
    const avgRpe =
      rpeValues.length > 0
        ? rpeValues.reduce((a, b) => a + b, 0) / rpeValues.length
        : 0;

    const justification =
      `Nas últimas ${rule.sessionsRequired} sessões, você completou todas as séries com ` +
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

  async getSuggestions(currentUser: CurrentUserPayload, studentId?: string) {
    let targetStudentId: string;

    if (currentUser.role === Role.ALUNO) {
      const student = await this.prisma.studentProfile.findUnique({
        where: { userId: currentUser.sub },
      });
      if (!student) throw new ForbiddenException('Perfil de aluno não encontrado.');
      targetStudentId = student.id;
    } else {
      if (!studentId) throw new ForbiddenException('studentId obrigatório para personal.');
      const personal = await this.prisma.personalProfile.findUnique({
        where: { userId: currentUser.sub, deletedAt: null },
      });
      if (!personal) throw new ForbiddenException('Perfil de personal não encontrado.');
      const link = await this.prisma.personalStudent.findFirst({
        where: { personalId: personal.id, studentId },
      });
      if (!link) throw new ForbiddenException('Aluno não pertence a este personal.');
      targetStudentId = studentId;
    }

    return this.prisma.loadSuggestion.findMany({
      where: { studentId: targetStudentId, isAccepted: null },
      orderBy: { createdAt: 'desc' },
    });
  }

  async respondSuggestion(
    id: string,
    isAccepted: boolean,
    currentUser: CurrentUserPayload,
  ) {
    const suggestion = await this.prisma.loadSuggestion.findUnique({ where: { id } });
    if (!suggestion) throw new NotFoundException('Sugestão não encontrada.');

    if (currentUser.role === Role.ALUNO) {
      const student = await this.prisma.studentProfile.findUnique({
        where: { userId: currentUser.sub },
      });
      if (!student || suggestion.studentId !== student.id) {
        throw new ForbiddenException('Acesso negado.');
      }
    } else if (currentUser.role === Role.PERSONAL) {
      const personal = await this.prisma.personalProfile.findUnique({
        where: { userId: currentUser.sub, deletedAt: null },
      });
      if (!personal) throw new ForbiddenException('Perfil de personal não encontrado.');
      const link = await this.prisma.personalStudent.findFirst({
        where: { personalId: personal.id, studentId: suggestion.studentId },
      });
      if (!link) throw new ForbiddenException('Acesso negado.');
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
          origin: LoadChangeOrigin.ALGORITHMIC,
          reason: 'Sugestão de progressão de carga aceita',
        },
      });
    }

    return updated;
  }
}
