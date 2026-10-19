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
exports.ExercisesController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const roles_decorator_1 = require("../auth/roles.decorator");
const current_user_decorator_1 = require("../auth/current-user.decorator");
const exercises_service_1 = require("./exercises.service");
const create_exercise_dto_1 = require("./dto/create-exercise.dto");
const update_exercise_dto_1 = require("./dto/update-exercise.dto");
let ExercisesController = class ExercisesController {
    service;
    constructor(service) {
        this.service = service;
    }
    create(dto, user) {
        return this.service.create(dto, user);
    }
    findAll(user) {
        return this.service.findAll(user);
    }
    findOne(id, user) {
        return this.service.findOne(id, user);
    }
    update(id, dto, user) {
        return this.service.update(id, dto, user);
    }
    remove(id, user) {
        return this.service.remove(id, user);
    }
    addImage(id, file, user) {
        return this.service.addImage(id, file, user);
    }
    removeImage(id, imageId, user) {
        return this.service.removeImage(id, imageId, user);
    }
};
exports.ExercisesController = ExercisesController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Criar exercício' }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_exercise_dto_1.CreateExerciseDto, Object]),
    __metadata("design:returntype", void 0)
], ExercisesController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Listar exercícios do personal' }),
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ExercisesController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Buscar exercício por ID' }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ExercisesController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar exercício' }),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_exercise_dto_1.UpdateExerciseDto, Object]),
    __metadata("design:returntype", void 0)
], ExercisesController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Remover exercício (exclusão lógica)' }),
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ExercisesController.prototype, "remove", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Adicionar imagem ao exercício' }),
    (0, common_1.Post)(':id/images'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], ExercisesController.prototype, "addImage", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Remover imagem do exercício' }),
    (0, common_1.Delete)(':id/images/:imageId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('imageId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], ExercisesController.prototype, "removeImage", null);
exports.ExercisesController = ExercisesController = __decorate([
    (0, swagger_1.ApiTags)('exercises'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, roles_decorator_1.Roles)(client_1.Role.PERSONAL),
    (0, common_1.Controller)('exercises'),
    __metadata("design:paramtypes", [exercises_service_1.ExercisesService])
], ExercisesController);
//# sourceMappingURL=exercises.controller.js.map