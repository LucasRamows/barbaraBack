import type { CurrentUserPayload } from '../auth/current-user.decorator';
import { WorkoutHistoryService } from './workout-history.service';
export declare class WorkoutHistoryController {
    private readonly service;
    constructor(service: WorkoutHistoryService);
    getExerciseHistory(user: CurrentUserPayload, exerciseId: string, studentId?: string): Promise<{
        sessionId: string;
        date: Date;
        isDeload: boolean;
        sessionStatus: import("@prisma/client").$Enums.WorkoutSessionStatus;
        sets: {
            setNumber: number;
            usedWeight: number | null;
            completedReps: number | null;
            rpe: number | null;
            isCompleted: boolean;
        }[];
        maxWeight: number | null;
    }[]>;
}
