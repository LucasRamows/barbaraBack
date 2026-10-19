import { PrismaService } from '../prisma/prisma.service';
import { CurrentUserPayload } from '../auth/current-user.decorator';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    getMe(currentUser: CurrentUserPayload): Promise<{
        id: string;
        username: string;
        role: import("@prisma/client").$Enums.Role;
        status: import("@prisma/client").$Enums.UserStatus;
        mustChangePassword: boolean;
        createdAt: Date;
        personalProfile: {
            id: string;
            name: string;
            email: string | null;
            phone: string | null;
            avatarUrl: string | null;
            bio: string | null;
        } | null;
        studentProfile: {
            id: string;
            name: string;
            email: string | null;
            phone: string | null;
            avatarUrl: string | null;
            objective: string | null;
            experienceLevel: string | null;
        } | null;
    }>;
    changePassword(currentUser: CurrentUserPayload, currentPassword: string, newPassword: string): Promise<void>;
}
