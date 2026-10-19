import type { CurrentUserPayload } from '../auth/current-user.decorator';
import { DeloadsService } from './deloads.service';
import { CreateDeloadDto } from './dto/create-deload.dto';
import { UpdateDeloadDto } from './dto/update-deload.dto';
export declare class DeloadsController {
    private readonly service;
    constructor(service: DeloadsService);
    create(dto: CreateDeloadDto, user: CurrentUserPayload): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.DeloadStatus;
        createdAt: Date;
        updatedAt: Date;
        observations: string | null;
        startDate: Date;
        personalId: string;
        studentId: string;
        reason: string | null;
        endDate: Date;
        reductionPercent: number;
    }>;
    findAll(user: CurrentUserPayload, studentId?: string): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.DeloadStatus;
        createdAt: Date;
        updatedAt: Date;
        observations: string | null;
        startDate: Date;
        personalId: string;
        studentId: string;
        reason: string | null;
        endDate: Date;
        reductionPercent: number;
    }[]>;
    update(id: string, dto: UpdateDeloadDto, user: CurrentUserPayload): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.DeloadStatus;
        createdAt: Date;
        updatedAt: Date;
        observations: string | null;
        startDate: Date;
        personalId: string;
        studentId: string;
        reason: string | null;
        endDate: Date;
        reductionPercent: number;
    }>;
    remove(id: string, user: CurrentUserPayload): Promise<void>;
}
