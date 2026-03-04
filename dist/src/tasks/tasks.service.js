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
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TasksService = class TasksService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createTask(data, userId) {
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
        }
        catch (error) {
            throw new common_1.BadRequestException({ error: 'Erro ao criar tarefa', details: error.message });
        }
    }
    async getTasks(type, priority, userId) {
        try {
            return await this.prisma.task.findMany({
                where: {
                    userId,
                    ...(type && { type: String(type) }),
                    ...(priority && { isPriority: priority }),
                },
                include: { reminders: true },
                orderBy: { date: 'asc' },
            });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException({ error: 'Erro ao procurar tarefas' });
        }
    }
    async updateTask(id, data, userId) {
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
        }
        catch (error) {
            throw new common_1.BadRequestException({ error: 'Erro ao atualizar tarefa' });
        }
    }
    async deleteTask(id, userId) {
        try {
            await this.prisma.task.delete({ where: { id, userId } });
            return;
        }
        catch (error) {
            throw new common_1.BadRequestException({ error: 'Erro ao eliminar tarefa' });
        }
    }
    async getStatsSummary(userId) {
        try {
            return await this.prisma.task.groupBy({
                by: ['status'],
                where: { userId },
                _count: { id: true },
            });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException({ error: 'Erro ao obter estatísticas' });
        }
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TasksService);
//# sourceMappingURL=tasks.service.js.map