import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CurrentUserPayload } from '../auth/current-user.decorator';
import { CreateWorkoutScheduleDto } from './dto/create-schedule.dto';
import { UpdateWorkoutScheduleDto } from './dto/update-schedule.dto';

@Injectable()
export class WorkoutSchedulesService {
  constructor(private prisma: PrismaService) {}

  private async getPersonal(userId: string) {
    const profile = await this.prisma.personalProfile.findUnique({
      where: { userId, deletedAt: null },
    });
    if (!profile) throw new ForbiddenException('Perfil de personal não encontrado.');
    return profile;
  }

  private async assertStudentOwnership(personalId: string, studentId: string) {
    const link = await this.prisma.personalStudent.findFirst({
      where: { personalId, studentId },
    });
    if (!link) throw new ForbiddenException('Aluno não pertence a este personal.');
  }

  private async assertPlanOwnership(personalId: string, planId: string) {
    const plan = await this.prisma.workoutPlan.findFirst({
      where: { id: planId, personalId, deletedAt: null },
    });
    if (!plan) throw new NotFoundException('Ficha não encontrada ou não pertence a este personal.');
  }

  async create(dto: CreateWorkoutScheduleDto, currentUser: CurrentUserPayload) {
    const personal = await this.getPersonal(currentUser.sub);
    await this.assertStudentOwnership(personal.id, dto.studentId);
    await this.assertPlanOwnership(personal.id, dto.workoutPlanId);

    // Upsert: if same student+day combo exists, update the plan
    const existing = await this.prisma.workoutSchedule.findFirst({
      where: { studentId: dto.studentId, dayOfWeek: dto.dayOfWeek, isActive: true },
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
        workoutPlan: { select: { id: true, name: true, estimatedMinutes: true, objective: true } },
      },
      orderBy: { dayOfWeek: 'asc' },
    });
  }

  async findMine(currentUser: CurrentUserPayload) {
    const profile = await this.prisma.studentProfile.findUnique({
      where: { userId: currentUser.sub },
    });
    if (!profile) throw new ForbiddenException('Perfil de aluno não encontrado.');

    return this.prisma.workoutSchedule.findMany({
      where: { studentId: profile.id, isActive: true },
      include: {
        workoutPlan: { select: { id: true, name: true, estimatedMinutes: true, objective: true } },
      },
      orderBy: { dayOfWeek: 'asc' },
    });
  }

  async update(id: string, dto: UpdateWorkoutScheduleDto, currentUser: CurrentUserPayload) {
    const personal = await this.getPersonal(currentUser.sub);
    const schedule = await this.prisma.workoutSchedule.findUnique({ where: { id } });
    if (!schedule) throw new NotFoundException('Programação não encontrada.');
    await this.assertStudentOwnership(personal.id, schedule.studentId);
    if (dto.workoutPlanId) await this.assertPlanOwnership(personal.id, dto.workoutPlanId);

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
    const schedule = await this.prisma.workoutSchedule.findUnique({ where: { id } });
    if (!schedule) throw new NotFoundException('Programação não encontrada.');
    await this.assertStudentOwnership(personal.id, schedule.studentId);
    await this.prisma.workoutSchedule.delete({ where: { id } });
  }
}
