import type { CurrentUserPayload } from '../auth/current-user.decorator';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { UpdateStatusDto } from '../personals/dto/update-status.dto';
import { ResetPasswordDto } from '../personals/dto/reset-password.dto';
export declare class StudentsController {
    private readonly studentsService;
    constructor(studentsService: StudentsService);
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
    updateStatus(id: string, dto: UpdateStatusDto, currentUser: CurrentUserPayload): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.UserStatus;
    }>;
    resetPassword(id: string, dto: ResetPasswordDto, currentUser: CurrentUserPayload): Promise<void>;
}
