import { MuscleGroup, WeightUnit } from '@prisma/client';
export declare class CreateExerciseDto {
    name: string;
    description?: string;
    muscleGroup: MuscleGroup;
    instructions?: string;
    isUnilateral?: boolean;
    defaultSets?: number;
    minReps?: number;
    maxReps?: number;
    defaultWeight?: number;
    weightUnit?: WeightUnit;
    restSeconds?: number;
    rpeTarget?: number;
    progressionEnabled?: boolean;
    suggestedIncrement?: number;
    notes?: string;
}
