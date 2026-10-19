import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CurrentUserPayload } from '../auth/current-user.decorator';
import { UpsertSettingDto } from './dto/upsert-setting.dto';
export declare class PlatformSettingsService implements OnModuleInit {
    private prisma;
    constructor(prisma: PrismaService);
    onModuleInit(): Promise<void>;
    findAll(): Promise<{
        key: string;
        id: string;
        updatedAt: Date;
        value: import("@prisma/client/runtime/library").JsonValue;
    }[]>;
    upsert(key: string, dto: UpsertSettingDto, _currentUser: CurrentUserPayload): Promise<{
        key: string;
        id: string;
        updatedAt: Date;
        value: import("@prisma/client/runtime/library").JsonValue;
    }>;
}
