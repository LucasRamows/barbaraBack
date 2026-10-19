import type { CurrentUserPayload } from '../auth/current-user.decorator';
import { WorkoutSetsService } from './workout-sets.service';
import { UpdateWorkoutSetDto } from './dto/update-set.dto';
export declare class WorkoutSetsController {
    private readonly service;
    constructor(service: WorkoutSetsService);
    update(setId: string, dto: UpdateWorkoutSetDto, user: CurrentUserPayload): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        weightUnit: import("@prisma/client").$Enums.WeightUnit;
        notes: string | null;
        isCompleted: boolean;
        setNumber: number;
        sessionExerciseId: string;
        plannedReps: number;
        completedReps: number | null;
        plannedWeight: number | null;
        usedWeight: number | null;
        rpe: number | null;
        completedAt: Date | null;
    }>;
    addExtraSet(sessionExerciseId: string, user: CurrentUserPayload): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        weightUnit: import("@prisma/client").$Enums.WeightUnit;
        notes: string | null;
        isCompleted: boolean;
        setNumber: number;
        sessionExerciseId: string;
        plannedReps: number;
        completedReps: number | null;
        plannedWeight: number | null;
        usedWeight: number | null;
        rpe: number | null;
        completedAt: Date | null;
    }>;
}
