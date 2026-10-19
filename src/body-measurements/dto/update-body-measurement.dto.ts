import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateBodyMeasurementDto } from './create-body-measurement.dto';

export class UpdateBodyMeasurementDto extends PartialType(
  OmitType(CreateBodyMeasurementDto, ['studentId'] as const),
) {}
