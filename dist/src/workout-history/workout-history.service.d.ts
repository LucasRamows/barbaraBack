import { PrismaService } from '../prisma/prisma.service';
import { CurrentUserPayload } from '../auth/current-user.decorator';
export declare class WorkoutHistoryService {
    private prisma;
    constructor(prisma: PrismaService);
    getExerciseHistory(exerciseId: string, currentUser: CurrentUserPayload, studentId?: string): Promise<{
        sessionId: string;
        date: Date;
        isDeload: boolean;
        sessionStatus: import("@prisma/client").$Enums.WorkoutSessionStatus;
        sets: {
            setNumber: number;
            usedWeight: number | null;
            completedReps: number | null;
            rpe: number | null;
            isCompleted: boolean;
        }[];
        maxWeight: number | null;
    }[]>;
}
