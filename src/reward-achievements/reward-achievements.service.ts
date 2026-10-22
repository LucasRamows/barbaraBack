import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  Prisma,
  RewardAchievementStatus,
  RewardRuleType,
  Role,
  WorkoutSessionStatus,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CurrentUserPayload } from '../auth/current-user.decorator';

type AchievementWithRule = Prisma.RewardAchievementGetPayload<{
  include: { progress: { include: { rule: { include: { gift: true } } } } };
}>;

type ProgressWithRule = Prisma.RewardProgressGetPayload<{
  include: {
    rule: { include: { gift: true } };
    achievements: { select: { createdAt: true } };
  };
}>;

@Injectable()
export class RewardAchievementsService {
  constructor(private prisma: PrismaService) {}

  private async getPersonalProfile(userId: string) {
    const profile = await this.prisma.personalProfile.findUnique({
      where: { userId, deletedAt: null },
    });
    if (!profile)
      throw new ForbiddenException('Perfil de personal não encontrado.');
    return profile;
  }

  private async getStudentProfile(userId: string) {
    const profile = await this.prisma.studentProfile.findUnique({
      where: { userId },
    });
    if (!profile)
      throw new ForbiddenException('Perfil de aluno não encontrado.');
    return profile;
  }

  private async assertPersonalOwnsStudent(
    personalId: string,
    studentId: string,
  ) {
    const link = await this.prisma.personalStudent.findFirst({
      where: { personalId, studentId },
    });
    if (!link)
      throw new ForbiddenException('Aluno não pertence a este personal.');
  }

  private async assertAccess(
    currentUser: CurrentUserPayload,
    studentId: string,
  ) {
    if (currentUser.role === Role.ALUNO) {
      const student = await this.getStudentProfile(currentUser.sub);
      if (student.id !== studentId) throw new ForbiddenException();
    } else if (currentUser.role === Role.PERSONAL) {
      const personal = await this.getPersonalProfile(currentUser.sub);
      await this.assertPersonalOwnsStudent(personal.id, studentId);
    }
  }

  private toAchievementResponse(achievement: AchievementWithRule) {
    const rule = achievement.progress.rule;
    return {
      id: achievement.id,
      studentId: achievement.studentId,
      ruleId: rule.id,
      rule,
      status: achievement.status,
      achievedAt: achievement.createdAt,
      acknowledgedAt: achievement.acknowledgedAt,
      createdAt: achievement.createdAt,
    };
  }

  private toProgressResponse(progress: ProgressWithRule) {
    const target = progress.rule.targetValue;
    const isComplete = target !== null && progress.currentValue >= target;
    const { achievements, ...rest } = progress;
    return {
      ...rest,
      isComplete,
      completedAt: isComplete ? (achievements[0]?.createdAt ?? null) : null,
    };
  }

  private async calculateProgress(
    type: RewardRuleType,
    studentProfileId: string,
    conditions?: Prisma.JsonValue,
  ): Promise<number> {
    const now = new Date();
    const ruleConditions =
      conditions && typeof conditions === 'object' && !Array.isArray(conditions)
        ? (conditions as Record<string, unknown>)
        : {};

    switch (type) {
      case RewardRuleType.TOTAL_WORKOUTS: {
        return this.prisma.workoutSession.count({
          where: {
            studentId: studentProfileId,
            status: {
              in: [
                WorkoutSessionStatus.COMPLETED,
                WorkoutSessionStatus.PARTIAL,
              ],
            },
          },
        });
      }

      case RewardRuleType.WORKOUT_STREAK: {
        // Count distinct weeks (Mon-Sun) in last 12 weeks that had ≥1 session
        const twelveWeeksAgo = new Date(now);
        twelveWeeksAgo.setDate(now.getDate() - 84);
        const sessions = await this.prisma.workoutSession.findMany({
          where: {
            studentId: studentProfileId,
            status: {
              in: [
                WorkoutSessionStatus.COMPLETED,
                WorkoutSessionStatus.PARTIAL,
              ],
            },
            startedAt: { gte: twelveWeeksAgo },
          },
          select: { startedAt: true },
          orderBy: { startedAt: 'desc' },
        });
        const weekSet = new Set<string>();
        for (const s of sessions) {
          const d = new Date(s.startedAt);
          const day = d.getDay();
          const diff = d.getDate() - day + (day === 0 ? -6 : 1);
          const monday = new Date(d.setDate(diff));
          weekSet.add(monday.toISOString().slice(0, 10));
        }
        return weekSet.size;
      }

      case RewardRuleType.WORKOUT_FREQUENCY: {
        // Sessions this month
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        return this.prisma.workoutSession.count({
          where: {
            studentId: studentProfileId,
            status: {
              in: [
                WorkoutSessionStatus.COMPLETED,
                WorkoutSessionStatus.PARTIAL,
              ],
            },
            startedAt: { gte: startOfMonth },
          },
        });
      }

      case RewardRuleType.LOAD_INCREASE: {
        const result = await this.prisma.workoutSet.aggregate({
          where: {
            sessionExercise: { session: { studentId: studentProfileId } },
            usedWeight: { not: null },
          },
          _max: { usedWeight: true },
        });
        return result._max.usedWeight ?? 0;
      }

      case RewardRuleType.EXERCISE_GOAL: {
        const condition = ruleConditions as { exerciseId?: string };
        if (!condition.exerciseId) return 0;
        return this.prisma.workoutSet.count({
          where: {
            sessionExercise: {
              exerciseId: condition.exerciseId,
              session: {
                studentId: studentProfileId,
                status: { in: [WorkoutSessionStatus.COMPLETED, WorkoutSessionStatus.PARTIAL] },
              },
            },
          },
        });
      }

      case RewardRuleType.SPECIFIC_WORKOUT:
        return this.prisma.workoutSession.count({
          where: {
            studentId: studentProfileId,
            ...(typeof ruleConditions.workoutPlanId === 'string'
              ? { workoutPlanId: ruleConditions.workoutPlanId }
              : {}),
            status: { in: [WorkoutSessionStatus.COMPLETED, WorkoutSessionStatus.PARTIAL] },
          },
        });

      case RewardRuleType.BODY_MEASUREMENT:
        return this.prisma.bodyMeasurement.count({ where: { studentId: studentProfileId } });

      case RewardRuleType.CUSTOM:
        throw new BadRequestException('Regras CUSTOM não possuem executor automático.');

      default:
        return 0;
    }
  }

  async checkAndUpdate(studentId: string, currentUser: CurrentUserPayload) {
    const personal = await this.getPersonalProfile(currentUser.sub);
    await this.assertPersonalOwnsStudent(personal.id, studentId);

    const studentProfile = await this.prisma.studentProfile.findUnique({
      where: { id: studentId },
    });
    if (!studentProfile) throw new NotFoundException('Aluno não encontrado.');

    const rules = await this.prisma.rewardRule.findMany({
      where: { personalId: personal.id, isActive: true },
    });

    const results: Array<{
      ruleId: string;
      currentValue: number;
      targetValue: number | null;
      isComplete: boolean;
    }> = [];

    for (const rule of rules) {
      if (rule.type === RewardRuleType.CUSTOM) {
        throw new BadRequestException(`Regra ${rule.id} é CUSTOM e não pode ser executada.`);
      }
      const currentValue = await this.calculateProgress(
        rule.type,
        studentId,
        rule.conditions,
      );

      const cycleKey = this.getCycleKey(rule.period, new Date());
      await this.prisma.rewardProgress.upsert({
        where: { studentId_ruleId: { studentId, ruleId: rule.id } },
        create: { studentId, ruleId: rule.id, currentValue },
        update: { currentValue },
      });

      const isComplete =
        rule.targetValue !== null && currentValue >= rule.targetValue;

      if (isComplete) {
        const progress = await this.prisma.rewardProgress.findUnique({
          where: { studentId_ruleId: { studentId, ruleId: rule.id } },
          include: {
            achievements: {
              where: {
                cycleKey,
                status: {
                  notIn: [
                    RewardAchievementStatus.REJECTED,
                    RewardAchievementStatus.CANCELLED,
                  ],
                },
              },
            },
          },
        });

        if (progress && progress.achievements.length === 0) {
          await this.prisma.rewardAchievement.create({
            data: {
              studentId,
              progressId: progress.id,
              status: rule.requiresApproval
                ? RewardAchievementStatus.AWAITING_APPROVAL
                : RewardAchievementStatus.ACHIEVED,
              cycleKey,
            },
          });
        }

      }

      results.push({
        ruleId: rule.id,
        currentValue,
        targetValue: rule.targetValue,
        isComplete,
      });
    }

    return results;
  }

  async findAchievements(studentId: string, currentUser: CurrentUserPayload) {
    await this.assertAccess(currentUser, studentId);
    const achievements = await this.prisma.rewardAchievement.findMany({
      where: { studentId },
      orderBy: { createdAt: 'desc' },
      include: {
        progress: {
          include: { rule: { include: { gift: true } } },
        },
      },
    });
    return achievements.map((achievement) =>
      this.toAchievementResponse(achievement),
    );
  }

  async getProgress(studentId: string, currentUser: CurrentUserPayload) {
    await this.assertAccess(currentUser, studentId);
    const progress = await this.prisma.rewardProgress.findMany({
      where: { studentId },
      include: {
        rule: { include: { gift: true } },
        achievements: {
          select: { createdAt: true },
          orderBy: { createdAt: 'asc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
    return progress.map((item) => this.toProgressResponse(item));
  }

  async acknowledge(id: string, currentUser: CurrentUserPayload) {
    const achievement = await this.prisma.rewardAchievement.findUnique({
      where: { id },
      include: { progress: { include: { rule: { include: { gift: true } } } } },
    });
    if (!achievement) throw new NotFoundException('Conquista não encontrada.');

    const student = await this.getStudentProfile(currentUser.sub);
    if (achievement.studentId !== student.id) {
      throw new ForbiddenException('Acesso negado.');
    }

    const updated = await this.prisma.rewardAchievement.update({
      where: { id },
      data: { acknowledgedAt: new Date() },
      include: { progress: { include: { rule: { include: { gift: true } } } } },
    });
    return this.toAchievementResponse(updated);
  }

  async updateStatus(
    id: string,
    status: RewardAchievementStatus,
    currentUser: CurrentUserPayload,
    notes?: string,
  ) {
    const achievement = await this.prisma.rewardAchievement.findUnique({
      where: { id },
      include: { progress: { include: { rule: true } } },
    });
    if (!achievement) throw new NotFoundException('Conquista não encontrada.');

    if (currentUser.role === Role.PERSONAL) {
      const personal = await this.getPersonalProfile(currentUser.sub);
      if (achievement.progress.rule.personalId !== personal.id)
        throw new ForbiddenException();
    } else {
      throw new ForbiddenException(
        'Somente o personal pode alterar o estado da conquista.',
      );
    }

    const allowed = this.isValidTransition(achievement.status, status);
    if (!allowed) {
      throw new ForbiddenException(
        `Transição inválida de ${achievement.status} para ${status}.`,
      );
    }

    const now = new Date();
    const updateData: Prisma.RewardAchievementUpdateInput = { status, notes };

    if (status === RewardAchievementStatus.APPROVED) {
      updateData.approvedById = currentUser.sub;
      updateData.approvedAt = now;
    } else if (status === RewardAchievementStatus.REJECTED) {
      updateData.rejectedById = currentUser.sub;
      updateData.rejectedAt = now;
    } else if (status === RewardAchievementStatus.DELIVERED) {
      updateData.deliveredById = currentUser.sub;
      updateData.deliveredAt = now;
    }

    return this.prisma.rewardAchievement.update({
      where: { id },
      data: updateData,
      include: { progress: { include: { rule: { include: { gift: true } } } } },
    });
  }

  private getCycleKey(period: string | null, at: Date): string {
    if (!period || period === 'lifetime') return 'lifetime';
    if (period === 'week') {
      const date = new Date(at);
      const day = date.getUTCDay() || 7;
      date.setUTCDate(date.getUTCDate() - day + 1);
      return date.toISOString().slice(0, 10);
    }
    if (period === 'month') return at.toISOString().slice(0, 7);
    if (period === 'year') return at.toISOString().slice(0, 4);
    return period;
  }

  private isValidTransition(
    from: RewardAchievementStatus,
    to: RewardAchievementStatus,
  ): boolean {
    const transitions: Record<RewardAchievementStatus, RewardAchievementStatus[]> = {
      IN_PROGRESS: [RewardAchievementStatus.ACHIEVED, RewardAchievementStatus.CANCELLED],
      ACHIEVED: [
        RewardAchievementStatus.AWAITING_APPROVAL,
        RewardAchievementStatus.APPROVED,
        RewardAchievementStatus.CANCELLED,
      ],
      AWAITING_APPROVAL: [
        RewardAchievementStatus.APPROVED,
        RewardAchievementStatus.REJECTED,
        RewardAchievementStatus.CANCELLED,
      ],
      APPROVED: [RewardAchievementStatus.DELIVERED, RewardAchievementStatus.CANCELLED],
      REJECTED: [RewardAchievementStatus.AWAITING_APPROVAL, RewardAchievementStatus.CANCELLED],
      DELIVERED: [],
      CANCELLED: [],
    };
    return from === to || transitions[from].includes(to);
  }

  async enqueueEvaluation(
    studentId: string,
    eventType: 'WORKOUT_SESSION_FINISHED' | 'BODY_MEASUREMENT_CHANGED',
    eventId: string,
    payload?: Record<string, unknown>,
  ) {
    return this.prisma.gamificationEvaluationJob.upsert({
      where: { eventKey: `${eventType}:${eventId}` },
      create: {
        eventKey: `${eventType}:${eventId}`,
        eventType,
        eventId,
        studentId,
        payload: payload as Prisma.InputJsonValue | undefined,
      },
      update: {},
    });
  }

  async processPendingJobs(currentUser: CurrentUserPayload) {
    if (
      currentUser.role !== Role.PERSONAL &&
      currentUser.role !== Role.SUPER_ADMIN
    ) {
      throw new ForbiddenException('Apenas equipe autorizada pode processar jobs.');
    }
    const jobs = await this.prisma.gamificationEvaluationJob.findMany({
      where: { status: 'PENDING', availableAt: { lte: new Date() } },
      orderBy: { createdAt: 'asc' },
      take: 25,
    });
    const results: Array<{ id: string; status: string; error?: string }> = [];
    for (const job of jobs) {
      const claimed = await this.prisma.gamificationEvaluationJob.updateMany({
        where: { id: job.id, status: 'PENDING' },
        data: { status: 'PROCESSING', lockedAt: new Date(), lockedBy: currentUser.sub, attempts: { increment: 1 } },
      });
      if (!claimed.count) continue;
      try {
        const personal = await this.prisma.personalProfile.findFirst({
          where: { userId: currentUser.sub, deletedAt: null },
          select: { id: true },
        });
        if (currentUser.role === Role.PERSONAL && personal) {
          await this.assertPersonalOwnsStudent(personal.id, job.studentId);
        }
        await this.evaluateForStudent(job.studentId);
        await this.prisma.gamificationEvaluationJob.update({
          where: { id: job.id },
          data: { status: 'COMPLETED', completedAt: new Date(), lockedAt: null, lockedBy: null },
        });
        results.push({ id: job.id, status: 'COMPLETED' });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Falha desconhecida';
        await this.prisma.gamificationEvaluationJob.update({
          where: { id: job.id },
          data: {
            status: job.attempts + 1 >= 5 ? 'FAILED' : 'PENDING',
            availableAt: new Date(Date.now() + Math.min(300000, 1000 * 2 ** job.attempts)),
            lastError: message,
            lockedAt: null,
            lockedBy: null,
          },
        });
        results.push({ id: job.id, status: 'FAILED', error: message });
      }
    }
    return results;
  }

  async reprocessJob(id: string, currentUser: CurrentUserPayload) {
    if (
      currentUser.role !== Role.PERSONAL &&
      currentUser.role !== Role.SUPER_ADMIN
    ) {
      throw new ForbiddenException('Apenas equipe autorizada pode reprocessar jobs.');
    }
    const job = await this.prisma.gamificationEvaluationJob.findUnique({
      where: { id },
    });
    if (!job) throw new NotFoundException('Job de avaliação não encontrado.');
    if (currentUser.role === Role.PERSONAL) {
      const personal = await this.getPersonalProfile(currentUser.sub);
      await this.assertPersonalOwnsStudent(personal.id, job.studentId);
    }
    return this.prisma.gamificationEvaluationJob.update({
      where: { id },
      data: {
        status: 'PENDING',
        availableAt: new Date(),
        lockedAt: null,
        lockedBy: null,
        lastError: null,
      },
    });
  }

  private async evaluateForStudent(studentId: string) {
    const links = await this.prisma.personalStudent.findMany({ where: { studentId }, select: { personalId: true } });
    for (const link of links) {
      await this.checkAndUpdate(studentId, {
        sub: (await this.prisma.personalProfile.findUnique({ where: { id: link.personalId }, select: { userId: true } }))!.userId,
        role: Role.PERSONAL,
      });
    }
  }
}
