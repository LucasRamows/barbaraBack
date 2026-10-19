import { RewardAchievementStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CurrentUserPayload } from '../auth/current-user.decorator';
export declare class RewardAchievementsService {
    private prisma;
    constructor(prisma: PrismaService);
    private getPersonalProfile;
    private getStudentProfile;
    private assertPersonalOwnsStudent;
    private assertAccess;
    private calculateProgress;
    checkAndUpdate(studentId: string, currentUser: CurrentUserPayload): Promise<{
        ruleId: string;
        currentValue: number;
        targetValue: number | null;
        isComplete: boolean;
    }[]>;
    findAchievements(studentId: string, currentUser: CurrentUserPayload): Promise<({
        progress: {
            rule: {
                gift: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    name: string;
                    description: string | null;
                    personalId: string;
                    instructions: string | null;
                    isActive: boolean;
                    imageUrl: string | null;
                } | null;
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                type: import("@prisma/client").$Enums.RewardRuleType;
                description: string | null;
                startDate: Date | null;
                personalId: string;
                isActive: boolean;
                endDate: Date | null;
                targetValue: number | null;
                period: string | null;
                conditions: import("@prisma/client/runtime/library").JsonValue | null;
                requiresApproval: boolean;
                giftId: string | null;
            };
        } & {
            id: string;
            updatedAt: Date;
            studentId: string;
            ruleId: string;
            currentValue: number;
        };
    } & {
        id: string;
        status: import("@prisma/client").$Enums.RewardAchievementStatus;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        notes: string | null;
        rejectedAt: Date | null;
        progressId: string;
        approvedById: string | null;
        approvedAt: Date | null;
        rejectedById: string | null;
        deliveredById: string | null;
        deliveredAt: Date | null;
    })[]>;
    getProgress(studentId: string, currentUser: CurrentUserPayload): Promise<({
        rule: {
            gift: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                name: string;
                description: string | null;
                personalId: string;
                instructions: string | null;
                isActive: boolean;
                imageUrl: string | null;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            type: import("@prisma/client").$Enums.RewardRuleType;
            description: string | null;
            startDate: Date | null;
            personalId: string;
            isActive: boolean;
            endDate: Date | null;
            targetValue: number | null;
            period: string | null;
            conditions: import("@prisma/client/runtime/library").JsonValue | null;
            requiresApproval: boolean;
            giftId: string | null;
        };
    } & {
        id: string;
        updatedAt: Date;
        studentId: string;
        ruleId: string;
        currentValue: number;
    })[]>;
    updateStatus(id: string, status: RewardAchievementStatus, currentUser: CurrentUserPayload, notes?: string): Promise<{
        progress: {
            rule: {
                gift: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    name: string;
                    description: string | null;
                    personalId: string;
                    instructions: string | null;
                    isActive: boolean;
                    imageUrl: string | null;
                } | null;
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                type: import("@prisma/client").$Enums.RewardRuleType;
                description: string | null;
                startDate: Date | null;
                personalId: string;
                isActive: boolean;
                endDate: Date | null;
                targetValue: number | null;
                period: string | null;
                conditions: import("@prisma/client/runtime/library").JsonValue | null;
                requiresApproval: boolean;
                giftId: string | null;
            };
        } & {
            id: string;
            updatedAt: Date;
            studentId: string;
            ruleId: string;
            currentValue: number;
        };
    } & {
        id: string;
        status: import("@prisma/client").$Enums.RewardAchievementStatus;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        notes: string | null;
        rejectedAt: Date | null;
        progressId: string;
        approvedById: string | null;
        approvedAt: Date | null;
        rejectedById: string | null;
        deliveredById: string | null;
        deliveredAt: Date | null;
    }>;
}
