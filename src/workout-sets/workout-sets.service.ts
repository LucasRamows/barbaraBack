import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WorkoutSessionStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CurrentUserPayload } from '../auth/current-user.decorator';
import { UpdateWorkoutSetDto } from './dto/update-set.dto';

@Injectable()
export class WorkoutSetsService {
  constructor(private prisma: PrismaService) {}

  private async getStudentProfile(userId: string) {
    const profile = await this.prisma.studentProfile.findUnique({ where: { userId } });
    if (!profile) throw new ForbiddenException('Perfil de aluno não encontrado.');
    return profile;
  }

  private async assertSetOwnership(setId: string, studentId: string) {
    const set = await this.prisma.workoutSet.findUnique({
      where: { id: setId },
      include: {
        sessionExercise: {
          include: { session: true },
        },
      },
    });

    if (!set) throw new NotFoundException('Série não encontrada.');
    if (set.sessionExercise.session.studentId !== studentId) {
      throw new ForbiddenException('Acesso negado.');
    }
    if (set.sessionExercise.session.status !== WorkoutSessionStatus.IN_PROGRESS) {
      throw new ForbiddenException('Esta sessão não está em andamento.');
    }

    return set;
  }

  async update(setId: string, dto: UpdateWorkoutSetDto, currentUser: CurrentUserPayload) {
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

  async addExtraSet(sessionExerciseId: string, currentUser: CurrentUserPayload) {
    const student = await this.getStudentProfile(currentUser.sub);

    const sessionExercise = await this.prisma.workoutSessionExercise.findUnique({
      where: { id: sessionExerciseId },
      include: {
        session: true,
        sets: { orderBy: { setNumber: 'desc' }, take: 1 },
      },
    });

    if (!sessionExercise) throw new NotFoundException('Exercício da sessão não encontrado.');
    if (sessionExercise.session.studentId !== student.id) throw new ForbiddenException('Acesso negado.');
    if (sessionExercise.session.status !== WorkoutSessionStatus.IN_PROGRESS) {
      throw new ForbiddenException('Esta sessão não está em andamento.');
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
}
