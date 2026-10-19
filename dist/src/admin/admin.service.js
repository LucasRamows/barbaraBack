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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let AdminService = class AdminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStats() {
        const now = new Date();
        const dayOfWeek = now.getDay();
        const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        const monday = new Date(now);
        monday.setDate(diff);
        monday.setHours(0, 0, 0, 0);
        const [totalPersonals, totalStudents, totalSessions, sessionsThisWeek, pendingSuggestions] = await Promise.all([
            this.prisma.personalProfile.count({ where: { deletedAt: null } }),
            this.prisma.studentProfile.count({ where: { deletedAt: null } }),
            this.prisma.workoutSession.count({
                where: { status: { in: [client_1.WorkoutSessionStatus.COMPLETED, client_1.WorkoutSessionStatus.PARTIAL] } },
            }),
            this.prisma.workoutSession.count({
                where: {
                    status: { in: [client_1.WorkoutSessionStatus.COMPLETED, client_1.WorkoutSessionStatus.PARTIAL] },
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
    async updatePersonalStatus(userId, status) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('Usuário não encontrado.');
        return this.prisma.user.update({
            where: { id: userId },
            data: { status },
            select: { id: true, username: true, status: true },
        });
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map