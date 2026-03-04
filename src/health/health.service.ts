import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HealthService {
  constructor(private prisma: PrismaService) {}

  async createHealth(data: any, userId: string) {
    try {
      const { title, note, date, category } = data;
      return await this.prisma.health.create({
        data: {
          title,
          note,
          category,
          date: date ? new Date(date) : new Date(),
          userId,
        },
      });
    } catch (error: any) {
      throw new BadRequestException({ error: 'Erro ao registrar dados de saúde', details: error.message });
    }
  }

  async getHealths(userId: string) {
    try {
      return await this.prisma.health.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
      });
    } catch (error) {
      throw new InternalServerErrorException({ error: 'Erro ao procurar registros de saúde' });
    }
  }

  async updateHealth(id: string, data: any, userId: string) {
    try {
      const { title, note, date, category } = data;
      return await this.prisma.health.update({
        where: { id, userId },
        data: {
          title,
          note,
          category,
          date: date ? new Date(date) : undefined,
        },
      });
    } catch (error) {
      throw new BadRequestException({ error: 'Erro ao atualizar registro de saúde' });
    }
  }

  async deleteHealth(id: string, userId: string) {
    try {
      await this.prisma.health.delete({ where: { id, userId } });
      return;
    } catch (error) {
      throw new BadRequestException({ error: 'Erro ao eliminar registro de saúde' });
    }
  }
}
