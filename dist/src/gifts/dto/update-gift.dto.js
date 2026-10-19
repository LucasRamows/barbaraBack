"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateGiftDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_gift_dto_1 = require("./create-gift.dto");
class UpdateGiftDto extends (0, mapped_types_1.PartialType)(create_gift_dto_1.CreateGiftDto) {
}
exports.UpdateGiftDto = UpdateGiftDto;
//# sourceMappingURL=update-gift.dto.js.map