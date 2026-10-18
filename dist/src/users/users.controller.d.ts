import { UsersService } from './users.service';
import type { CurrentUserPayload } from '../auth/current-user.decorator';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMe(currentUser: CurrentUserPayload): Promise<{
        personalProfile: {
            name: string;
            id: string;
            email: string | null;
            phone: string | null;
            avatarUrl: string | null;
            bio: string | null;
        } | null;
        studentProfile: {
            name: string;
            id: string;
            email: string | null;
            phone: string | null;
            avatarUrl: string | null;
            objective: string | null;
            experienceLevel: string | null;
        } | null;
        username: string;
        id: string;
        role: import("@prisma/client").$Enums.Role;
        status: import("@prisma/client").$Enums.UserStatus;
        mustChangePassword: boolean;
        createdAt: Date;
    }>;
}
