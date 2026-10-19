"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRewardRuleDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_reward_rule_dto_1 = require("./create-reward-rule.dto");
class UpdateRewardRuleDto extends (0, mapped_types_1.PartialType)(create_reward_rule_dto_1.CreateRewardRuleDto) {
}
exports.UpdateRewardRuleDto = UpdateRewardRuleDto;
//# sourceMappingURL=update-reward-rule.dto.js.map