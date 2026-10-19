import { PartialType } from '@nestjs/swagger';
import { CreateWorkoutScheduleDto } from './create-schedule.dto';

export class UpdateWorkoutScheduleDto extends PartialType(CreateWorkoutScheduleDto) {}
