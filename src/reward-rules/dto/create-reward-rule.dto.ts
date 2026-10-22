import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { RewardRuleType } from '@prisma/client';

export class CreateRewardRuleDto {
  @IsString() name: string;
  @IsOptional() @IsString() description?: string;
  @IsEnum(RewardRuleType) type: RewardRuleType;
  @IsOptional() @IsNumber({ allowNaN: false, allowInfinity: false }) @Min(0) targetValue?: number;
  @IsOptional() @IsString() period?: string;
  @IsOptional() @IsObject() conditions?: Record<string, unknown>;
  @IsOptional() @IsDateString() startDate?: string;
  @IsOptional() @IsDateString() endDate?: string;
  @IsOptional() @IsBoolean() requiresApproval?: boolean;
  @IsOptional() @IsBoolean() isActive?: boolean;
  @IsOptional() @IsString() giftId?: string;
}
