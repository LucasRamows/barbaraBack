import type { CurrentUserPayload } from '../auth/current-user.decorator';
import { GiftsService } from './gifts.service';
import { CreateGiftDto } from './dto/create-gift.dto';
import { UpdateGiftDto } from './dto/update-gift.dto';
export declare class GiftsController {
    private readonly giftsService;
    constructor(giftsService: GiftsService);
    create(dto: CreateGiftDto, user: CurrentUserPayload): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        name: string;
        description: string | null;
        personalId: string;
        instructions: string | null;
        isActive: boolean;
        imageUrl: string | null;
    }>;
    findAll(user: CurrentUserPayload): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        name: string;
        description: string | null;
        personalId: string;
        instructions: string | null;
        isActive: boolean;
        imageUrl: string | null;
    }[]>;
    findOne(id: string, user: CurrentUserPayload): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        name: string;
        description: string | null;
        personalId: string;
        instructions: string | null;
        isActive: boolean;
        imageUrl: string | null;
    }>;
    update(id: string, dto: UpdateGiftDto, user: CurrentUserPayload): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        name: string;
        description: string | null;
        personalId: string;
        instructions: string | null;
        isActive: boolean;
        imageUrl: string | null;
    }>;
    remove(id: string, user: CurrentUserPayload): Promise<void>;
}
