import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FinanceService {
  constructor(private prisma: PrismaService) {}

  async createTransaction(data: any, userId: string) {
    try {
      const { description, amount, type, category, date } = data;
      const transaction = await this.prisma.transaction.create({
        data: {
          description,
          amount: parseFloat(amount),
          type,
          category,
          date: date ? new Date(date) : new Date(),
          userId,
        },
      });
      return transaction;
    } catch (error: any) {
      throw new BadRequestException({ error: 'Erro ao registar transação', details: error.message });
    }
  }

  async getTransactions(month: string, year: string, userId: string) {
    try {
      const now = new Date();
      const targetMonth = month ? parseInt(month) - 1 : now.getMonth();
      const targetYear = year ? parseInt(year) : now.getFullYear();

      const startDate = new Date(targetYear, targetMonth, 1);
      const endDate = new Date(targetYear, targetMonth + 1, 0);

      return await this.prisma.transaction.findMany({
        where: { userId, date: { gte: startDate, lte: endDate } },
        orderBy: { date: 'desc' },
      });
    } catch (error) {
      throw new InternalServerErrorException({ error: 'Erro ao procurar transações' });
    }
  }

  async getSummary(userId: string) {
    try {
      const transactions = await this.prisma.transaction.findMany({ where: { userId } });
      const summary = transactions.reduce(
        (acc: any, curr: any) => {
          if (curr.type === 'INCOME') {
            acc.income += curr.amount;
          } else {
            acc.expense += curr.amount;
          }
          acc.balance = acc.income - acc.expense;
          return acc;
        },
        { income: 0, expense: 0, balance: 0 }
      );
      return summary;
    } catch (error) {
      throw new InternalServerErrorException({ error: 'Erro ao gerar resumo financeiro' });
    }
  }

  async updateTransaction(id: string, data: any, userId: string) {
    try {
      const { description, amount, type, category, date } = data;
      return await this.prisma.transaction.update({
        where: { id, userId },
        data: {
          description,
          amount: amount ? parseFloat(amount) : undefined,
          type,
          category,
          date: date ? new Date(date) : undefined,
        },
      });
    } catch (error) {
      throw new BadRequestException({ error: 'Erro ao atualizar transação' });
    }
  }

  async deleteTransaction(id: string, userId: string) {
    try {
      await this.prisma.transaction.delete({ where: { id, userId } });
      return;
    } catch (error) {
      throw new BadRequestException({ error: 'Erro ao eliminar transação' });
    }
  }

  async getStatsCategories(userId: string) {
    try {
      const stats = await this.prisma.transaction.groupBy({
        by: ['category'],
        where: { userId, type: 'EXPENSE' },
        _sum: { amount: true },
      });
      return stats.map((s: any) => ({
        category: s.category,
        total: s._sum.amount,
      }));
    } catch (error) {
      throw new InternalServerErrorException({ error: 'Erro ao obter estatísticas por categoria' });
    }
  }
}
