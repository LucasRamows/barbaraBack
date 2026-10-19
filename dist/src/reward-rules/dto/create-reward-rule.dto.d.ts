import { RewardRuleType } from '@prisma/client';
export declare class CreateRewardRuleDto {
    name: string;
    description?: string;
    type: RewardRuleType;
    targetValue?: number;
    period?: string;
    conditions?: Record<string, unknown>;
    startDate?: string;
    endDate?: string;
    requiresApproval?: boolean;
    isActive?: boolean;
    giftId?: string;
}
