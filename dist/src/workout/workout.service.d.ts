import { PrismaService } from '../prisma/prisma.service';
import { DayOfWeek } from '@prisma/client';
export declare class WorkoutService {
    private prisma;
    constructor(prisma: PrismaService);
    createPlan(data: any, userId: string): Promise<{
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        name: string;
        isActive: boolean;
    }>;
    getPlans(userId: string): Promise<({
        days: ({
            exercises: ({
                exercise: {
                    id: string;
                    name: string;
                    targetMuscle: string;
                    videoUrl: string | null;
                };
            } & {
                id: string;
                exerciseId: string;
                order: number;
                sets: number;
                reps: string;
                weight: number | null;
                restTime: number | null;
                workoutDayId: string;
            })[];
        } & {
            id: string;
            day: import("@prisma/client").$Enums.DayOfWeek;
            label: string | null;
            workoutPlanId: string;
        })[];
    } & {
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        name: string;
        isActive: boolean;
    })[]>;
    updatePlan(id: string, data: any, userId: string): Promise<{
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        name: string;
        isActive: boolean;
    }>;
    deletePlan(id: string, userId: string): Promise<void>;
    addDayToPlan(planId: string, data: any, userId: string): Promise<{
        id: string;
        day: import("@prisma/client").$Enums.DayOfWeek;
        label: string | null;
        workoutPlanId: string;
    }>;
    addExerciseToDay(dayId: string, data: any): Promise<{
        id: string;
        exerciseId: string;
        order: number;
        sets: number;
        reps: string;
        weight: number | null;
        restTime: number | null;
        workoutDayId: string;
    }>;
    updateExerciseOnDay(id: string, data: any): Promise<{
        exercise: {
            id: string;
            name: string;
            targetMuscle: string;
            videoUrl: string | null;
        };
    } & {
        id: string;
        exerciseId: string;
        order: number;
        sets: number;
        reps: string;
        weight: number | null;
        restTime: number | null;
        workoutDayId: string;
    }>;
    getTodayEnum(): DayOfWeek;
    getExercisesToday(phone: string): Promise<{
        id: string;
        name: string;
        targetMuscle: string;
        videoUrl: string | null;
        order: number;
        sets: number;
        reps: string;
        weight: number | null;
        restTime: number | null;
        plan: string;
    }[]>;
    createExercise(data: any): Promise<{
        id: string;
        name: string;
        targetMuscle: string;
        videoUrl: string | null;
    }>;
    getExercises(search: string): Promise<{
        id: string;
        name: string;
        targetMuscle: string;
        videoUrl: string | null;
    }[]>;
    deleteExerciseOnDay(id: string): Promise<void>;
}
