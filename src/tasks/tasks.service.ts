import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async createTask(data: any, userId: string) {
    try {
      const { name, type, description, date, isPriority, reminderTime } = data;
      return await this.prisma.task.create({
        data: {
          name,
          type,
          description,
          isPriority,
          date: new Date(date),
          userId,
          reminders: reminderTime ? {
            create: { time: new Date(reminderTime) }
          } : undefined,
        },
        include: { reminders: true },
      });
    } catch (error: any) {
      throw new BadRequestException({ error: 'Erro ao criar tarefa', details: error.message });
    }
  }

  async getTasks(type: string, priority: string, userId: string) {
    try {
      return await this.prisma.task.findMany({
        where: {
          userId,
          ...(type && { type: String(type) as any }),
          ...(priority && { isPriority: priority as any }),
        },
        include: { reminders: true },
        orderBy: { date: 'asc' },
      });
    } catch (error) {
      throw new InternalServerErrorException({ error: 'Erro ao procurar tarefas' });
    }
  }

  async updateTask(id: string, data: any, userId: string) {
    try {
      const { name, status, description, date, isPriority, reminderTime } = data;
      return await this.prisma.task.update({
        where: { id, userId },
        data: {
          name,
          status,
          description,
          isPriority,
          date: date ? new Date(date) : undefined,
          reminders: reminderTime ? {
            deleteMany: {},
            create: { time: new Date(reminderTime) }
          } : undefined
        },
        include: { reminders: true }
      });
    } catch (error) {
      throw new BadRequestException({ error: 'Erro ao atualizar tarefa' });
    }
  }

  async deleteTask(id: string, userId: string) {
    try {
      await this.prisma.task.delete({ where: { id, userId } });
      return;
    } catch (error) {
      throw new BadRequestException({ error: 'Erro ao eliminar tarefa' });
    }
  }

  async getStatsSummary(userId: string) {
    try {
      return await this.prisma.task.groupBy({
        by: ['status'],
        where: { userId },
        _count: { id: true },
      });
    } catch (error) {
      throw new InternalServerErrorException({ error: 'Erro ao obter estatísticas' });
    }
  }
}
