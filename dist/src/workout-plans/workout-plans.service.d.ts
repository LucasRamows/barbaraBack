import { PrismaService } from '../prisma/prisma.service';
import { CurrentUserPayload } from '../auth/current-user.decorator';
import { CreateWorkoutPlanDto } from './dto/create-plan.dto';
import { UpdateWorkoutPlanDto } from './dto/update-plan.dto';
import { CreatePlanDayDto } from './dto/create-plan-day.dto';
import { UpdatePlanDayDto } from './dto/update-plan-day.dto';
import { AddExerciseToDayDto } from './dto/add-exercise-to-day.dto';
import { UpdateExerciseOnDayDto } from './dto/update-exercise-on-day.dto';
import { ReorderExercisesDto } from './dto/reorder-exercises.dto';
export declare class WorkoutPlansService {
    private prisma;
    constructor(prisma: PrismaService);
    private getPersonal;
    private getOwnedPlan;
    private getOwnedDay;
    createPlan(dto: CreateWorkoutPlanDto, currentUser: CurrentUserPayload): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        name: string;
        description: string | null;
        objective: string | null;
        personalId: string;
        isActive: boolean;
        estimatedMinutes: number | null;
        validFrom: Date | null;
        validUntil: Date | null;
        version: number;
    }>;
    findAllPlans(currentUser: CurrentUserPayload): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        name: string;
        description: string | null;
        objective: string | null;
        personalId: string;
        isActive: boolean;
        estimatedMinutes: number | null;
        validFrom: Date | null;
        validUntil: Date | null;
        version: number;
    }[]>;
    findOnePlan(id: string, currentUser: CurrentUserPayload): Promise<{
        days: ({
            exercises: ({
                exercise: {
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
                };
            } & {
                id: string;
                minReps: number;
                maxReps: number;
                weightUnit: import("@prisma/client").$Enums.WeightUnit;
                restSeconds: number;
                rpeTarget: number | null;
                progressionEnabled: boolean;
                notes: string | null;
                order: number;
                exerciseId: string;
                sets: number;
                weight: number | null;
                workoutPlanDayId: string;
            })[];
        } & {
            id: string;
            order: number;
            dayOfWeek: import("@prisma/client").$Enums.DayOfWeek;
            label: string | null;
            workoutPlanId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        name: string;
        description: string | null;
        objective: string | null;
        personalId: string;
        isActive: boolean;
        estimatedMinutes: number | null;
        validFrom: Date | null;
        validUntil: Date | null;
        version: number;
    }>;
    updatePlan(id: string, dto: UpdateWorkoutPlanDto, currentUser: CurrentUserPayload): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        name: string;
        description: string | null;
        objective: string | null;
        personalId: string;
        isActive: boolean;
        estimatedMinutes: number | null;
        validFrom: Date | null;
        validUntil: Date | null;
        version: number;
    }>;
    removePlan(id: string, currentUser: CurrentUserPayload): Promise<void>;
    duplicatePlan(id: string, currentUser: CurrentUserPayload): Promise<({
        days: ({
            exercises: ({
                exercise: {
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
                };
            } & {
                id: string;
                minReps: number;
                maxReps: number;
                weightUnit: import("@prisma/client").$Enums.WeightUnit;
                restSeconds: number;
                rpeTarget: number | null;
                progressionEnabled: boolean;
                notes: string | null;
                order: number;
                exerciseId: string;
                sets: number;
                weight: number | null;
                workoutPlanDayId: string;
            })[];
        } & {
            id: string;
            order: number;
            dayOfWeek: import("@prisma/client").$Enums.DayOfWeek;
            label: string | null;
            workoutPlanId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        name: string;
        description: string | null;
        objective: string | null;
        personalId: string;
        isActive: boolean;
        estimatedMinutes: number | null;
        validFrom: Date | null;
        validUntil: Date | null;
        version: number;
    }) | null>;
    createDay(planId: string, dto: CreatePlanDayDto, currentUser: CurrentUserPayload): Promise<{
        id: string;
        order: number;
        dayOfWeek: import("@prisma/client").$Enums.DayOfWeek;
        label: string | null;
        workoutPlanId: string;
    }>;
    updateDay(planId: string, dayId: string, dto: UpdatePlanDayDto, currentUser: CurrentUserPayload): Promise<{
        id: string;
        order: number;
        dayOfWeek: import("@prisma/client").$Enums.DayOfWeek;
        label: string | null;
        workoutPlanId: string;
    }>;
    removeDay(planId: string, dayId: string, currentUser: CurrentUserPayload): Promise<void>;
    addExerciseToDay(planId: string, dayId: string, dto: AddExerciseToDayDto, currentUser: CurrentUserPayload): Promise<{
        exercise: {
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
        };
    } & {
        id: string;
        minReps: number;
        maxReps: number;
        weightUnit: import("@prisma/client").$Enums.WeightUnit;
        restSeconds: number;
        rpeTarget: number | null;
        progressionEnabled: boolean;
        notes: string | null;
        order: number;
        exerciseId: string;
        sets: number;
        weight: number | null;
        workoutPlanDayId: string;
    }>;
    updateExerciseOnDay(planId: string, dayId: string, workoutExId: string, dto: UpdateExerciseOnDayDto, currentUser: CurrentUserPayload): Promise<{
        exercise: {
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
        };
    } & {
        id: string;
        minReps: number;
        maxReps: number;
        weightUnit: import("@prisma/client").$Enums.WeightUnit;
        restSeconds: number;
        rpeTarget: number | null;
        progressionEnabled: boolean;
        notes: string | null;
        order: number;
        exerciseId: string;
        sets: number;
        weight: number | null;
        workoutPlanDayId: string;
    }>;
    removeExerciseFromDay(planId: string, dayId: string, workoutExId: string, currentUser: CurrentUserPayload): Promise<void>;
    reorderExercises(planId: string, dayId: string, dto: ReorderExercisesDto, currentUser: CurrentUserPayload): Promise<void>;
}
