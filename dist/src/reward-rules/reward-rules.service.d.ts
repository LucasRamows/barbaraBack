import { PrismaService } from '../prisma/prisma.service';
import { CurrentUserPayload } from '../auth/current-user.decorator';
import { Prisma } from '@prisma/client';
import { CreateRewardRuleDto } from './dto/create-reward-rule.dto';
import { UpdateRewardRuleDto } from './dto/update-reward-rule.dto';
export declare class RewardRulesService {
    private prisma;
    constructor(prisma: PrismaService);
    private getPersonalProfile;
    create(dto: CreateRewardRuleDto, currentUser: CurrentUserPayload): Promise<{
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
        conditions: Prisma.JsonValue | null;
        requiresApproval: boolean;
        giftId: string | null;
    }>;
    findAll(currentUser: CurrentUserPayload): Promise<({
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
        conditions: Prisma.JsonValue | null;
        requiresApproval: boolean;
        giftId: string | null;
    })[]>;
    findOne(id: string, currentUser: CurrentUserPayload): Promise<{
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
        conditions: Prisma.JsonValue | null;
        requiresApproval: boolean;
        giftId: string | null;
    }>;
    update(id: string, dto: UpdateRewardRuleDto, currentUser: CurrentUserPayload): Promise<{
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
        conditions: Prisma.JsonValue | null;
        requiresApproval: boolean;
        giftId: string | null;
    }>;
    remove(id: string, currentUser: CurrentUserPayload): Promise<void>;
}
