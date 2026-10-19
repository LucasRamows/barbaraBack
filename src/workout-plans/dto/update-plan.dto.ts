import { PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateWorkoutPlanDto } from './create-plan.dto';

export class UpdateWorkoutPlanDto extends PartialType(CreateWorkoutPlanDto) {
  @IsOptional() @IsBoolean() isActive?: boolean;
}
