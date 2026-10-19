import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateBodyMeasurementDto {
  @IsOptional()
  @IsDateString()
  measuredAt?: string;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsNumber()
  height?: number;

  @IsOptional()
  @IsNumber()
  bodyFatPercent?: number;

  @IsOptional()
  @IsNumber()
  shoulders?: number;

  @IsOptional()
  @IsNumber()
  chest?: number;

  @IsOptional()
  @IsNumber()
  waist?: number;

  @IsOptional()
  @IsNumber()
  abdomen?: number;

  @IsOptional()
  @IsNumber()
  hips?: number;

  @IsOptional()
  @IsNumber()
  rightArm?: number;

  @IsOptional()
  @IsNumber()
  leftArm?: number;

  @IsOptional()
  @IsNumber()
  rightForearm?: number;

  @IsOptional()
  @IsNumber()
  leftForearm?: number;

  @IsOptional()
  @IsNumber()
  rightThigh?: number;

  @IsOptional()
  @IsNumber()
  leftThigh?: number;

  @IsOptional()
  @IsNumber()
  rightCalf?: number;

  @IsOptional()
  @IsNumber()
  leftCalf?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
