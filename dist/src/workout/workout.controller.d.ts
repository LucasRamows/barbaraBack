import { WorkoutService } from './workout.service';
export declare class WorkoutController {
    private readonly workoutService;
    constructor(workoutService: WorkoutService);
    createPlan(body: any, req: any): Promise<{
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        name: string;
        isActive: boolean;
    }>;
    getPlans(req: any): Promise<({
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
    updatePlan(id: string, body: any, req: any): Promise<{
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        name: string;
        isActive: boolean;
    }>;
    deletePlan(id: string, req: any): Promise<void>;
    addDayToPlan(planId: string, body: any, req: any): Promise<{
        id: string;
        day: import("@prisma/client").$Enums.DayOfWeek;
        label: string | null;
        workoutPlanId: string;
    }>;
    addExerciseToDay(dayId: string, body: any): Promise<{
        id: string;
        exerciseId: string;
        order: number;
        sets: number;
        reps: string;
        weight: number | null;
        restTime: number | null;
        workoutDayId: string;
    }>;
    updateExerciseOnDay(id: string, body: any): Promise<{
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
    createExercise(body: any): Promise<{
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
