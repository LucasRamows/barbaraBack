import { UsersService } from './users.service';
import type { CurrentUserPayload } from '../auth/current-user.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
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
    changePassword(currentUser: CurrentUserPayload, dto: ChangePasswordDto): Promise<void>;
}
