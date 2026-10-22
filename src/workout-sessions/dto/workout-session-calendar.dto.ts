import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';

export class WorkoutSessionCalendarDto {
  @ApiProperty({ example: '2026-10' })
  @Matches(/^\d{4}-(0[1-9]|1[0-2])$/)
  month: string;

  @IsOptional()
  @IsString()
  studentId?: string;
}
