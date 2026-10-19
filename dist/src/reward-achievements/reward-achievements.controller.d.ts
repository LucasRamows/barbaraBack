import { RewardAchievementStatus } from '@prisma/client';
import type { CurrentUserPayload } from '../auth/current-user.decorator';
import { RewardAchievementsService } from './reward-achievements.service';
declare class UpdateAchievementStatusDto {
    status: RewardAchievementStatus;
    notes?: string;
}
export declare class RewardAchievementsController {
    private readonly service;
    constructor(service: RewardAchievementsService);
    checkAndUpdate(studentId: string, user: CurrentUserPayload): Promise<{
        ruleId: string;
        currentValue: number;
        targetValue: number | null;
        isComplete: boolean;
    }[]>;
    findAchievements(studentId: string, user: CurrentUserPayload): Promise<({
        progress: {
            rule: {
                gift: {
                    name: string;
                    description: string | null;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    personalId: string;
                    instructions: string | null;
                    isActive: boolean;
                    imageUrl: string | null;
                } | null;
            } & {
                name: string;
                type: import("@prisma/client").$Enums.RewardRuleType;
                description: string | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
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
    getProgress(studentId: string, user: CurrentUserPayload): Promise<({
        rule: {
            gift: {
                name: string;
                description: string | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                personalId: string;
                instructions: string | null;
                isActive: boolean;
                imageUrl: string | null;
            } | null;
        } & {
            name: string;
            type: import("@prisma/client").$Enums.RewardRuleType;
            description: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
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
    updateStatus(id: string, dto: UpdateAchievementStatusDto, user: CurrentUserPayload): Promise<{
        progress: {
            rule: {
                gift: {
                    name: string;
                    description: string | null;
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    deletedAt: Date | null;
                    personalId: string;
                    instructions: string | null;
                    isActive: boolean;
                    imageUrl: string | null;
                } | null;
            } & {
                name: string;
                type: import("@prisma/client").$Enums.RewardRuleType;
                description: string | null;
                id: string;
                createdAt: Date;
                updatedAt: Date;
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
export {};
