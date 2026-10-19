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
exports.WorkoutSetsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const roles_decorator_1 = require("../auth/roles.decorator");
const current_user_decorator_1 = require("../auth/current-user.decorator");
const workout_sets_service_1 = require("./workout-sets.service");
const update_set_dto_1 = require("./dto/update-set.dto");
let WorkoutSetsController = class WorkoutSetsController {
    service;
    constructor(service) {
        this.service = service;
    }
    update(setId, dto, user) {
        return this.service.update(setId, dto, user);
    }
    addExtraSet(sessionExerciseId, user) {
        return this.service.addExtraSet(sessionExerciseId, user);
    }
};
exports.WorkoutSetsController = WorkoutSetsController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar série executada' }),
    (0, common_1.Put)(':setId'),
    __param(0, (0, common_1.Param)('setId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_set_dto_1.UpdateWorkoutSetDto, Object]),
    __metadata("design:returntype", void 0)
], WorkoutSetsController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Adicionar série extra ao exercício' }),
    (0, common_1.Post)(':sessionExerciseId/extra'),
    __param(0, (0, common_1.Param)('sessionExerciseId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], WorkoutSetsController.prototype, "addExtraSet", null);
exports.WorkoutSetsController = WorkoutSetsController = __decorate([
    (0, swagger_1.ApiTags)('workout-sets'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, roles_decorator_1.Roles)(client_1.Role.ALUNO),
    (0, common_1.Controller)('workout-sets'),
    __metadata("design:paramtypes", [workout_sets_service_1.WorkoutSetsService])
], WorkoutSetsController);
//# sourceMappingURL=workout-sets.controller.js.map