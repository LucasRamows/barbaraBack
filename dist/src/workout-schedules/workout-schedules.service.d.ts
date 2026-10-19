import { PrismaService } from '../prisma/prisma.service';
import { CurrentUserPayload } from '../auth/current-user.decorator';
import { CreateWorkoutScheduleDto } from './dto/create-schedule.dto';
import { UpdateWorkoutScheduleDto } from './dto/update-schedule.dto';
export declare class WorkoutSchedulesService {
    private prisma;
    constructor(prisma: PrismaService);
    private getPersonal;
    private assertStudentOwnership;
    private assertPlanOwnership;
    create(dto: CreateWorkoutScheduleDto, currentUser: CurrentUserPayload): Promise<{
        workoutPlan: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        isActive: boolean;
        dayOfWeek: import("@prisma/client").$Enums.DayOfWeek;
        validFrom: Date | null;
        validUntil: Date | null;
        workoutPlanId: string;
    }>;
    findByStudent(studentId: string, currentUser: CurrentUserPayload): Promise<({
        workoutPlan: {
            id: string;
            name: string;
            objective: string | null;
            estimatedMinutes: number | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        isActive: boolean;
        dayOfWeek: import("@prisma/client").$Enums.DayOfWeek;
        validFrom: Date | null;
        validUntil: Date | null;
        workoutPlanId: string;
    })[]>;
    update(id: string, dto: UpdateWorkoutScheduleDto, currentUser: CurrentUserPayload): Promise<{
        workoutPlan: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        studentId: string;
        isActive: boolean;
        dayOfWeek: import("@prisma/client").$Enums.DayOfWeek;
        validFrom: Date | null;
        validUntil: Date | null;
        workoutPlanId: string;
    }>;
    remove(id: string, currentUser: CurrentUserPayload): Promise<void>;
}
