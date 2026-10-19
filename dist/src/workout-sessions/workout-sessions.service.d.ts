import { PrismaService } from '../prisma/prisma.service';
import { CurrentUserPayload } from '../auth/current-user.decorator';
import { LoadProgressionService } from '../load-progression/load-progression.service';
import { StartSessionDto } from './dto/start-session.dto';
import { FinishSessionDto } from './dto/finish-session.dto';
export declare class WorkoutSessionsService {
    private prisma;
    private loadProgressionService;
    constructor(prisma: PrismaService, loadProgressionService: LoadProgressionService);
    private getStudentProfile;
    private assertPersonalOwnsStudent;
    start(dto: StartSessionDto, currentUser: CurrentUserPayload): Promise<{
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
    findActive(currentUser: CurrentUserPayload): Promise<{
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
    findAll(currentUser: CurrentUserPayload, studentId?: string, skip?: number, take?: number): Promise<{
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
    findOne(id: string, currentUser: CurrentUserPayload): Promise<{
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
    finish(id: string, dto: FinishSessionDto, currentUser: CurrentUserPayload): Promise<{
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
    abandonSession(id: string, currentUser: CurrentUserPayload): Promise<void>;
}
