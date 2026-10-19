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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateWorkoutScheduleDto = void 0;
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
const swagger_1 = require("@nestjs/swagger");
class CreateWorkoutScheduleDto {
    studentId;
    workoutPlanId;
    dayOfWeek;
    validFrom;
    validUntil;
}
exports.CreateWorkoutScheduleDto = CreateWorkoutScheduleDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateWorkoutScheduleDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateWorkoutScheduleDto.prototype, "workoutPlanId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.DayOfWeek }),
    (0, class_validator_1.IsEnum)(client_1.DayOfWeek),
    __metadata("design:type", String)
], CreateWorkoutScheduleDto.prototype, "dayOfWeek", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateWorkoutScheduleDto.prototype, "validFrom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateWorkoutScheduleDto.prototype, "validUntil", void 0);
//# sourceMappingURL=create-schedule.dto.js.map