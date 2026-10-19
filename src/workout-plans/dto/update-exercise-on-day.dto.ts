import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { WeightUnit } from '@prisma/client';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateExerciseOnDayDto {
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) order?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(1) sets?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(1) minReps?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(1) maxReps?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() weight?: number;
  @ApiPropertyOptional({ enum: WeightUnit }) @IsOptional() @IsEnum(WeightUnit) weightUnit?: WeightUnit;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) restSeconds?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(1) @Max(10) rpeTarget?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() progressionEnabled?: boolean;
}
