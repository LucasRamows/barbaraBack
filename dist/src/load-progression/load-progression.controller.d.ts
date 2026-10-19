import type { CurrentUserPayload } from '../auth/current-user.decorator';
import { LoadProgressionService } from './load-progression.service';
import { RespondSuggestionDto } from './dto/respond-suggestion.dto';
export declare class LoadProgressionController {
    private readonly service;
    constructor(service: LoadProgressionService);
    getSuggestions(user: CurrentUserPayload, studentId?: string): Promise<{
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
    respondSuggestion(id: string, dto: RespondSuggestionDto, user: CurrentUserPayload): Promise<{
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
