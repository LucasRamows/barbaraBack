import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Role, WorkoutSessionStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CurrentUserPayload } from '../auth/current-user.decorator';
import { LoadProgressionService } from '../load-progression/load-progression.service';
import { StartSessionDto } from './dto/start-session.dto';
import { FinishSessionDto } from './dto/finish-session.dto';
import { WorkoutSessionFilterDto } from './dto/workout-session-filter.dto';
import { RewardAchievementsService } from '../reward-achievements/reward-achievements.service';

@Injectable()
export class WorkoutSessionsService {
  constructor(
    private prisma: PrismaService,
    private loadProgressionService: LoadProgressionService,
    private rewardAchievements: RewardAchievementsService,
  ) {}

  private async getStudentProfile(userId: string) {
    const profile = await this.prisma.studentProfile.findUnique({
      where: { userId },
    });
    if (!profile)
      throw new ForbiddenException('Perfil de aluno não encontrado.');
    return profile;
  }

  private async assertPersonalOwnsStudent(
    personalUserId: string,
    studentId: string,
  ) {
    const personal = await this.prisma.personalProfile.findUnique({
      where: { userId: personalUserId, deletedAt: null },
    });
    if (!personal)
      throw new ForbiddenException('Perfil de personal não encontrado.');

    const link = await this.prisma.personalStudent.findFirst({
      where: { personalId: personal.id, studentId },
    });
    if (!link)
      throw new ForbiddenException('Aluno não pertence a este personal.');
    return personal;
  }

  async start(dto: StartSessionDto, currentUser: CurrentUserPayload) {
    const student = await this.getStudentProfile(currentUser.sub);

    const active = await this.prisma.workoutSession.findFirst({
      where: {
        studentId: student.id,
        status: WorkoutSessionStatus.IN_PROGRESS,
      },
    });
    if (active)
      throw new ConflictException('Você já tem um treino em andamento.');

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
      throw new NotFoundException('Dia de treino não encontrado.');
    }

    const link = await this.prisma.personalStudent.findFirst({
      where: {
        studentId: student.id,
        personalId: planDay.workoutPlan.personalId,
      },
    });
    if (
      !link ||
      !planDay.workoutPlan.isActive ||
      planDay.workoutPlan.deletedAt
    ) {
      throw new ForbiddenException('Ficha não disponível para este aluno.');
    }

    if (dto.scheduledPlanId) {
      const schedule = await this.prisma.workoutSchedule.findFirst({
        where: {
          id: dto.scheduledPlanId,
          studentId: student.id,
          workoutPlanId: dto.workoutPlanId,
          isActive: true,
        },
      });
      if (!schedule) throw new ForbiddenException('Agendamento inválido.');
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

    let session;
    try {
      session = await this.prisma.workoutSession.create({
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
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Você já tem um treino em andamento.');
      }
      throw error;
    }

    return session;
  }

  async findActive(currentUser: CurrentUserPayload) {
    const student = await this.getStudentProfile(currentUser.sub);

    const session = await this.prisma.workoutSession.findFirst({
      where: {
        studentId: student.id,
        status: WorkoutSessionStatus.IN_PROGRESS,
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

    return { session: session ?? null };
  }

  async findAll(
    currentUser: CurrentUserPayload,
    filters: WorkoutSessionFilterDto = new WorkoutSessionFilterDto(),
  ) {
    let targetStudentId: string;

    if (currentUser.role === Role.ALUNO) {
      const student = await this.getStudentProfile(currentUser.sub);
      targetStudentId = student.id;
    } else {
      if (!filters.studentId)
        throw new ForbiddenException('studentId obrigatório para personal.');
      await this.assertPersonalOwnsStudent(currentUser.sub, filters.studentId);
      targetStudentId = filters.studentId;
    }

    const safePage = filters.page;
    const safeLimit = filters.limit;
    const where = {
      studentId: targetStudentId,
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.from || filters.to
        ? {
            startedAt: {
              ...(filters.from ? { gte: new Date(filters.from) } : {}),
              ...(filters.to ? { lte: new Date(filters.to) } : {}),
            },
          }
        : {}),
    };
    const [sessions, total] = await this.prisma.$transaction([
      this.prisma.workoutSession.findMany({
        where,
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
        orderBy: { startedAt: filters.sort.endsWith('.asc') ? 'asc' : 'desc' },
        skip: (safePage - 1) * safeLimit,
        take: safeLimit,
      }),
      this.prisma.workoutSession.count({ where }),
    ]);

    return {
      data: sessions.map((session) => ({
        ...session,
        planName:
          (session.planSnapshot as { planName?: string })?.planName ?? null,
      })),
      total,
      page: safePage,
      limit: safeLimit,
    };
  }

  async findOne(id: string, currentUser: CurrentUserPayload) {
    const session = await this.prisma.workoutSession.findUnique({ where: { id } });

    if (!session) throw new NotFoundException('Sessão não encontrada.');

    if (currentUser.role === Role.ALUNO) {
      const student = await this.getStudentProfile(currentUser.sub);
      if (session.studentId !== student.id)
        throw new ForbiddenException('Acesso negado.');
    } else if (currentUser.role === Role.PERSONAL) {
      await this.assertPersonalOwnsStudent(currentUser.sub, session.studentId);
    }

    return this.prisma.workoutSession.findUnique({
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
  }

  async findCalendar(
    month: string,
    currentUser: CurrentUserPayload,
    studentId?: string,
  ) {
    const [year, monthNumber] = month.split('-').map(Number);
    const start = new Date(Date.UTC(year, monthNumber - 1, 1));
    const end = new Date(Date.UTC(year, monthNumber, 1));
    let targetStudentId: string;

    if (currentUser.role === Role.ALUNO) {
      targetStudentId = (await this.getStudentProfile(currentUser.sub)).id;
    } else {
      if (!studentId)
        throw new ForbiddenException('studentId obrigatório para personal.');
      await this.assertPersonalOwnsStudent(currentUser.sub, studentId);
      targetStudentId = studentId;
    }

    const sessions = await this.prisma.workoutSession.findMany({
      where: {
        studentId: targetStudentId,
        startedAt: { gte: start, lt: end },
      },
      select: { id: true, startedAt: true, status: true },
      orderBy: { startedAt: 'asc' },
    });

    return sessions.reduce<Record<string, typeof sessions>>((days, session) => {
      const day = session.startedAt.toISOString().slice(0, 10);
      (days[day] ??= []).push(session);
      return days;
    }, {});
  }

  async finish(
    id: string,
    dto: FinishSessionDto,
    currentUser: CurrentUserPayload,
  ) {
    const student = await this.getStudentProfile(currentUser.sub);

    const session = await this.prisma.workoutSession.findUnique({
      where: { id },
    });
    if (!session) throw new NotFoundException('Sessão não encontrada.');
    if (session.studentId !== student.id)
      throw new ForbiddenException('Acesso negado.');
    if (session.status !== WorkoutSessionStatus.IN_PROGRESS) {
      throw new ConflictException('Esta sessão não está em andamento.');
    }

    const now = new Date();
    const durationSeconds = Math.floor(
      (now.getTime() - session.startedAt.getTime()) / 1000,
    );

    const updated = await this.prisma.workoutSession.update({
      where: { id },
      data: {
        finishedAt: now,
        durationSeconds,
        status: dto.isPartial
          ? WorkoutSessionStatus.PARTIAL
          : WorkoutSessionStatus.COMPLETED,
        partialReason: dto.isPartial ? dto.partialReason : null,
      },
    });

    this.loadProgressionService.analyzeSession(id).catch(() => {});
    await this.rewardAchievements.enqueueEvaluation(
      session.studentId,
      'WORKOUT_SESSION_FINISHED',
      id,
      { status: updated.status },
    );

    return updated;
  }

  async abandonSession(id: string, currentUser: CurrentUserPayload) {
    const student = await this.getStudentProfile(currentUser.sub);

    const session = await this.prisma.workoutSession.findUnique({
      where: { id },
    });
    if (!session) throw new NotFoundException('Sessão não encontrada.');
    if (session.studentId !== student.id)
      throw new ForbiddenException('Acesso negado.');

    await this.prisma.workoutSession.update({
      where: { id },
      data: {
        status: WorkoutSessionStatus.CANCELLED,
        finishedAt: new Date(),
      },
    });
  }

  async removeFromHistory(id: string, currentUser: CurrentUserPayload) {
    const session = await this.prisma.workoutSession.findUnique({
      where: { id },
      select: {
        id: true,
        studentId: true,
        startedAt: true,
        status: true,
        scheduledPlanId: true,
      },
    });
    if (!session) throw new NotFoundException('Sessão não encontrada.');

    await this.assertPersonalOwnsStudent(currentUser.sub, session.studentId);
    await this.prisma.$transaction([
      this.prisma.workoutSession.delete({ where: { id } }),
      this.prisma.auditLog.create({
        data: {
          userId: currentUser.sub,
          action: 'DELETE_WORKOUT_HISTORY',
          resource: 'WorkoutSession',
          resourceId: id,
          metadata: {
            studentId: session.studentId,
            startedAt: session.startedAt.toISOString(),
            status: session.status,
            scheduledPlanId: session.scheduledPlanId,
          },
        },
      }),
    ]);
  }
}
