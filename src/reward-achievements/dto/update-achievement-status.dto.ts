import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { RewardAchievementStatus } from '@prisma/client';

export class UpdateAchievementStatusDto {
  @IsEnum(RewardAchievementStatus)
  status: RewardAchievementStatus;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
