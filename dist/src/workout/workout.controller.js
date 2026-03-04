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
exports.WorkoutController = void 0;
const common_1 = require("@nestjs/common");
const workout_service_1 = require("./workout.service");
const auth_guard_1 = require("../auth/auth.guard");
let WorkoutController = class WorkoutController {
    workoutService;
    constructor(workoutService) {
        this.workoutService = workoutService;
    }
    async createPlan(body, req) {
        return this.workoutService.createPlan(body, req.user.id);
    }
    async getPlans(req) {
        return this.workoutService.getPlans(req.user.id);
    }
    async updatePlan(id, body, req) {
        return this.workoutService.updatePlan(id, body, req.user.id);
    }
    async deletePlan(id, req) {
        return this.workoutService.deletePlan(id, req.user.id);
    }
    async addDayToPlan(planId, body, req) {
        return this.workoutService.addDayToPlan(planId, body, req.user.id);
    }
    async addExerciseToDay(dayId, body) {
        return this.workoutService.addExerciseToDay(dayId, body);
    }
    async updateExerciseOnDay(id, body) {
        return this.workoutService.updateExerciseOnDay(id, body);
    }
    async getExercisesToday(phone) {
        return this.workoutService.getExercisesToday(phone);
    }
    async createExercise(body) {
        return this.workoutService.createExercise(body);
    }
    async getExercises(search) {
        return this.workoutService.getExercises(search);
    }
    async deleteExerciseOnDay(id) {
        return this.workoutService.deleteExerciseOnDay(id);
    }
};
exports.WorkoutController = WorkoutController;
__decorate([
    (0, common_1.Post)('plans'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WorkoutController.prototype, "createPlan", null);
__decorate([
    (0, common_1.Get)('plans'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WorkoutController.prototype, "getPlans", null);
__decorate([
    (0, common_1.Put)('plans/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], WorkoutController.prototype, "updatePlan", null);
__decorate([
    (0, common_1.Delete)('plans/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WorkoutController.prototype, "deletePlan", null);
__decorate([
    (0, common_1.Post)('plans/:planId/days'),
    __param(0, (0, common_1.Param)('planId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], WorkoutController.prototype, "addDayToPlan", null);
__decorate([
    (0, common_1.Post)('days/:dayId/exercises'),
    __param(0, (0, common_1.Param)('dayId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WorkoutController.prototype, "addExerciseToDay", null);
__decorate([
    (0, common_1.Put)('exercises-on-day/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WorkoutController.prototype, "updateExerciseOnDay", null);
__decorate([
    (0, common_1.Get)('users/by-phone/:phone/exercises/today'),
    __param(0, (0, common_1.Param)('phone')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WorkoutController.prototype, "getExercisesToday", null);
__decorate([
    (0, common_1.Post)('exercises'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WorkoutController.prototype, "createExercise", null);
__decorate([
    (0, common_1.Get)('exercises'),
    __param(0, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WorkoutController.prototype, "getExercises", null);
__decorate([
    (0, common_1.Delete)('exercises-on-day/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WorkoutController.prototype, "deleteExerciseOnDay", null);
exports.WorkoutController = WorkoutController = __decorate([
    (0, common_1.Controller)('private'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [workout_service_1.WorkoutService])
], WorkoutController);
//# sourceMappingURL=workout.controller.js.map