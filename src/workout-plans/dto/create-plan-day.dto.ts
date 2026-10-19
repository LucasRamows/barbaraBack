import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { DayOfWeek } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePlanDayDto {
  @ApiProperty({ enum: DayOfWeek }) @IsEnum(DayOfWeek) dayOfWeek: DayOfWeek;
  @ApiPropertyOptional() @IsOptional() @IsString() label?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) order?: number;
}
