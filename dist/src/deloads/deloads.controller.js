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
exports.DeloadsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const roles_decorator_1 = require("../auth/roles.decorator");
const current_user_decorator_1 = require("../auth/current-user.decorator");
const deloads_service_1 = require("./deloads.service");
const create_deload_dto_1 = require("./dto/create-deload.dto");
const update_deload_dto_1 = require("./dto/update-deload.dto");
let DeloadsController = class DeloadsController {
    service;
    constructor(service) {
        this.service = service;
    }
    create(dto, user) {
        return this.service.create(dto, user);
    }
    findAll(user, studentId) {
        return this.service.findAll(user, studentId);
    }
    update(id, dto, user) {
        return this.service.update(id, dto, user);
    }
    remove(id, user) {
        return this.service.remove(id, user);
    }
};
exports.DeloadsController = DeloadsController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Criar período de deload' }),
    (0, roles_decorator_1.Roles)(client_1.Role.PERSONAL),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_deload_dto_1.CreateDeloadDto, Object]),
    __metadata("design:returntype", void 0)
], DeloadsController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Listar períodos de deload' }),
    (0, roles_decorator_1.Roles)(client_1.Role.PERSONAL, client_1.Role.ALUNO),
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], DeloadsController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar período de deload' }),
    (0, roles_decorator_1.Roles)(client_1.Role.PERSONAL),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_deload_dto_1.UpdateDeloadDto, Object]),
    __metadata("design:returntype", void 0)
], DeloadsController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Remover período de deload' }),
    (0, roles_decorator_1.Roles)(client_1.Role.PERSONAL),
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], DeloadsController.prototype, "remove", null);
exports.DeloadsController = DeloadsController = __decorate([
    (0, swagger_1.ApiTags)('deloads'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('deloads'),
    __metadata("design:paramtypes", [deloads_service_1.DeloadsService])
], DeloadsController);
//# sourceMappingURL=deloads.controller.js.map