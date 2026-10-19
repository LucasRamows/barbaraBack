import { UserStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePersonalDto } from './dto/create-personal.dto';
import { UpdatePersonalDto } from './dto/update-personal.dto';
export declare class PersonalsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreatePersonalDto): Promise<{
        id: string;
        username: string;
        role: import("@prisma/client").$Enums.Role;
        status: import("@prisma/client").$Enums.UserStatus;
        createdAt: Date;
        personalProfile: {
            id: string;
            name: string;
            email: string | null;
            phone: string | null;
        } | null;
    }>;
    findAll(): Promise<{
        id: string;
        username: string;
        role: import("@prisma/client").$Enums.Role;
        status: import("@prisma/client").$Enums.UserStatus;
        createdAt: Date;
        personalProfile: {
            id: string;
            name: string;
            email: string | null;
            phone: string | null;
        } | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        username: string;
        role: import("@prisma/client").$Enums.Role;
        status: import("@prisma/client").$Enums.UserStatus;
        createdAt: Date;
        updatedAt: Date;
        personalProfile: {
            id: string;
            name: string;
            email: string | null;
            phone: string | null;
            avatarUrl: string | null;
            bio: string | null;
        } | null;
    }>;
    update(id: string, dto: UpdatePersonalDto): Promise<{
        id: string;
        username: string;
        personalProfile: {
            id: string;
            name: string;
            email: string | null;
            phone: string | null;
            bio: string | null;
        } | null;
    }>;
    remove(id: string): Promise<void>;
    updateStatus(id: string, status: UserStatus): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.UserStatus;
    }>;
    resetPassword(id: string, newPassword: string): Promise<void>;
}
