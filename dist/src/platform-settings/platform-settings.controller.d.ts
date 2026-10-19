import type { CurrentUserPayload } from '../auth/current-user.decorator';
import { PlatformSettingsService } from './platform-settings.service';
import { UpsertSettingDto } from './dto/upsert-setting.dto';
export declare class PlatformSettingsController {
    private readonly service;
    constructor(service: PlatformSettingsService);
    findAll(): Promise<{
        id: string;
        updatedAt: Date;
        key: string;
        value: import("@prisma/client/runtime/library").JsonValue;
    }[]>;
    upsert(key: string, dto: UpsertSettingDto, user: CurrentUserPayload): Promise<{
        id: string;
        updatedAt: Date;
        key: string;
        value: import("@prisma/client/runtime/library").JsonValue;
    }>;
}
