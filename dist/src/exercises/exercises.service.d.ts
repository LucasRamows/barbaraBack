import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { CurrentUserPayload } from '../auth/current-user.decorator';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
export declare class ExercisesService {
    private prisma;
    private storage;
    constructor(prisma: PrismaService, storage: StorageService);
    private getPersonal;
    private getOwned;
    create(dto: CreateExerciseDto, currentUser: CurrentUserPayload): Promise<{
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
    findAll(currentUser: CurrentUserPayload): Promise<({
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
    findOne(id: string, currentUser: CurrentUserPayload): Promise<{
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
    update(id: string, dto: UpdateExerciseDto, currentUser: CurrentUserPayload): Promise<{
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
    remove(id: string, currentUser: CurrentUserPayload): Promise<void>;
    addImage(id: string, file: Express.Multer.File, currentUser: CurrentUserPayload): Promise<{
        id: string;
        createdAt: Date;
        url: string;
        order: number;
        exerciseId: string;
    }>;
    removeImage(id: string, imageId: string, currentUser: CurrentUserPayload): Promise<void>;
}
