import { Injectable, NotFoundException } from '@nestjs/common';
import { UserStatus, WorkoutSessionStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const monday = new Date(now);
    monday.setDate(diff);
    monday.setHours(0, 0, 0, 0);

    const [totalPersonals, totalStudents, totalSessions, sessionsThisWeek, pendingSuggestions] =
      await Promise.all([
        this.prisma.personalProfile.count({ where: { deletedAt: null } }),
        this.prisma.studentProfile.count({ where: { deletedAt: null } }),
        this.prisma.workoutSession.count({
          where: { status: { in: [WorkoutSessionStatus.COMPLETED, WorkoutSessionStatus.PARTIAL] } },
        }),
        this.prisma.workoutSession.count({
          where: {
            status: { in: [WorkoutSessionStatus.COMPLETED, WorkoutSessionStatus.PARTIAL] },
            startedAt: { gte: monday },
          },
        }),
        this.prisma.loadSuggestion.count({ where: { isAccepted: null } }),
      ]);

    return { totalPersonals, totalStudents, totalSessions, sessionsThisWeek, pendingSuggestions };
  }

  async getPersonals() {
    const personals = await this.prisma.personalProfile.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, username: true, status: true, createdAt: true } },
        _count: { select: { students: true } },
      },
    });
    return personals;
  }

  async updatePersonalStatus(userId: string, status: UserStatus) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuário não encontrado.');
    return this.prisma.user.update({
      where: { id: userId },
      data: { status },
      select: { id: true, username: true, status: true },
    });
  }
}
