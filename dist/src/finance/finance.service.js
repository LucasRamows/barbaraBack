"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let FinanceService = class FinanceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createTransaction(data, userId) {
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
        }
        catch (error) {
            throw new common_1.BadRequestException({ error: 'Erro ao registar transação', details: error.message });
        }
    }
    async getTransactions(month, year, userId) {
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
        }
        catch (error) {
            throw new common_1.InternalServerErrorException({ error: 'Erro ao procurar transações' });
        }
    }
    async getSummary(userId) {
        try {
            const transactions = await this.prisma.transaction.findMany({ where: { userId } });
            const summary = transactions.reduce((acc, curr) => {
                if (curr.type === 'INCOME') {
                    acc.income += curr.amount;
                }
                else {
                    acc.expense += curr.amount;
                }
                acc.balance = acc.income - acc.expense;
                return acc;
            }, { income: 0, expense: 0, balance: 0 });
            return summary;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException({ error: 'Erro ao gerar resumo financeiro' });
        }
    }
    async updateTransaction(id, data, userId) {
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
        }
        catch (error) {
            throw new common_1.BadRequestException({ error: 'Erro ao atualizar transação' });
        }
    }
    async deleteTransaction(id, userId) {
        try {
            await this.prisma.transaction.delete({ where: { id, userId } });
            return;
        }
        catch (error) {
            throw new common_1.BadRequestException({ error: 'Erro ao eliminar transação' });
        }
    }
    async getStatsCategories(userId) {
        try {
            const stats = await this.prisma.transaction.groupBy({
                by: ['category'],
                where: { userId, type: 'EXPENSE' },
                _sum: { amount: true },
            });
            return stats.map((s) => ({
                category: s.category,
                total: s._sum.amount,
            }));
        }
        catch (error) {
            throw new common_1.InternalServerErrorException({ error: 'Erro ao obter estatísticas por categoria' });
        }
    }
};
exports.FinanceService = FinanceService;
exports.FinanceService = FinanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FinanceService);
//# sourceMappingURL=finance.service.js.map