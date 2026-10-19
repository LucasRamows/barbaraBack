import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FinishSessionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isPartial?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  partialReason?: string;
}
