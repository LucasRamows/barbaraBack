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
exports.PersonalsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const roles_decorator_1 = require("../auth/roles.decorator");
const personals_service_1 = require("./personals.service");
const create_personal_dto_1 = require("./dto/create-personal.dto");
const update_personal_dto_1 = require("./dto/update-personal.dto");
const update_status_dto_1 = require("./dto/update-status.dto");
const reset_password_dto_1 = require("./dto/reset-password.dto");
let PersonalsController = class PersonalsController {
    personalsService;
    constructor(personalsService) {
        this.personalsService = personalsService;
    }
    create(dto) {
        return this.personalsService.create(dto);
    }
    findAll() {
        return this.personalsService.findAll();
    }
    findOne(id) {
        return this.personalsService.findOne(id);
    }
    update(id, dto) {
        return this.personalsService.update(id, dto);
    }
    remove(id) {
        return this.personalsService.remove(id);
    }
    updateStatus(id, dto) {
        return this.personalsService.updateStatus(id, dto.status);
    }
    resetPassword(id, dto) {
        return this.personalsService.resetPassword(id, dto.newPassword);
    }
};
exports.PersonalsController = PersonalsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Cadastrar personal (SUPER_ADMIN)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_personal_dto_1.CreatePersonalDto]),
    __metadata("design:returntype", void 0)
], PersonalsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar personals (SUPER_ADMIN)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PersonalsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Detalhar personal (SUPER_ADMIN)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PersonalsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar personal (SUPER_ADMIN)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_personal_dto_1.UpdatePersonalDto]),
    __metadata("design:returntype", void 0)
], PersonalsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Excluir personal logicamente (SUPER_ADMIN)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PersonalsController.prototype, "remove", null);
__decorate([
    (0, common_1.Put)(':id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Bloquear/ativar personal (SUPER_ADMIN)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_status_dto_1.UpdateStatusDto]),
    __metadata("design:returntype", void 0)
], PersonalsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Put)(':id/reset-password'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Redefinir senha do personal (SUPER_ADMIN)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reset_password_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", void 0)
], PersonalsController.prototype, "resetPassword", null);
exports.PersonalsController = PersonalsController = __decorate([
    (0, swagger_1.ApiTags)('personals'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER_ADMIN),
    (0, common_1.Controller)('personals'),
    __metadata("design:paramtypes", [personals_service_1.PersonalsService])
], PersonalsController);
//# sourceMappingURL=personals.controller.js.map