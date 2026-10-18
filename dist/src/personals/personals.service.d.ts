import { UserStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePersonalDto } from './dto/create-personal.dto';
import { UpdatePersonalDto } from './dto/update-personal.dto';
export declare class PersonalsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreatePersonalDto): Promise<{
        personalProfile: {
            name: string;
            id: string;
            email: string | null;
            phone: string | null;
        } | null;
        username: string;
        id: string;
        role: import("@prisma/client").$Enums.Role;
        status: import("@prisma/client").$Enums.UserStatus;
        createdAt: Date;
    }>;
    findAll(): Promise<{
        personalProfile: {
            name: string;
            id: string;
            email: string | null;
            phone: string | null;
        } | null;
        username: string;
        id: string;
        role: import("@prisma/client").$Enums.Role;
        status: import("@prisma/client").$Enums.UserStatus;
        createdAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        personalProfile: {
            name: string;
            id: string;
            email: string | null;
            phone: string | null;
            avatarUrl: string | null;
            bio: string | null;
        } | null;
        username: string;
        id: string;
        role: import("@prisma/client").$Enums.Role;
        status: import("@prisma/client").$Enums.UserStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, dto: UpdatePersonalDto): Promise<{
        personalProfile: {
            name: string;
            id: string;
            email: string | null;
            phone: string | null;
            bio: string | null;
        } | null;
        username: string;
        id: string;
    }>;
    remove(id: string): Promise<void>;
    updateStatus(id: string, status: UserStatus): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.UserStatus;
    }>;
    resetPassword(id: string, newPassword: string): Promise<void>;
}
