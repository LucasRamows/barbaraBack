import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
import { CurrentUserPayload } from '../auth/current-user.decorator';
import { CreateWorkoutPlanDto } from './dto/create-plan.dto';
import { UpdateWorkoutPlanDto } from './dto/update-plan.dto';
import { CreatePlanDayDto } from './dto/create-plan-day.dto';
import { UpdatePlanDayDto } from './dto/update-plan-day.dto';
import { AddExerciseToDayDto } from './dto/add-exercise-to-day.dto';
import { UpdateExerciseOnDayDto } from './dto/update-exercise-on-day.dto';
import { ReorderExercisesDto } from './dto/reorder-exercises.dto';

const DAY_WITH_EXERCISES = {
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
};

@Injectable()
export class WorkoutPlansService {
  constructor(private prisma: PrismaService) {}

  private async getPersonal(userId: string) {
    const profile = await this.prisma.personalProfile.findUnique({
      where: { userId, deletedAt: null },
    });
    if (!profile)
      throw new ForbiddenException('Perfil de personal não encontrado.');
    return profile;
  }

  private async getOwnedPlan(id: string, personalId: string) {
    const plan = await this.prisma.workoutPlan.findFirst({
      where: { id, personalId, deletedAt: null },
    });
    if (!plan) throw new NotFoundException('Ficha não encontrada.');
    return plan;
  }

  private async getOwnedDay(planId: string, dayId: string, personalId: string) {
    await this.getOwnedPlan(planId, personalId);
    const day = await this.prisma.workoutPlanDay.findFirst({
      where: { id: dayId, workoutPlanId: planId },
    });
    if (!day) throw new NotFoundException('Dia não encontrado.');
    return day;
  }

  // ---- PLANS ----

  async createPlan(dto: CreateWorkoutPlanDto, currentUser: CurrentUserPayload) {
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

  async findAllPlans(currentUser: CurrentUserPayload) {
    if (currentUser.role === Role.ALUNO) {
      const student = await this.prisma.studentProfile.findUnique({
        where: { userId: currentUser.sub, deletedAt: null },
      });
      if (!student)
        throw new ForbiddenException('Perfil de aluno não encontrado.');

      return this.prisma.workoutPlan.findMany({
        where: {
          deletedAt: null,
          isActive: true,
          personal: { students: { some: { studentId: student.id } } },
        },
        orderBy: { createdAt: 'desc' },
        include: { days: DAY_WITH_EXERCISES },
      });
    }

    const personal = await this.getPersonal(currentUser.sub);
    return this.prisma.workoutPlan.findMany({
      where: { personalId: personal.id, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOnePlan(id: string, currentUser: CurrentUserPayload) {
    if (currentUser.role === Role.ALUNO) {
      const student = await this.prisma.studentProfile.findUnique({
        where: { userId: currentUser.sub, deletedAt: null },
      });
      if (!student)
        throw new ForbiddenException('Perfil de aluno não encontrado.');

      const plan = await this.prisma.workoutPlan.findFirst({
        where: {
          id,
          deletedAt: null,
          isActive: true,
          personal: { students: { some: { studentId: student.id } } },
        },
        include: { days: DAY_WITH_EXERCISES },
      });
      if (!plan) throw new NotFoundException('Ficha não encontrada.');
      return plan;
    }

    const personal = await this.getPersonal(currentUser.sub);
    const plan = await this.prisma.workoutPlan.findFirst({
      where: { id, personalId: personal.id, deletedAt: null },
      include: { days: DAY_WITH_EXERCISES },
    });
    if (!plan) throw new NotFoundException('Ficha não encontrada.');
    return plan;
  }

  async updatePlan(
    id: string,
    dto: UpdateWorkoutPlanDto,
    currentUser: CurrentUserPayload,
  ) {
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

  async removePlan(id: string, currentUser: CurrentUserPayload) {
    const personal = await this.getPersonal(currentUser.sub);
    await this.getOwnedPlan(id, personal.id);
    await this.prisma.workoutPlan.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async duplicatePlan(id: string, currentUser: CurrentUserPayload) {
    const personal = await this.getPersonal(currentUser.sub);
    const original = await this.prisma.workoutPlan.findFirst({
      where: { id, personalId: personal.id, deletedAt: null },
      include: { days: DAY_WITH_EXERCISES },
    });
    if (!original) throw new NotFoundException('Ficha não encontrada.');

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

  // ---- DAYS ----

  async createDay(
    planId: string,
    dto: CreatePlanDayDto,
    currentUser: CurrentUserPayload,
  ) {
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

  async updateDay(
    planId: string,
    dayId: string,
    dto: UpdatePlanDayDto,
    currentUser: CurrentUserPayload,
  ) {
    const personal = await this.getPersonal(currentUser.sub);
    await this.getOwnedDay(planId, dayId, personal.id);
    return this.prisma.workoutPlanDay.update({
      where: { id: dayId },
      data: { dayOfWeek: dto.dayOfWeek, label: dto.label, order: dto.order },
    });
  }

  async removeDay(
    planId: string,
    dayId: string,
    currentUser: CurrentUserPayload,
  ) {
    const personal = await this.getPersonal(currentUser.sub);
    await this.getOwnedDay(planId, dayId, personal.id);
    await this.prisma.workoutPlanDay.delete({ where: { id: dayId } });
  }

  // ---- EXERCISES ON DAY ----

  async addExerciseToDay(
    planId: string,
    dayId: string,
    dto: AddExerciseToDayDto,
    currentUser: CurrentUserPayload,
  ) {
    const personal = await this.getPersonal(currentUser.sub);
    await this.getOwnedDay(planId, dayId, personal.id);

    const exercise = await this.prisma.exercise.findFirst({
      where: { id: dto.exerciseId, personalId: personal.id, deletedAt: null },
    });
    if (!exercise) throw new NotFoundException('Exercício não encontrado.');

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

  async updateExerciseOnDay(
    planId: string,
    dayId: string,
    workoutExId: string,
    dto: UpdateExerciseOnDayDto,
    currentUser: CurrentUserPayload,
  ) {
    const personal = await this.getPersonal(currentUser.sub);
    await this.getOwnedDay(planId, dayId, personal.id);

    const existing = await this.prisma.workoutExercise.findFirst({
      where: { id: workoutExId, workoutPlanDayId: dayId },
    });
    if (!existing)
      throw new NotFoundException('Exercício na ficha não encontrado.');

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

  async removeExerciseFromDay(
    planId: string,
    dayId: string,
    workoutExId: string,
    currentUser: CurrentUserPayload,
  ) {
    const personal = await this.getPersonal(currentUser.sub);
    await this.getOwnedDay(planId, dayId, personal.id);

    const existing = await this.prisma.workoutExercise.findFirst({
      where: { id: workoutExId, workoutPlanDayId: dayId },
    });
    if (!existing)
      throw new NotFoundException('Exercício na ficha não encontrado.');

    await this.prisma.workoutExercise.delete({ where: { id: workoutExId } });
  }

  async reorderExercises(
    planId: string,
    dayId: string,
    dto: ReorderExercisesDto,
    currentUser: CurrentUserPayload,
  ) {
    const personal = await this.getPersonal(currentUser.sub);
    await this.getOwnedDay(planId, dayId, personal.id);

    await this.prisma.$transaction(
      dto.items.map((item) =>
        this.prisma.workoutExercise.update({
          where: { id: item.id },
          data: { order: item.order },
        }),
      ),
    );
  }
}
