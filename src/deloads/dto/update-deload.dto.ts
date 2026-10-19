import { IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { DeloadStatus } from '@prisma/client';
import { PartialType } from '@nestjs/mapped-types';
import { CreateDeloadDto } from './create-deload.dto';

export class UpdateDeloadDto extends PartialType(CreateDeloadDto) {
  @ApiPropertyOptional({ enum: DeloadStatus })
  @IsOptional()
  @IsEnum(DeloadStatus)
  status?: DeloadStatus;
}
