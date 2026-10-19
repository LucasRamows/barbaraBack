import { UserStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { CurrentUserPayload } from '../auth/current-user.decorator';
export declare class StudentsService {
    private prisma;
    constructor(prisma: PrismaService);
    private getPersonalProfile;
    private assertOwnership;
    create(dto: CreateStudentDto, currentUser: CurrentUserPayload): Promise<any>;
    findAll(currentUser: CurrentUserPayload): Promise<{
        user: {
            id: string;
            username: string;
            status: import("@prisma/client").$Enums.UserStatus;
            createdAt: Date;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        name: string;
        userId: string;
        email: string | null;
        phone: string | null;
        avatarUrl: string | null;
        birthDate: Date | null;
        sex: string | null;
        height: number | null;
        objective: string | null;
        experienceLevel: string | null;
        restrictions: string | null;
        observations: string | null;
        startDate: Date;
    }[]>;
    findOne(id: string, currentUser: CurrentUserPayload): Promise<{
        user: {
            id: string;
            username: string;
            status: import("@prisma/client").$Enums.UserStatus;
            mustChangePassword: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        name: string;
        userId: string;
        email: string | null;
        phone: string | null;
        avatarUrl: string | null;
        birthDate: Date | null;
        sex: string | null;
        height: number | null;
        objective: string | null;
        experienceLevel: string | null;
        restrictions: string | null;
        observations: string | null;
        startDate: Date;
    }>;
    update(id: string, dto: UpdateStudentDto, currentUser: CurrentUserPayload): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        name: string;
        userId: string;
        email: string | null;
        phone: string | null;
        avatarUrl: string | null;
        birthDate: Date | null;
        sex: string | null;
        height: number | null;
        objective: string | null;
        experienceLevel: string | null;
        restrictions: string | null;
        observations: string | null;
        startDate: Date;
    }>;
    remove(id: string, currentUser: CurrentUserPayload): Promise<void>;
    updateStatus(id: string, status: UserStatus, currentUser: CurrentUserPayload): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.UserStatus;
    }>;
    resetPassword(id: string, newPassword: string, currentUser: CurrentUserPayload): Promise<void>;
}
