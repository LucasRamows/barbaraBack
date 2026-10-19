"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkoutSessionsModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../prisma/prisma.module");
const load_progression_module_1 = require("../load-progression/load-progression.module");
const workout_sessions_controller_1 = require("./workout-sessions.controller");
const workout_sessions_service_1 = require("./workout-sessions.service");
let WorkoutSessionsModule = class WorkoutSessionsModule {
};
exports.WorkoutSessionsModule = WorkoutSessionsModule;
exports.WorkoutSessionsModule = WorkoutSessionsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, load_progression_module_1.LoadProgressionModule],
        controllers: [workout_sessions_controller_1.WorkoutSessionsController],
        providers: [workout_sessions_service_1.WorkoutSessionsService],
        exports: [workout_sessions_service_1.WorkoutSessionsService],
    })
], WorkoutSessionsModule);
//# sourceMappingURL=workout-sessions.module.js.map