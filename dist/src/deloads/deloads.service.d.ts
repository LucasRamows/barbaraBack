import { PrismaService } from '../prisma/prisma.service';
import { CurrentUserPayload } from '../auth/current-user.decorator';
import { CreateDeloadDto } from './dto/create-deload.dto';
import { UpdateDeloadDto } from './dto/update-deload.dto';
export declare class DeloadsService {
    private prisma;
    constructor(prisma: PrismaService);
    private getPersonalProfile;
    private assertPersonalOwnsStudent;
    create(dto: CreateDeloadDto, currentUser: CurrentUserPayload): Promise<{
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
    findAll(currentUser: CurrentUserPayload, studentId?: string): Promise<{
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
    findActive(studentId: string): Promise<{
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
    } | null>;
    update(id: string, dto: UpdateDeloadDto, currentUser: CurrentUserPayload): Promise<{
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
    remove(id: string, currentUser: CurrentUserPayload): Promise<void>;
}
