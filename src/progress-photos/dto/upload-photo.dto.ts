import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { PhotoPosition } from '@prisma/client';

export class UploadPhotoDto {
  @IsString()
  studentId: string;

  @IsOptional()
  @IsDateString()
  takenAt?: string;

  @IsEnum(PhotoPosition)
  position: PhotoPosition;

  @IsOptional()
  @IsString()
  observations?: string;
}
