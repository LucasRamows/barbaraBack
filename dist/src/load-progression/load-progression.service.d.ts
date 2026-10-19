import { PrismaService } from '../prisma/prisma.service';
import { CurrentUserPayload } from '../auth/current-user.decorator';
export declare class LoadProgressionService {
    private prisma;
    constructor(prisma: PrismaService);
    analyzeSession(sessionId: string): Promise<void>;
    private analyzeExercise;
    getSuggestions(currentUser: CurrentUserPayload, studentId?: string): Promise<{
        id: string;
        createdAt: Date;
        studentId: string;
        exerciseId: string;
        currentWeight: number;
        suggestedWeight: number;
        justification: string;
        isAccepted: boolean | null;
        acceptedAt: Date | null;
        rejectedAt: Date | null;
    }[]>;
    respondSuggestion(id: string, isAccepted: boolean, currentUser: CurrentUserPayload): Promise<{
        id: string;
        createdAt: Date;
        studentId: string;
        exerciseId: string;
        currentWeight: number;
        suggestedWeight: number;
        justification: string;
        isAccepted: boolean | null;
        acceptedAt: Date | null;
        rejectedAt: Date | null;
    }>;
}
