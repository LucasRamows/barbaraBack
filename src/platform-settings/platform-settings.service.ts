import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CurrentUserPayload } from '../auth/current-user.decorator';
import { UpsertSettingDto } from './dto/upsert-setting.dto';

const DEFAULT_SETTINGS = [
  { key: 'platformName', value: 'Bárbara' },
  { key: 'maxStudentsPerPersonal', value: '50' },
  { key: 'maintenanceMode', value: 'false' },
  { key: 'allowSelfRegistration', value: 'false' },
];

@Injectable()
export class PlatformSettingsService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    for (const setting of DEFAULT_SETTINGS) {
      await this.prisma.platformSetting.upsert({
        where: { key: setting.key },
        create: { key: setting.key, value: setting.value },
        update: {},
      });
    }
  }

  async findAll() {
    return this.prisma.platformSetting.findMany({ orderBy: { key: 'asc' } });
  }

  async upsert(key: string, dto: UpsertSettingDto, _currentUser: CurrentUserPayload) {
    return this.prisma.platformSetting.upsert({
      where: { key },
      create: { key, value: dto.value },
      update: { value: dto.value },
    });
  }
}
