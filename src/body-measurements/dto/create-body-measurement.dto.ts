import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { IsCivilDate } from '../../identity/civil-date.validator';

export class CreateBodyMeasurementDto {
  @IsString()
  studentId: string;

  @IsOptional()
  @IsCivilDate({ allowFuture: false })
  date?: string;

  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(20)
  @Max(400)
  weight?: number;

  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(50)
  @Max(260)
  height?: number;

  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(1)
  @Max(80)
  bodyFat?: number;

  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(20)
  @Max(250)
  chest?: number;

  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(20)
  @Max(250)
  shoulders?: number;

  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(20)
  @Max(250)
  waist?: number;

  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(20)
  @Max(250)
  hips?: number;

  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(5)
  @Max(100)
  arm?: number;

  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(5)
  @Max(100)
  rightArm?: number;

  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(5)
  @Max(100)
  leftArm?: number;

  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(5)
  @Max(100)
  rightForearm?: number;

  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(5)
  @Max(100)
  leftForearm?: number;

  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(10)
  @Max(150)
  thigh?: number;

  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(10)
  @Max(150)
  rightThigh?: number;

  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(10)
  @Max(150)
  leftThigh?: number;

  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(10)
  @Max(100)
  rightCalf?: number;

  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(10)
  @Max(100)
  leftCalf?: number;

  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(20)
  @Max(250)
  abdomen?: number;

  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(10)
  @Max(100)
  neck?: number;

  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(5)
  @Max(100)
  face?: number;

  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(0)
  @Max(300)
  hairLength?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
