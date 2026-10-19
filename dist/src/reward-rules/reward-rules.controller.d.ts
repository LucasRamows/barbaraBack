import type { CurrentUserPayload } from '../auth/current-user.decorator';
import { RewardRulesService } from './reward-rules.service';
import { CreateRewardRuleDto } from './dto/create-reward-rule.dto';
import { UpdateRewardRuleDto } from './dto/update-reward-rule.dto';
export declare class RewardRulesController {
    private readonly rewardRulesService;
    constructor(rewardRulesService: RewardRulesService);
    findAll(user: CurrentUserPayload): Promise<({
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
    })[]>;
    create(dto: CreateRewardRuleDto, user: CurrentUserPayload): Promise<{
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
    }>;
    update(id: string, dto: UpdateRewardRuleDto, user: CurrentUserPayload): Promise<{
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
    }>;
    remove(id: string, user: CurrentUserPayload): Promise<void>;
}
