import { DayOfWeek } from '@prisma/client';
export declare class CreatePlanDayDto {
    dayOfWeek: DayOfWeek;
    label?: string;
    order?: number;
}
