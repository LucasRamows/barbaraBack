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
exports.RewardAchievementsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_validator_1 = require("class-validator");
const roles_decorator_1 = require("../auth/roles.decorator");
const current_user_decorator_1 = require("../auth/current-user.decorator");
const reward_achievements_service_1 = require("./reward-achievements.service");
class UpdateAchievementStatusDto {
    status;
    notes;
}
__decorate([
    (0, class_validator_1.IsEnum)(client_1.RewardAchievementStatus),
    __metadata("design:type", String)
], UpdateAchievementStatusDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAchievementStatusDto.prototype, "notes", void 0);
let RewardAchievementsController = class RewardAchievementsController {
    service;
    constructor(service) {
        this.service = service;
    }
    checkAndUpdate(studentId, user) {
        return this.service.checkAndUpdate(studentId, user);
    }
    findAchievements(studentId, user) {
        return this.service.findAchievements(studentId, user);
    }
    getProgress(studentId, user) {
        return this.service.getProgress(studentId, user);
    }
    updateStatus(id, dto, user) {
        return this.service.updateStatus(id, dto.status, user, dto.notes);
    }
};
exports.RewardAchievementsController = RewardAchievementsController;
__decorate([
    (0, common_1.Post)('check/:studentId'),
    (0, roles_decorator_1.Roles)(client_1.Role.PERSONAL),
    __param(0, (0, common_1.Param)('studentId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RewardAchievementsController.prototype, "checkAndUpdate", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.Role.ALUNO, client_1.Role.PERSONAL),
    __param(0, (0, common_1.Query)('studentId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RewardAchievementsController.prototype, "findAchievements", null);
__decorate([
    (0, common_1.Get)('progress'),
    (0, roles_decorator_1.Roles)(client_1.Role.ALUNO, client_1.Role.PERSONAL),
    __param(0, (0, common_1.Query)('studentId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RewardAchievementsController.prototype, "getProgress", null);
__decorate([
    (0, common_1.Put)(':id/status'),
    (0, roles_decorator_1.Roles)(client_1.Role.PERSONAL, client_1.Role.ALUNO),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateAchievementStatusDto, Object]),
    __metadata("design:returntype", void 0)
], RewardAchievementsController.prototype, "updateStatus", null);
exports.RewardAchievementsController = RewardAchievementsController = __decorate([
    (0, swagger_1.ApiTags)('reward-achievements'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('reward-achievements'),
    __metadata("design:paramtypes", [reward_achievements_service_1.RewardAchievementsService])
], RewardAchievementsController);
//# sourceMappingURL=reward-achievements.controller.js.map