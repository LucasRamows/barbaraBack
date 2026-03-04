import { PublicService } from './public.service';
export declare class PublicController {
    private readonly publicService;
    constructor(publicService: PublicService);
    register(body: any): Promise<{
        message: string;
        user: {
            id: string;
            createdAt: Date;
            name: string;
            email: string;
            role: import("@prisma/client").$Enums.Role;
        };
    }>;
    login(body: any): Promise<{
        token: string;
        user: {
            id: string;
            name: string;
            role: import("@prisma/client").$Enums.Role;
        };
    }>;
}
