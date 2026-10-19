import { WeightUnit } from '@prisma/client';
export declare class AddExerciseToDayDto {
    exerciseId: string;
    order?: number;
    sets: number;
    minReps: number;
    maxReps: number;
    weight?: number;
    weightUnit?: WeightUnit;
    restSeconds?: number;
    rpeTarget?: number;
    notes?: string;
    progressionEnabled?: boolean;
}
