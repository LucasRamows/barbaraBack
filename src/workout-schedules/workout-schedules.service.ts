import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DayOfWeek, WorkoutSessionStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CurrentUserPayload } from '../auth/current-user.decorator';
import { CreateWorkoutScheduleDto } from './dto/create-schedule.dto';
import { UpdateWorkoutScheduleDto } from './dto/update-schedule.dto';

@Injectable()
export class WorkoutSchedulesService {
  constructor(private prisma: PrismaService) {}

  private readonly detailedPlanInclude = {
    days: {
      orderBy: { order: 'asc' as const },
      include: {
        exercises: {
          orderBy: { order: 'asc' as const },
          include: {
            exercise: {
              include: { images: { orderBy: { order: 'asc' as const } } },
            },
          },
        },
      },
    },
  };

  private async getStudent(userId: string) {
    const profile = await this.prisma.studentProfile.findUnique({
      where: { userId, deletedAt: null },
    });
    if (!profile)
      throw new ForbiddenException('Perfil de aluno não encontrado.');
    return profile;
  }

  private async getPersonal(userId: string) {
    const profile = await this.prisma.personalProfile.findUnique({
      where: { userId, deletedAt: null },
    });
    if (!profile)
      throw new ForbiddenException('Perfil de personal não encontrado.');
    return profile;
  }

  private async assertStudentOwnership(personalId: string, studentId: string) {
    const link = await this.prisma.personalStudent.findFirst({
      where: { personalId, studentId },
    });
    if (!link)
      throw new ForbiddenException('Aluno não pertence a este personal.');
  }

  private async assertPlanOwnership(personalId: string, planId: string) {
    const plan = await this.prisma.workoutPlan.findFirst({
      where: { id: planId, personalId, deletedAt: null },
    });
    if (!plan)
      throw new NotFoundException(
        'Ficha não encontrada ou não pertence a este personal.',
      );
  }

  async create(dto: CreateWorkoutScheduleDto, currentUser: CurrentUserPayload) {
    const personal = await this.getPersonal(currentUser.sub);
    await this.assertStudentOwnership(personal.id, dto.studentId);
    await this.assertPlanOwnership(personal.id, dto.workoutPlanId);

    // Upsert: if same student+day combo exists, update the plan
    const existing = await this.prisma.workoutSchedule.findFirst({
      where: {
        studentId: dto.studentId,
        dayOfWeek: dto.dayOfWeek,
        isActive: true,
      },
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

  async findByStudent(studentId: string, currentUser: CurrentUserPayload) {
    const personal = await this.getPersonal(currentUser.sub);
    await this.assertStudentOwnership(personal.id, studentId);

    return this.prisma.workoutSchedule.findMany({
      where: { studentId, isActive: true },
      include: {
        workoutPlan: { include: this.detailedPlanInclude },
      },
      orderBy: { dayOfWeek: 'asc' },
    });
  }

  async findMine(currentUser: CurrentUserPayload) {
    const profile = await this.getStudent(currentUser.sub);

    return this.prisma.workoutSchedule.findMany({
      where: { studentId: profile.id, isActive: true },
      include: {
        workoutPlan: { include: this.detailedPlanInclude },
      },
      orderBy: { dayOfWeek: 'asc' },
    });
  }

  async findMyWeek(currentUser: CurrentUserPayload, referenceDate?: string) {
    const student = await this.getStudent(currentUser.sub);
    const reference = this.parseReferenceDate(referenceDate);
    const weekStart = new Date(reference);
    const day = weekStart.getUTCDay();
    weekStart.setUTCDate(weekStart.getUTCDate() - (day === 0 ? 6 : day - 1));

    const weekEndExclusive = new Date(weekStart);
    weekEndExclusive.setUTCDate(weekEndExclusive.getUTCDate() + 7);

    const [schedules, sessions] = await this.prisma.$transaction([
      this.prisma.workoutSchedule.findMany({
        where: { studentId: student.id, isActive: true },
        include: { workoutPlan: { include: this.detailedPlanInclude } },
      }),
      this.prisma.workoutSession.findMany({
        where: {
          studentId: student.id,
          startedAt: { gte: weekStart, lt: weekEndExclusive },
          status: { not: WorkoutSessionStatus.CANCELLED },
        },
        select: {
          id: true,
          scheduledPlanId: true,
          planSnapshot: true,
          startedAt: true,
          finishedAt: true,
          durationSeconds: true,
          status: true,
        },
        orderBy: { startedAt: 'desc' },
      }),
    ]);

    const dayNames = [
      DayOfWeek.MONDAY,
      DayOfWeek.TUESDAY,
      DayOfWeek.WEDNESDAY,
      DayOfWeek.THURSDAY,
      DayOfWeek.FRIDAY,
      DayOfWeek.SATURDAY,
      DayOfWeek.SUNDAY,
    ];

    const days = dayNames.map((dayOfWeek, index) => {
      const date = new Date(weekStart);
      date.setUTCDate(date.getUTCDate() + index);
      const schedule = schedules.find(
        (item) =>
          item.dayOfWeek === dayOfWeek &&
          (!item.validFrom || item.validFrom <= date) &&
          (!item.validUntil || item.validUntil >= date),
      );
      const workoutDay = schedule?.workoutPlan.days.find(
        (item) => item.dayOfWeek === dayOfWeek,
      );
      const session = schedule
        ? sessions.find((item) => item.scheduledPlanId === schedule.id)
        : undefined;

      return {
        date: date.toISOString().slice(0, 10),
        dayOfWeek,
        schedule: schedule
          ? {
              id: schedule.id,
              validFrom: schedule.validFrom,
              validUntil: schedule.validUntil,
              workoutPlan: {
                id: schedule.workoutPlan.id,
                name: schedule.workoutPlan.name,
                description: schedule.workoutPlan.description,
                objective: schedule.workoutPlan.objective,
                estimatedMinutes: schedule.workoutPlan.estimatedMinutes,
              },
              workoutDay: workoutDay ?? null,
            }
          : null,
        session: session ?? null,
      };
    });

    const weekEnd = new Date(weekEndExclusive);
    weekEnd.setUTCDate(weekEnd.getUTCDate() - 1);
    return {
      weekStart: weekStart.toISOString().slice(0, 10),
      weekEnd: weekEnd.toISOString().slice(0, 10),
      days,
    };
  }

  private parseReferenceDate(value?: string) {
    if (!value) {
      const now = new Date();
      return new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
      );
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      throw new BadRequestException('date deve estar no formato YYYY-MM-DD.');
    }
    const parsed = new Date(`${value}T00:00:00.000Z`);
    if (
      Number.isNaN(parsed.getTime()) ||
      parsed.toISOString().slice(0, 10) !== value
    ) {
      throw new BadRequestException('date inválida.');
    }
    return parsed;
  }

  async update(
    id: string,
    dto: UpdateWorkoutScheduleDto,
    currentUser: CurrentUserPayload,
  ) {
    const personal = await this.getPersonal(currentUser.sub);
    const schedule = await this.prisma.workoutSchedule.findUnique({
      where: { id },
    });
    if (!schedule) throw new NotFoundException('Programação não encontrada.');
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

  async remove(id: string, currentUser: CurrentUserPayload) {
    const personal = await this.getPersonal(currentUser.sub);
    const schedule = await this.prisma.workoutSchedule.findUnique({
      where: { id },
    });
    if (!schedule) throw new NotFoundException('Programação não encontrada.');
    await this.assertStudentOwnership(personal.id, schedule.studentId);
    await this.prisma.$transaction([
      this.prisma.workoutSession.updateMany({
        where: {
          studentId: schedule.studentId,
          status: WorkoutSessionStatus.IN_PROGRESS,
          OR: [
            { scheduledPlanId: id },
            {
              scheduledPlanId: null,
              workoutPlanId: schedule.workoutPlanId,
            },
          ],
        },
        data: {
          status: WorkoutSessionStatus.CANCELLED,
          finishedAt: new Date(),
          partialReason: 'Treino removido da agenda pelo personal.',
        },
      }),
      this.prisma.workoutSchedule.delete({ where: { id } }),
    ]);
  }
}
