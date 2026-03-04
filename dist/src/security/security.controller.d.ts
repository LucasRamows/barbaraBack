import { SecurityService } from './security.service';
export declare class SecurityController {
    private readonly securityService;
    constructor(securityService: SecurityService);
    createCredential(body: any, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        email: string;
        password: string;
        site: string;
    }>;
    updatePublicKey(body: any, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        notifyCalendar: boolean;
        publicKey: string;
    }>;
    getPublicKey(req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        notifyCalendar: boolean;
        publicKey: string;
    }[]>;
    getCredentials(req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        email: string;
        password: string;
        site: string;
    }[]>;
    updateCredential(id: string, body: any, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        email: string;
        password: string;
        site: string;
    }>;
    deleteCredential(id: string, req: any): Promise<void>;
    getStats(req: any): Promise<{
        totalCredentials: number;
    }>;
}
