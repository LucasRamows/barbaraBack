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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddExerciseToDayDto {
  @ApiProperty() @IsString() exerciseId: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) order?: number;
  @ApiProperty() @IsInt() @Min(1) sets: number;
  @ApiProperty() @IsInt() @Min(1) minReps: number;
  @ApiProperty() @IsInt() @Min(1) maxReps: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() weight?: number;
  @ApiPropertyOptional({ enum: WeightUnit }) @IsOptional() @IsEnum(WeightUnit) weightUnit?: WeightUnit;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) restSeconds?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(1) @Max(10) rpeTarget?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() progressionEnabled?: boolean;
}
