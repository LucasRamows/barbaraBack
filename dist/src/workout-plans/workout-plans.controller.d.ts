import type { CurrentUserPayload } from '../auth/current-user.decorator';
import { WorkoutPlansService } from './workout-plans.service';
import { CreateWorkoutPlanDto } from './dto/create-plan.dto';
import { UpdateWorkoutPlanDto } from './dto/update-plan.dto';
import { CreatePlanDayDto } from './dto/create-plan-day.dto';
import { UpdatePlanDayDto } from './dto/update-plan-day.dto';
import { AddExerciseToDayDto } from './dto/add-exercise-to-day.dto';
import { UpdateExerciseOnDayDto } from './dto/update-exercise-on-day.dto';
import { ReorderExercisesDto } from './dto/reorder-exercises.dto';
export declare class WorkoutPlansController {
    private readonly service;
    constructor(service: WorkoutPlansService);
    createPlan(dto: CreateWorkoutPlanDto, user: CurrentUserPayload): Promise<{
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
    findAllPlans(user: CurrentUserPayload): Promise<{
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
    findOnePlan(id: string, user: CurrentUserPayload): Promise<{
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
    updatePlan(id: string, dto: UpdateWorkoutPlanDto, user: CurrentUserPayload): Promise<{
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
    removePlan(id: string, user: CurrentUserPayload): Promise<void>;
    duplicatePlan(id: string, user: CurrentUserPayload): Promise<({
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
    createDay(planId: string, dto: CreatePlanDayDto, user: CurrentUserPayload): Promise<{
        id: string;
        order: number;
        dayOfWeek: import("@prisma/client").$Enums.DayOfWeek;
        label: string | null;
        workoutPlanId: string;
    }>;
    updateDay(planId: string, dayId: string, dto: UpdatePlanDayDto, user: CurrentUserPayload): Promise<{
        id: string;
        order: number;
        dayOfWeek: import("@prisma/client").$Enums.DayOfWeek;
        label: string | null;
        workoutPlanId: string;
    }>;
    removeDay(planId: string, dayId: string, user: CurrentUserPayload): Promise<void>;
    addExercise(planId: string, dayId: string, dto: AddExerciseToDayDto, user: CurrentUserPayload): Promise<{
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
    updateExercise(planId: string, dayId: string, workoutExId: string, dto: UpdateExerciseOnDayDto, user: CurrentUserPayload): Promise<{
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
    removeExercise(planId: string, dayId: string, workoutExId: string, user: CurrentUserPayload): Promise<void>;
    reorderExercises(planId: string, dayId: string, dto: ReorderExercisesDto, user: CurrentUserPayload): Promise<void>;
}
