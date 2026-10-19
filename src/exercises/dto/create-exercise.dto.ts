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
import { MuscleGroup, WeightUnit } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateExerciseDto {
  @ApiProperty() @IsString() name: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiProperty({ enum: MuscleGroup }) @IsEnum(MuscleGroup) muscleGroup: MuscleGroup;
  @ApiPropertyOptional() @IsOptional() @IsString() instructions?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isUnilateral?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(1) defaultSets?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(1) minReps?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(1) maxReps?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() defaultWeight?: number;
  @ApiPropertyOptional({ enum: WeightUnit }) @IsOptional() @IsEnum(WeightUnit) weightUnit?: WeightUnit;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) restSeconds?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(1) @Max(10) rpeTarget?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() progressionEnabled?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsNumber() suggestedIncrement?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}
