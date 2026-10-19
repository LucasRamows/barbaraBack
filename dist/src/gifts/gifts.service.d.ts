import { PrismaService } from '../prisma/prisma.service';
import { CurrentUserPayload } from '../auth/current-user.decorator';
import { CreateGiftDto } from './dto/create-gift.dto';
import { UpdateGiftDto } from './dto/update-gift.dto';
export declare class GiftsService {
    private prisma;
    constructor(prisma: PrismaService);
    private getPersonalProfile;
    create(dto: CreateGiftDto, currentUser: CurrentUserPayload): Promise<{
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        personalId: string;
        instructions: string | null;
        isActive: boolean;
        imageUrl: string | null;
    }>;
    findAll(currentUser: CurrentUserPayload): Promise<{
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        personalId: string;
        instructions: string | null;
        isActive: boolean;
        imageUrl: string | null;
    }[]>;
    findOne(id: string, currentUser: CurrentUserPayload): Promise<{
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        personalId: string;
        instructions: string | null;
        isActive: boolean;
        imageUrl: string | null;
    }>;
    update(id: string, dto: UpdateGiftDto, currentUser: CurrentUserPayload): Promise<{
        name: string;
        description: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        personalId: string;
        instructions: string | null;
        isActive: boolean;
        imageUrl: string | null;
    }>;
    remove(id: string, currentUser: CurrentUserPayload): Promise<void>;
}
