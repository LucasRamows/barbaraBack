import { DayOfWeek } from '@prisma/client';
export declare class CreateWorkoutScheduleDto {
    studentId: string;
    workoutPlanId: string;
    dayOfWeek: DayOfWeek;
    validFrom?: string;
    validUntil?: string;
}
