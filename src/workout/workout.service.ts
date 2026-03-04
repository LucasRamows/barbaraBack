import { Injectable, BadRequestException, InternalServerErrorException, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DayOfWeek } from '@prisma/client';

@Injectable()
export class WorkoutService {
  constructor(private prisma: PrismaService) {}

  async createPlan(data: any, userId: string) {
    try {
      const { name, description } = data;
      return await this.prisma.workoutPlan.create({
        data: { name, description, userId },
      });
    } catch (error: any) {
      throw new BadRequestException({ error: "Erro ao criar plano de treino", details: error.message });
    }
  }

  async getPlans(userId: string) {
    try {
      return await this.prisma.workoutPlan.findMany({
        where: { userId },
        include: { days: { include: { exercises: { include: { exercise: true } } } } },
      });
    } catch (error) {
      throw new InternalServerErrorException({ error: "Erro ao buscar planos de treino" });
    }
  }

  async updatePlan(id: string, data: any, userId: string) {
    try {
      const { name, description, isActive } = data;
      return await this.prisma.workoutPlan.update({
        where: { id, userId },
        data: { name, description, isActive },
      });
    } catch (error) {
      throw new BadRequestException({ error: "Erro ao atualizar plano" });
    }
  }

  async deletePlan(id: string, userId: string) {
    try {
      await this.prisma.workoutPlan.delete({ where: { id, userId } });
      return;
    } catch (error) {
      throw new BadRequestException({ error: "Erro ao remover plano" });
    }
  }

  async addDayToPlan(planId: string, data: any, userId: string) {
    try {
      const { day, label } = data;
      const plan = await this.prisma.workoutPlan.findFirst({ where: { id: planId, userId } });
      if (!plan) throw new NotFoundException({ error: "Plano não encontrado" });

      return await this.prisma.workoutDay.create({
        data: { day, label, workoutPlanId: planId },
      });
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException({ error: "Erro ao adicionar dia de treino", details: error.message });
    }
  }

  async addExerciseToDay(dayId: string, data: any) {
    try {
      const { exerciseId, order, sets, reps, weight, restTime } = data;
      return await this.prisma.exerciseOnDay.create({
        data: { order, sets, reps, weight, restTime, exerciseId, workoutDayId: dayId },
      });
    } catch (error: any) {
      throw new BadRequestException({ error: "Erro ao adicionar exercício", details: error.message });
    }
  }

  async updateExerciseOnDay(id: string, data: any) {
    try {
      const { order, sets, reps, weight, restTime, exerciseId } = data;
      return await this.prisma.exerciseOnDay.update({
        where: { id },
        data: { order, sets, reps, weight, restTime, exerciseId },
        include: { exercise: true },
      });
    } catch (error) {
      throw new BadRequestException({ error: "Erro ao atualizar exercício no dia" });
    }
  }

  getTodayEnum(): DayOfWeek {
    const jsDay = new Date().getDay();
    switch (jsDay) {
      case 0: return DayOfWeek.SUNDAY;
      case 1: return DayOfWeek.MONDAY;
      case 2: return DayOfWeek.TUESDAY;
      case 3: return DayOfWeek.WEDNESDAY;
      case 4: return DayOfWeek.THURSDAY;
      case 5: return DayOfWeek.FRIDAY;
      case 6: return DayOfWeek.SATURDAY;
      default: throw new Error("Dia inválido");
    }
  }

  async getExercisesToday(phone: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { phone } });
      if (!user) throw new NotFoundException({ error: "Usuário não encontrado" });

      const today = this.getTodayEnum();
      const workoutDays = await this.prisma.workoutDay.findMany({
        where: { day: today, workoutPlan: { userId: user.id, isActive: true } },
        include: { exercises: { orderBy: { order: "asc" }, include: { exercise: true } } },
      });

      return workoutDays.flatMap(day =>
        day.exercises.map(e => ({
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
        }))
      );
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException({ error: "Erro ao buscar exercícios" });
    }
  }

  async createExercise(data: any) {
    try {
      const { name, targetMuscle, videoUrl } = data;
      if (!name || !targetMuscle) throw new BadRequestException({ error: "Nome e músculo alvo são obrigatórios" });

      return await this.prisma.exercise.create({
        data: { name, targetMuscle, videoUrl },
      });
    } catch (error: any) {
      if (error instanceof BadRequestException) throw error;
      if (error.code === "P2002") throw new ConflictException({ error: "Já existe um exercício com esse nome" });
      throw new BadRequestException({ error: "Erro ao criar exercício", details: error.message });
    }
  }

  async getExercises(search: string) {
    try {
      return await this.prisma.exercise.findMany({
        where: search ? { name: { contains: search, mode: "insensitive" } } : undefined,
        orderBy: { name: "asc" },
      });
    } catch (error: any) {
      throw new InternalServerErrorException({ error: "Erro ao buscar exercícios", details: error.message });
    }
  }

  async deleteExerciseOnDay(id: string) {
    try {
      await this.prisma.exerciseOnDay.delete({ where: { id } });
      return;
    } catch (error: any) {
      throw new BadRequestException({ error: "Erro ao remover exercício", details: error.message });
    }
  }
}
