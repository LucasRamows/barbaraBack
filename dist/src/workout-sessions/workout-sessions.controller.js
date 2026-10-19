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
exports.WorkoutSessionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const roles_decorator_1 = require("../auth/roles.decorator");
const current_user_decorator_1 = require("../auth/current-user.decorator");
const workout_sessions_service_1 = require("./workout-sessions.service");
const start_session_dto_1 = require("./dto/start-session.dto");
const finish_session_dto_1 = require("./dto/finish-session.dto");
let WorkoutSessionsController = class WorkoutSessionsController {
    service;
    constructor(service) {
        this.service = service;
    }
    findActive(user) {
        return this.service.findActive(user);
    }
    start(dto, user) {
        return this.service.start(dto, user);
    }
    findAll(user, studentId, skip, take) {
        return this.service.findAll(user, studentId, Number(skip ?? 0), Number(take ?? 20));
    }
    findOne(id, user) {
        return this.service.findOne(id, user);
    }
    finish(id, dto, user) {
        return this.service.finish(id, dto, user);
    }
    abandon(id, user) {
        return this.service.abandonSession(id, user);
    }
};
exports.WorkoutSessionsController = WorkoutSessionsController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Buscar sessão ativa do aluno' }),
    (0, roles_decorator_1.Roles)(client_1.Role.ALUNO),
    (0, common_1.Get)('active'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WorkoutSessionsController.prototype, "findActive", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Iniciar sessão de treino' }),
    (0, roles_decorator_1.Roles)(client_1.Role.ALUNO),
    (0, common_1.Post)('start'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [start_session_dto_1.StartSessionDto, Object]),
    __metadata("design:returntype", void 0)
], WorkoutSessionsController.prototype, "start", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Listar histórico de sessões' }),
    (0, roles_decorator_1.Roles)(client_1.Role.ALUNO, client_1.Role.PERSONAL),
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('studentId')),
    __param(2, (0, common_1.Query)('skip')),
    __param(3, (0, common_1.Query)('take')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", void 0)
], WorkoutSessionsController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Buscar sessão por ID' }),
    (0, roles_decorator_1.Roles)(client_1.Role.ALUNO, client_1.Role.PERSONAL),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], WorkoutSessionsController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Finalizar sessão de treino' }),
    (0, roles_decorator_1.Roles)(client_1.Role.ALUNO),
    (0, common_1.Put)(':id/finish'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, finish_session_dto_1.FinishSessionDto, Object]),
    __metadata("design:returntype", void 0)
], WorkoutSessionsController.prototype, "finish", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Abandonar sessão de treino' }),
    (0, roles_decorator_1.Roles)(client_1.Role.ALUNO),
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], WorkoutSessionsController.prototype, "abandon", null);
exports.WorkoutSessionsController = WorkoutSessionsController = __decorate([
    (0, swagger_1.ApiTags)('workout-sessions'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('workout-sessions'),
    __metadata("design:paramtypes", [workout_sessions_service_1.WorkoutSessionsService])
], WorkoutSessionsController);
//# sourceMappingURL=workout-sessions.controller.js.map