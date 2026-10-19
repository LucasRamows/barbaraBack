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
exports.RewardAchievementsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let RewardAchievementsService = class RewardAchievementsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getPersonalProfile(userId) {
        const profile = await this.prisma.personalProfile.findUnique({
            where: { userId, deletedAt: null },
        });
        if (!profile)
            throw new common_1.ForbiddenException('Perfil de personal não encontrado.');
        return profile;
    }
    async getStudentProfile(userId) {
        const profile = await this.prisma.studentProfile.findUnique({
            where: { userId },
        });
        if (!profile)
            throw new common_1.ForbiddenException('Perfil de aluno não encontrado.');
        return profile;
    }
    async assertPersonalOwnsStudent(personalId, studentId) {
        const link = await this.prisma.personalStudent.findFirst({
            where: { personalId, studentId },
        });
        if (!link)
            throw new common_1.ForbiddenException('Aluno não pertence a este personal.');
    }
    async assertAccess(currentUser, studentId) {
        if (currentUser.role === client_1.Role.ALUNO) {
            const student = await this.getStudentProfile(currentUser.sub);
            if (student.id !== studentId)
                throw new common_1.ForbiddenException();
        }
        else if (currentUser.role === client_1.Role.PERSONAL) {
            const personal = await this.getPersonalProfile(currentUser.sub);
            await this.assertPersonalOwnsStudent(personal.id, studentId);
        }
    }
    async calculateProgress(type, studentProfileId) {
        const now = new Date();
        switch (type) {
            case client_1.RewardRuleType.TOTAL_WORKOUTS: {
                return this.prisma.workoutSession.count({
                    where: {
                        studentId: studentProfileId,
                        status: { in: [client_1.WorkoutSessionStatus.COMPLETED, client_1.WorkoutSessionStatus.PARTIAL] },
                    },
                });
            }
            case client_1.RewardRuleType.WORKOUT_STREAK: {
                const twelveWeeksAgo = new Date(now);
                twelveWeeksAgo.setDate(now.getDate() - 84);
                const sessions = await this.prisma.workoutSession.findMany({
                    where: {
                        studentId: studentProfileId,
                        status: { in: [client_1.WorkoutSessionStatus.COMPLETED, client_1.WorkoutSessionStatus.PARTIAL] },
                        startedAt: { gte: twelveWeeksAgo },
                    },
                    select: { startedAt: true },
                    orderBy: { startedAt: 'desc' },
                });
                const weekSet = new Set();
                for (const s of sessions) {
                    const d = new Date(s.startedAt);
                    const day = d.getDay();
                    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
                    const monday = new Date(d.setDate(diff));
                    weekSet.add(monday.toISOString().slice(0, 10));
                }
                return weekSet.size;
            }
            case client_1.RewardRuleType.WORKOUT_FREQUENCY: {
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                return this.prisma.workoutSession.count({
                    where: {
                        studentId: studentProfileId,
                        status: { in: [client_1.WorkoutSessionStatus.COMPLETED, client_1.WorkoutSessionStatus.PARTIAL] },
                        startedAt: { gte: startOfMonth },
                    },
                });
            }
            case client_1.RewardRuleType.LOAD_INCREASE: {
                const result = await this.prisma.workoutSet.aggregate({
                    where: {
                        sessionExercise: { session: { studentId: studentProfileId } },
                        usedWeight: { not: null },
                    },
                    _max: { usedWeight: true },
                });
                return result._max.usedWeight ?? 0;
            }
            default:
                return 0;
        }
    }
    async checkAndUpdate(studentId, currentUser) {
        const personal = await this.getPersonalProfile(currentUser.sub);
        await this.assertPersonalOwnsStudent(personal.id, studentId);
        const studentProfile = await this.prisma.studentProfile.findUnique({
            where: { id: studentId },
        });
        if (!studentProfile)
            throw new common_1.NotFoundException('Aluno não encontrado.');
        const rules = await this.prisma.rewardRule.findMany({
            where: { personalId: personal.id, isActive: true },
        });
        const results = [];
        for (const rule of rules) {
            const currentValue = await this.calculateProgress(rule.type, studentId);
            await this.prisma.rewardProgress.upsert({
                where: { studentId_ruleId: { studentId, ruleId: rule.id } },
                create: { studentId, ruleId: rule.id, currentValue },
                update: { currentValue },
            });
            const isComplete = rule.targetValue !== null && currentValue >= rule.targetValue;
            if (isComplete) {
                const progress = await this.prisma.rewardProgress.findUnique({
                    where: { studentId_ruleId: { studentId, ruleId: rule.id } },
                    include: { achievements: { where: { status: { notIn: [client_1.RewardAchievementStatus.REJECTED, client_1.RewardAchievementStatus.CANCELLED] } } } },
                });
                if (progress && progress.achievements.length === 0) {
                    await this.prisma.rewardAchievement.create({
                        data: {
                            studentId,
                            progressId: progress.id,
                            status: rule.requiresApproval
                                ? client_1.RewardAchievementStatus.AWAITING_APPROVAL
                                : client_1.RewardAchievementStatus.ACHIEVED,
                        },
                    });
                }
            }
            results.push({ ruleId: rule.id, currentValue, targetValue: rule.targetValue, isComplete });
        }
        return results;
    }
    async findAchievements(studentId, currentUser) {
        await this.assertAccess(currentUser, studentId);
        return this.prisma.rewardAchievement.findMany({
            where: { studentId },
            orderBy: { createdAt: 'desc' },
            include: {
                progress: {
                    include: { rule: { include: { gift: true } } },
                },
            },
        });
    }
    async getProgress(studentId, currentUser) {
        await this.assertAccess(currentUser, studentId);
        return this.prisma.rewardProgress.findMany({
            where: { studentId },
            include: { rule: { include: { gift: true } } },
            orderBy: { updatedAt: 'desc' },
        });
    }
    async updateStatus(id, status, currentUser, notes) {
        const achievement = await this.prisma.rewardAchievement.findUnique({
            where: { id },
            include: { progress: { include: { rule: true } } },
        });
        if (!achievement)
            throw new common_1.NotFoundException('Conquista não encontrada.');
        if (currentUser.role === client_1.Role.ALUNO) {
            const student = await this.getStudentProfile(currentUser.sub);
            if (achievement.studentId !== student.id)
                throw new common_1.ForbiddenException();
        }
        else if (currentUser.role === client_1.Role.PERSONAL) {
            const personal = await this.getPersonalProfile(currentUser.sub);
            if (achievement.progress.rule.personalId !== personal.id)
                throw new common_1.ForbiddenException();
        }
        const now = new Date();
        const updateData = { status, notes };
        if (status === client_1.RewardAchievementStatus.APPROVED) {
            updateData.approvedById = currentUser.sub;
            updateData.approvedAt = now;
        }
        else if (status === client_1.RewardAchievementStatus.REJECTED) {
            updateData.rejectedById = currentUser.sub;
            updateData.rejectedAt = now;
        }
        else if (status === client_1.RewardAchievementStatus.DELIVERED) {
            updateData.deliveredById = currentUser.sub;
            updateData.deliveredAt = now;
        }
        return this.prisma.rewardAchievement.update({
            where: { id },
            data: updateData,
            include: { progress: { include: { rule: { include: { gift: true } } } } },
        });
    }
};
exports.RewardAchievementsService = RewardAchievementsService;
exports.RewardAchievementsService = RewardAchievementsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RewardAchievementsService);
//# sourceMappingURL=reward-achievements.service.js.map