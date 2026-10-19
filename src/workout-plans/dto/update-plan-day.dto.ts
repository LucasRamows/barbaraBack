import { PartialType } from '@nestjs/swagger';
import { CreatePlanDayDto } from './create-plan-day.dto';

export class UpdatePlanDayDto extends PartialType(CreatePlanDayDto) {}
