import { UserStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
export declare class AdminService {
    private prisma;
    constructor(prisma: PrismaService);
    getStats(): Promise<{
        totalPersonals: number;
        totalStudents: number;
        totalSessions: number;
        sessionsThisWeek: number;
        pendingSuggestions: number;
    }>;
    getPersonals(): Promise<({
        user: {
            id: string;
            username: string;
            status: import("@prisma/client").$Enums.UserStatus;
            createdAt: Date;
        };
        _count: {
            students: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        name: string;
        userId: string;
        email: string | null;
        phone: string | null;
        avatarUrl: string | null;
        bio: string | null;
    })[]>;
    updatePersonalStatus(userId: string, status: UserStatus): Promise<{
        id: string;
        username: string;
        status: import("@prisma/client").$Enums.UserStatus;
    }>;
}
