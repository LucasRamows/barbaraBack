import { UserStatus } from '@prisma/client';
import { AdminService } from './admin.service';
declare class UpdateStatusDto {
    status: UserStatus;
}
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
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
    updatePersonalStatus(userId: string, dto: UpdateStatusDto): Promise<{
        username: string;
        id: string;
        status: import("@prisma/client").$Enums.UserStatus;
    }>;
}
export {};
