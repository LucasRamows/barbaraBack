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
exports.RewardRulesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const roles_decorator_1 = require("../auth/roles.decorator");
const current_user_decorator_1 = require("../auth/current-user.decorator");
const reward_rules_service_1 = require("./reward-rules.service");
const create_reward_rule_dto_1 = require("./dto/create-reward-rule.dto");
const update_reward_rule_dto_1 = require("./dto/update-reward-rule.dto");
let RewardRulesController = class RewardRulesController {
    rewardRulesService;
    constructor(rewardRulesService) {
        this.rewardRulesService = rewardRulesService;
    }
    findAll(user) {
        return this.rewardRulesService.findAll(user);
    }
    create(dto, user) {
        return this.rewardRulesService.create(dto, user);
    }
    update(id, dto, user) {
        return this.rewardRulesService.update(id, dto, user);
    }
    remove(id, user) {
        return this.rewardRulesService.remove(id, user);
    }
};
exports.RewardRulesController = RewardRulesController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.Role.PERSONAL, client_1.Role.SUPER_ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RewardRulesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.Role.PERSONAL),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_reward_rule_dto_1.CreateRewardRuleDto, Object]),
    __metadata("design:returntype", void 0)
], RewardRulesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.PERSONAL),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_reward_rule_dto_1.UpdateRewardRuleDto, Object]),
    __metadata("design:returntype", void 0)
], RewardRulesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(client_1.Role.PERSONAL),
    (0, common_1.HttpCode)(204),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RewardRulesController.prototype, "remove", null);
exports.RewardRulesController = RewardRulesController = __decorate([
    (0, swagger_1.ApiTags)('reward-rules'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('reward-rules'),
    __metadata("design:paramtypes", [reward_rules_service_1.RewardRulesService])
], RewardRulesController);
//# sourceMappingURL=reward-rules.controller.js.map