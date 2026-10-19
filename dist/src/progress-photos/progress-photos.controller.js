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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressPhotosController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const multer_1 = require("multer");
const roles_decorator_1 = require("../auth/roles.decorator");
const current_user_decorator_1 = require("../auth/current-user.decorator");
const progress_photos_service_1 = require("./progress-photos.service");
const upload_photo_dto_1 = require("./dto/upload-photo.dto");
let ProgressPhotosController = class ProgressPhotosController {
    service;
    constructor(service) {
        this.service = service;
    }
    upload(file, dto, currentUser) {
        return this.service.upload(file, dto, currentUser);
    }
    findAll(studentId, position, currentUser) {
        return this.service.findAll(studentId, position, currentUser);
    }
    findOne(id, currentUser) {
        return this.service.findOne(id, currentUser);
    }
    remove(id, currentUser) {
        return this.service.remove(id, currentUser);
    }
};
exports.ProgressPhotosController = ProgressPhotosController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.Role.PERSONAL),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', { storage: (0, multer_1.memoryStorage)() })),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload de foto de progresso de um aluno' }),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, upload_photo_dto_1.UploadPhotoDto, Object]),
    __metadata("design:returntype", void 0)
], ProgressPhotosController.prototype, "upload", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.Role.ALUNO, client_1.Role.PERSONAL, client_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Listar fotos de progresso de um aluno' }),
    __param(0, (0, common_1.Query)('studentId')),
    __param(1, (0, common_1.Query)('position')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], ProgressPhotosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.ALUNO, client_1.Role.PERSONAL, client_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar foto de progresso por ID' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProgressPhotosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.PERSONAL),
    (0, common_1.HttpCode)(204),
    (0, swagger_1.ApiOperation)({ summary: 'Remover foto de progresso' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProgressPhotosController.prototype, "remove", null);
exports.ProgressPhotosController = ProgressPhotosController = __decorate([
    (0, swagger_1.ApiTags)('progress-photos'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('progress-photos'),
    __metadata("design:paramtypes", [progress_photos_service_1.ProgressPhotosService])
], ProgressPhotosController);
//# sourceMappingURL=progress-photos.controller.js.map