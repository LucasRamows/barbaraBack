import { PrismaService } from '../prisma/prisma.service';
export declare class HealthService {
    private prisma;
    constructor(prisma: PrismaService);
    createHealth(data: any, userId: string): Promise<{
        note: string | null;
        category: string;
        date: Date | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        title: string;
    }>;
    getHealths(userId: string): Promise<{
        note: string | null;
        category: string;
        date: Date | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        title: string;
    }[]>;
    updateHealth(id: string, data: any, userId: string): Promise<{
        note: string | null;
        category: string;
        date: Date | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        title: string;
    }>;
    deleteHealth(id: string, userId: string): Promise<void>;
}
