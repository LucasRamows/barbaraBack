import { CreateWorkoutPlanDto } from './create-plan.dto';
declare const UpdateWorkoutPlanDto_base: import("@nestjs/common").Type<Partial<CreateWorkoutPlanDto>>;
export declare class UpdateWorkoutPlanDto extends UpdateWorkoutPlanDto_base {
    isActive?: boolean;
}
export {};
