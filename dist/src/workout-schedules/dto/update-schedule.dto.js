"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateWorkoutScheduleDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_schedule_dto_1 = require("./create-schedule.dto");
class UpdateWorkoutScheduleDto extends (0, swagger_1.PartialType)(create_schedule_dto_1.CreateWorkoutScheduleDto) {
}
exports.UpdateWorkoutScheduleDto = UpdateWorkoutScheduleDto;
//# sourceMappingURL=update-schedule.dto.js.map