"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkoutSchedulesModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../prisma/prisma.module");
const workout_schedules_controller_1 = require("./workout-schedules.controller");
const workout_schedules_service_1 = require("./workout-schedules.service");
let WorkoutSchedulesModule = class WorkoutSchedulesModule {
};
exports.WorkoutSchedulesModule = WorkoutSchedulesModule;
exports.WorkoutSchedulesModule = WorkoutSchedulesModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [workout_schedules_controller_1.WorkoutSchedulesController],
        providers: [workout_schedules_service_1.WorkoutSchedulesService],
    })
], WorkoutSchedulesModule);
//# sourceMappingURL=workout-schedules.module.js.map