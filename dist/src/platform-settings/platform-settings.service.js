"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformSettingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const DEFAULT_SETTINGS = [
    { key: 'platformName', value: 'Bárbara' },
    { key: 'maxStudentsPerPersonal', value: '50' },
    { key: 'maintenanceMode', value: 'false' },
    { key: 'allowSelfRegistration', value: 'false' },
];
let PlatformSettingsService = class PlatformSettingsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
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
    async upsert(key, dto, _currentUser) {
        return this.prisma.platformSetting.upsert({
            where: { key },
            create: { key, value: dto.value },
            update: { value: dto.value },
        });
    }
};
exports.PlatformSettingsService = PlatformSettingsService;
exports.PlatformSettingsService = PlatformSettingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PlatformSettingsService);
//# sourceMappingURL=platform-settings.service.js.map