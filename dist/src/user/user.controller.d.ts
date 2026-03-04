import { UserService } from './user.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getMe(req: any): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
    }>;
    updateUser(body: any, req: any): Promise<{
        id: string;
        name: string;
        email: string;
    }>;
}
