import { IsEnum, IsOptional, IsString } from 'class-validator';
import { DayOfWeek } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateWorkoutScheduleDto {
  @ApiProperty() @IsString() studentId: string;
  @ApiProperty() @IsString() workoutPlanId: string;
  @ApiProperty({ enum: DayOfWeek }) @IsEnum(DayOfWeek) dayOfWeek: DayOfWeek;
  @ApiPropertyOptional() @IsOptional() @IsString() validFrom?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() validUntil?: string;
}
