import type { CurrentUserPayload } from '../auth/current-user.decorator';
import { WorkoutSessionsService } from './workout-sessions.service';
import { StartSessionDto } from './dto/start-session.dto';
import { FinishSessionDto } from './dto/finish-session.dto';
export declare class WorkoutSessionsController {
    private readonly service;
    constructor(service: WorkoutSessionsService);
    findActive(user: CurrentUserPayload): Promise<{
        session: ({
            exercises: ({
                sets: {
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
                }[];
            } & {
                id: string;
                order: number;
                exerciseId: string;
                isCompleted: boolean;
                sessionId: string;
                exerciseName: string;
                exerciseSnapshot: import("@prisma/client/runtime/library").JsonValue;
            })[];
        } & {
            id: string;
            status: import("@prisma/client").$Enums.WorkoutSessionStatus;
            createdAt: Date;
            updatedAt: Date;
            studentId: string;
            workoutPlanId: string | null;
            scheduledPlanId: string | null;
            planSnapshot: import("@prisma/client/runtime/library").JsonValue;
            startedAt: Date;
            finishedAt: Date | null;
            durationSeconds: number | null;
            partialReason: string | null;
            isDeload: boolean;
        }) | null;
    }>;
    start(dto: StartSessionDto, user: CurrentUserPayload): Promise<{
        exercises: ({
            sets: {
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
            }[];
        } & {
            id: string;
            order: number;
            exerciseId: string;
            isCompleted: boolean;
            sessionId: string;
            exerciseName: string;
            exerciseSnapshot: import("@prisma/client/runtime/library").JsonValue;
        })[];
    } & {
        id: string;
        status: import("@prisma/client").$Enums.WorkoutSessionStatus;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        workoutPlanId: string | null;
        scheduledPlanId: string | null;
        planSnapshot: import("@prisma/client/runtime/library").JsonValue;
        startedAt: Date;
        finishedAt: Date | null;
        durationSeconds: number | null;
        partialReason: string | null;
        isDeload: boolean;
    }>;
    findAll(user: CurrentUserPayload, studentId?: string, skip?: string, take?: string): Promise<{
        planName: string | null;
        id: string;
        status: import("@prisma/client").$Enums.WorkoutSessionStatus;
        planSnapshot: import("@prisma/client/runtime/library").JsonValue;
        startedAt: Date;
        finishedAt: Date | null;
        durationSeconds: number | null;
        partialReason: string | null;
        isDeload: boolean;
    }[]>;
    findOne(id: string, user: CurrentUserPayload): Promise<{
        exercises: ({
            sets: {
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
            }[];
        } & {
            id: string;
            order: number;
            exerciseId: string;
            isCompleted: boolean;
            sessionId: string;
            exerciseName: string;
            exerciseSnapshot: import("@prisma/client/runtime/library").JsonValue;
        })[];
    } & {
        id: string;
        status: import("@prisma/client").$Enums.WorkoutSessionStatus;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        workoutPlanId: string | null;
        scheduledPlanId: string | null;
        planSnapshot: import("@prisma/client/runtime/library").JsonValue;
        startedAt: Date;
        finishedAt: Date | null;
        durationSeconds: number | null;
        partialReason: string | null;
        isDeload: boolean;
    }>;
    finish(id: string, dto: FinishSessionDto, user: CurrentUserPayload): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.WorkoutSessionStatus;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        workoutPlanId: string | null;
        scheduledPlanId: string | null;
        planSnapshot: import("@prisma/client/runtime/library").JsonValue;
        startedAt: Date;
        finishedAt: Date | null;
        durationSeconds: number | null;
        partialReason: string | null;
        isDeload: boolean;
    }>;
    abandon(id: string, user: CurrentUserPayload): Promise<void>;
}
