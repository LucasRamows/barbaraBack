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
exports.BodyMeasurementsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const roles_decorator_1 = require("../auth/roles.decorator");
const current_user_decorator_1 = require("../auth/current-user.decorator");
const body_measurements_service_1 = require("./body-measurements.service");
const create_body_measurement_dto_1 = require("./dto/create-body-measurement.dto");
const update_body_measurement_dto_1 = require("./dto/update-body-measurement.dto");
let BodyMeasurementsController = class BodyMeasurementsController {
    service;
    constructor(service) {
        this.service = service;
    }
    create(dto, currentUser) {
        return this.service.create(dto, currentUser);
    }
    findAll(studentId, currentUser) {
        return this.service.findAll(studentId, currentUser);
    }
    findOne(id, currentUser) {
        return this.service.findOne(id, currentUser);
    }
    update(id, dto, currentUser) {
        return this.service.update(id, dto, currentUser);
    }
    remove(id, currentUser) {
        return this.service.remove(id, currentUser);
    }
};
exports.BodyMeasurementsController = BodyMeasurementsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.Role.PERSONAL),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar medidas corporais de um aluno' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_body_measurement_dto_1.CreateBodyMeasurementDto, Object]),
    __metadata("design:returntype", void 0)
], BodyMeasurementsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.Role.ALUNO, client_1.Role.PERSONAL, client_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Listar medidas corporais de um aluno' }),
    __param(0, (0, common_1.Query)('studentId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BodyMeasurementsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.ALUNO, client_1.Role.PERSONAL, client_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar uma medida corporal por ID' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BodyMeasurementsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.PERSONAL),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar medida corporal' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_body_measurement_dto_1.UpdateBodyMeasurementDto, Object]),
    __metadata("design:returntype", void 0)
], BodyMeasurementsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.PERSONAL),
    (0, common_1.HttpCode)(204),
    (0, swagger_1.ApiOperation)({ summary: 'Remover medida corporal' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BodyMeasurementsController.prototype, "remove", null);
exports.BodyMeasurementsController = BodyMeasurementsController = __decorate([
    (0, swagger_1.ApiTags)('body-measurements'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('body-measurements'),
    __metadata("design:paramtypes", [body_measurements_service_1.BodyMeasurementsService])
], BodyMeasurementsController);
//# sourceMappingURL=body-measurements.controller.js.map