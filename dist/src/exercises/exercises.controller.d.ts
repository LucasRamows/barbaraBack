import type { CurrentUserPayload } from '../auth/current-user.decorator';
import { ExercisesService } from './exercises.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
export declare class ExercisesController {
    private readonly service;
    constructor(service: ExercisesService);
    create(dto: CreateExerciseDto, user: CurrentUserPayload): Promise<{
        images: {
            id: string;
            createdAt: Date;
            url: string;
            order: number;
            exerciseId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        name: string;
        description: string | null;
        personalId: string;
        muscleGroup: import("@prisma/client").$Enums.MuscleGroup;
        instructions: string | null;
        isUnilateral: boolean;
        defaultSets: number;
        minReps: number;
        maxReps: number;
        defaultWeight: number | null;
        weightUnit: import("@prisma/client").$Enums.WeightUnit;
        restSeconds: number;
        rpeTarget: number | null;
        progressionEnabled: boolean;
        suggestedIncrement: number | null;
        notes: string | null;
        isActive: boolean;
    }>;
    findAll(user: CurrentUserPayload): Promise<({
        images: {
            id: string;
            createdAt: Date;
            url: string;
            order: number;
            exerciseId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        name: string;
        description: string | null;
        personalId: string;
        muscleGroup: import("@prisma/client").$Enums.MuscleGroup;
        instructions: string | null;
        isUnilateral: boolean;
        defaultSets: number;
        minReps: number;
        maxReps: number;
        defaultWeight: number | null;
        weightUnit: import("@prisma/client").$Enums.WeightUnit;
        restSeconds: number;
        rpeTarget: number | null;
        progressionEnabled: boolean;
        suggestedIncrement: number | null;
        notes: string | null;
        isActive: boolean;
    })[]>;
    findOne(id: string, user: CurrentUserPayload): Promise<{
        images: {
            id: string;
            createdAt: Date;
            url: string;
            order: number;
            exerciseId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        name: string;
        description: string | null;
        personalId: string;
        muscleGroup: import("@prisma/client").$Enums.MuscleGroup;
        instructions: string | null;
        isUnilateral: boolean;
        defaultSets: number;
        minReps: number;
        maxReps: number;
        defaultWeight: number | null;
        weightUnit: import("@prisma/client").$Enums.WeightUnit;
        restSeconds: number;
        rpeTarget: number | null;
        progressionEnabled: boolean;
        suggestedIncrement: number | null;
        notes: string | null;
        isActive: boolean;
    }>;
    update(id: string, dto: UpdateExerciseDto, user: CurrentUserPayload): Promise<{
        images: {
            id: string;
            createdAt: Date;
            url: string;
            order: number;
            exerciseId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        name: string;
        description: string | null;
        personalId: string;
        muscleGroup: import("@prisma/client").$Enums.MuscleGroup;
        instructions: string | null;
        isUnilateral: boolean;
        defaultSets: number;
        minReps: number;
        maxReps: number;
        defaultWeight: number | null;
        weightUnit: import("@prisma/client").$Enums.WeightUnit;
        restSeconds: number;
        rpeTarget: number | null;
        progressionEnabled: boolean;
        suggestedIncrement: number | null;
        notes: string | null;
        isActive: boolean;
    }>;
    remove(id: string, user: CurrentUserPayload): Promise<void>;
    addImage(id: string, file: Express.Multer.File, user: CurrentUserPayload): Promise<{
        id: string;
        createdAt: Date;
        url: string;
        order: number;
        exerciseId: string;
    }>;
    removeImage(id: string, imageId: string, user: CurrentUserPayload): Promise<void>;
}
