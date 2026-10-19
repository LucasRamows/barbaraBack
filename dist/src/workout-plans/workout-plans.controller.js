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
exports.WorkoutPlansController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const roles_decorator_1 = require("../auth/roles.decorator");
const current_user_decorator_1 = require("../auth/current-user.decorator");
const workout_plans_service_1 = require("./workout-plans.service");
const create_plan_dto_1 = require("./dto/create-plan.dto");
const update_plan_dto_1 = require("./dto/update-plan.dto");
const create_plan_day_dto_1 = require("./dto/create-plan-day.dto");
const update_plan_day_dto_1 = require("./dto/update-plan-day.dto");
const add_exercise_to_day_dto_1 = require("./dto/add-exercise-to-day.dto");
const update_exercise_on_day_dto_1 = require("./dto/update-exercise-on-day.dto");
const reorder_exercises_dto_1 = require("./dto/reorder-exercises.dto");
let WorkoutPlansController = class WorkoutPlansController {
    service;
    constructor(service) {
        this.service = service;
    }
    createPlan(dto, user) {
        return this.service.createPlan(dto, user);
    }
    findAllPlans(user) {
        return this.service.findAllPlans(user);
    }
    findOnePlan(id, user) {
        return this.service.findOnePlan(id, user);
    }
    updatePlan(id, dto, user) {
        return this.service.updatePlan(id, dto, user);
    }
    removePlan(id, user) {
        return this.service.removePlan(id, user);
    }
    duplicatePlan(id, user) {
        return this.service.duplicatePlan(id, user);
    }
    createDay(planId, dto, user) {
        return this.service.createDay(planId, dto, user);
    }
    updateDay(planId, dayId, dto, user) {
        return this.service.updateDay(planId, dayId, dto, user);
    }
    removeDay(planId, dayId, user) {
        return this.service.removeDay(planId, dayId, user);
    }
    addExercise(planId, dayId, dto, user) {
        return this.service.addExerciseToDay(planId, dayId, dto, user);
    }
    updateExercise(planId, dayId, workoutExId, dto, user) {
        return this.service.updateExerciseOnDay(planId, dayId, workoutExId, dto, user);
    }
    removeExercise(planId, dayId, workoutExId, user) {
        return this.service.removeExerciseFromDay(planId, dayId, workoutExId, user);
    }
    reorderExercises(planId, dayId, dto, user) {
        return this.service.reorderExercises(planId, dayId, dto, user);
    }
};
exports.WorkoutPlansController = WorkoutPlansController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Criar ficha de treino' }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_plan_dto_1.CreateWorkoutPlanDto, Object]),
    __metadata("design:returntype", void 0)
], WorkoutPlansController.prototype, "createPlan", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Listar fichas do personal' }),
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WorkoutPlansController.prototype, "findAllPlans", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Buscar ficha com dias e exercícios' }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], WorkoutPlansController.prototype, "findOnePlan", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar ficha' }),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_plan_dto_1.UpdateWorkoutPlanDto, Object]),
    __metadata("design:returntype", void 0)
], WorkoutPlansController.prototype, "updatePlan", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Remover ficha (exclusão lógica)' }),
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], WorkoutPlansController.prototype, "removePlan", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Duplicar ficha' }),
    (0, common_1.Post)(':id/duplicate'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], WorkoutPlansController.prototype, "duplicatePlan", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Adicionar dia à ficha' }),
    (0, common_1.Post)(':id/days'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_plan_day_dto_1.CreatePlanDayDto, Object]),
    __metadata("design:returntype", void 0)
], WorkoutPlansController.prototype, "createDay", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar dia' }),
    (0, common_1.Put)(':id/days/:dayId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('dayId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_plan_day_dto_1.UpdatePlanDayDto, Object]),
    __metadata("design:returntype", void 0)
], WorkoutPlansController.prototype, "updateDay", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Remover dia' }),
    (0, common_1.Delete)(':id/days/:dayId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('dayId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], WorkoutPlansController.prototype, "removeDay", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Adicionar exercício ao dia' }),
    (0, common_1.Post)(':id/days/:dayId/exercises'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('dayId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, add_exercise_to_day_dto_1.AddExerciseToDayDto, Object]),
    __metadata("design:returntype", void 0)
], WorkoutPlansController.prototype, "addExercise", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar exercício no dia' }),
    (0, common_1.Put)(':id/days/:dayId/exercises/:workoutExId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('dayId')),
    __param(2, (0, common_1.Param)('workoutExId')),
    __param(3, (0, common_1.Body)()),
    __param(4, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, update_exercise_on_day_dto_1.UpdateExerciseOnDayDto, Object]),
    __metadata("design:returntype", void 0)
], WorkoutPlansController.prototype, "updateExercise", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Remover exercício do dia' }),
    (0, common_1.Delete)(':id/days/:dayId/exercises/:workoutExId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('dayId')),
    __param(2, (0, common_1.Param)('workoutExId')),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", void 0)
], WorkoutPlansController.prototype, "removeExercise", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Reordenar exercícios do dia' }),
    (0, common_1.Put)(':id/days/:dayId/exercises/reorder'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('dayId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, reorder_exercises_dto_1.ReorderExercisesDto, Object]),
    __metadata("design:returntype", void 0)
], WorkoutPlansController.prototype, "reorderExercises", null);
exports.WorkoutPlansController = WorkoutPlansController = __decorate([
    (0, swagger_1.ApiTags)('workout-plans'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, roles_decorator_1.Roles)(client_1.Role.PERSONAL),
    (0, common_1.Controller)('workout-plans'),
    __metadata("design:paramtypes", [workout_plans_service_1.WorkoutPlansService])
], WorkoutPlansController);
//# sourceMappingURL=workout-plans.controller.js.map