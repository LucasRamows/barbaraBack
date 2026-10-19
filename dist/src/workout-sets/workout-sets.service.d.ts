import { PrismaService } from '../prisma/prisma.service';
import { CurrentUserPayload } from '../auth/current-user.decorator';
import { UpdateWorkoutSetDto } from './dto/update-set.dto';
export declare class WorkoutSetsService {
    private prisma;
    constructor(prisma: PrismaService);
    private getStudentProfile;
    private assertSetOwnership;
    update(setId: string, dto: UpdateWorkoutSetDto, currentUser: CurrentUserPayload): Promise<{
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
    }>;
    addExtraSet(sessionExerciseId: string, currentUser: CurrentUserPayload): Promise<{
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
    }>;
}
