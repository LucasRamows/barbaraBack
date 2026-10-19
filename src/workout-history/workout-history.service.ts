import { ForbiddenException, Injectable } from '@nestjs/common';
import { Role, WorkoutSessionStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CurrentUserPayload } from '../auth/current-user.decorator';

@Injectable()
export class WorkoutHistoryService {
  constructor(private prisma: PrismaService) {}

  async getExerciseHistory(
    exerciseId: string,
    currentUser: CurrentUserPayload,
    studentId?: string,
  ) {
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

    const sessionExercises = await this.prisma.workoutSessionExercise.findMany({
      where: {
        exerciseId,
        session: {
          studentId: targetStudentId,
          status: { in: [WorkoutSessionStatus.COMPLETED, WorkoutSessionStatus.PARTIAL] },
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
        .map((s) => s.usedWeight!);
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
}
