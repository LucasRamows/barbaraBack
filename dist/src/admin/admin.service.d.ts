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
            username: string;
            id: string;
            status: import("@prisma/client").$Enums.UserStatus;
            createdAt: Date;
        };
        _count: {
            students: number;
        };
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        userId: string;
        email: string | null;
        phone: string | null;
        avatarUrl: string | null;
        bio: string | null;
    })[]>;
    updatePersonalStatus(userId: string, status: UserStatus): Promise<{
        username: string;
        id: string;
        status: import("@prisma/client").$Enums.UserStatus;
    }>;
}
