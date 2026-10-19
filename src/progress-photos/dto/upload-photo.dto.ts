import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export enum ProgressPhotoPositionDto {
  FRONT = 'FRONT',
  BACK = 'BACK',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
  OTHER = 'OTHER',
}

export class UploadPhotoDto {
  @IsString()
  studentId: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsEnum(ProgressPhotoPositionDto)
  position: ProgressPhotoPositionDto;

  @IsOptional()
  @IsString()
  notes?: string;
}
