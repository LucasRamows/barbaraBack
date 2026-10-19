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
exports.WorkoutSchedulesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const roles_decorator_1 = require("../auth/roles.decorator");
const current_user_decorator_1 = require("../auth/current-user.decorator");
const workout_schedules_service_1 = require("./workout-schedules.service");
const create_schedule_dto_1 = require("./dto/create-schedule.dto");
const update_schedule_dto_1 = require("./dto/update-schedule.dto");
let WorkoutSchedulesController = class WorkoutSchedulesController {
    service;
    constructor(service) {
        this.service = service;
    }
    create(dto, user) {
        return this.service.create(dto, user);
    }
    findByStudent(studentId, user) {
        return this.service.findByStudent(studentId, user);
    }
    update(id, dto, user) {
        return this.service.update(id, dto, user);
    }
    remove(id, user) {
        return this.service.remove(id, user);
    }
};
exports.WorkoutSchedulesController = WorkoutSchedulesController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Criar ou atualizar programação semanal do aluno' }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_schedule_dto_1.CreateWorkoutScheduleDto, Object]),
    __metadata("design:returntype", void 0)
], WorkoutSchedulesController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Listar programação semanal do aluno' }),
    (0, swagger_1.ApiQuery)({ name: 'studentId', required: true }),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('studentId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], WorkoutSchedulesController.prototype, "findByStudent", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar programação' }),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_schedule_dto_1.UpdateWorkoutScheduleDto, Object]),
    __metadata("design:returntype", void 0)
], WorkoutSchedulesController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Remover programação' }),
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], WorkoutSchedulesController.prototype, "remove", null);
exports.WorkoutSchedulesController = WorkoutSchedulesController = __decorate([
    (0, swagger_1.ApiTags)('workout-schedules'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, roles_decorator_1.Roles)(client_1.Role.PERSONAL),
    (0, common_1.Controller)('workout-schedules'),
    __metadata("design:paramtypes", [workout_schedules_service_1.WorkoutSchedulesService])
], WorkoutSchedulesController);
//# sourceMappingURL=workout-schedules.controller.js.map