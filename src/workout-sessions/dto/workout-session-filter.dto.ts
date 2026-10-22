import { ApiPropertyOptional } from '@nestjs/swagger';
import { WorkoutSessionStatus } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Type } from 'class-transformer';

@ValidatorConstraint({ name: 'validSessionInterval', async: false })
class ValidSessionInterval implements ValidatorConstraintInterface {
  validate(_: unknown, args?: ValidationArguments) {
    if (!args) return true;
    const filter = args.object as WorkoutSessionFilterDto;
    if (!filter.from || !filter.to) return true;
    return new Date(filter.from) <= new Date(filter.to);
  }

  defaultMessage() {
    return 'from deve ser anterior ou igual a to';
  }
}

export class WorkoutSessionFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  studentId?: string;

  @ApiPropertyOptional({ description: 'Início inclusivo em ISO 8601' })
  @IsOptional()
  @IsDateString()
  @Validate(ValidSessionInterval)
  from?: string;

  @ApiPropertyOptional({ description: 'Fim inclusivo em ISO 8601' })
  @IsOptional()
  @IsDateString()
  @Validate(ValidSessionInterval)
  to?: string;

  @ApiPropertyOptional({ enum: WorkoutSessionStatus })
  @IsOptional()
  @IsEnum(WorkoutSessionStatus)
  status?: WorkoutSessionStatus;

  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @ApiPropertyOptional({ default: 20, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 20;

  @ApiPropertyOptional({ enum: ['startedAt.asc', 'startedAt.desc'] })
  @IsOptional()
  @IsEnum(['startedAt.asc', 'startedAt.desc'])
  sort: 'startedAt.asc' | 'startedAt.desc' = 'startedAt.desc';
}
