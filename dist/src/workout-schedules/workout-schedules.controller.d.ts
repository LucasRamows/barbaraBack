import type { CurrentUserPayload } from '../auth/current-user.decorator';
import { WorkoutSchedulesService } from './workout-schedules.service';
import { CreateWorkoutScheduleDto } from './dto/create-schedule.dto';
import { UpdateWorkoutScheduleDto } from './dto/update-schedule.dto';
export declare class WorkoutSchedulesController {
    private readonly service;
    constructor(service: WorkoutSchedulesService);
    create(dto: CreateWorkoutScheduleDto, user: CurrentUserPayload): Promise<{
        workoutPlan: {
            name: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        isActive: boolean;
        dayOfWeek: import("@prisma/client").$Enums.DayOfWeek;
        validFrom: Date | null;
        validUntil: Date | null;
        workoutPlanId: string;
    }>;
    findByStudent(studentId: string, user: CurrentUserPayload): Promise<({
        workoutPlan: {
            name: string;
            id: string;
            objective: string | null;
            estimatedMinutes: number | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        isActive: boolean;
        dayOfWeek: import("@prisma/client").$Enums.DayOfWeek;
        validFrom: Date | null;
        validUntil: Date | null;
        workoutPlanId: string;
    })[]>;
    update(id: string, dto: UpdateWorkoutScheduleDto, user: CurrentUserPayload): Promise<{
        workoutPlan: {
            name: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        isActive: boolean;
        dayOfWeek: import("@prisma/client").$Enums.DayOfWeek;
        validFrom: Date | null;
        validUntil: Date | null;
        workoutPlanId: string;
    }>;
    remove(id: string, user: CurrentUserPayload): Promise<void>;
}
