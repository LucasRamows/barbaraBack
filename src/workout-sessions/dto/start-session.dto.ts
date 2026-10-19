import { IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StartSessionDto {
  @ApiProperty()
  @IsString()
  workoutPlanId: string;

  @ApiProperty()
  @IsString()
  workoutPlanDayId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  scheduledPlanId?: string;
}
