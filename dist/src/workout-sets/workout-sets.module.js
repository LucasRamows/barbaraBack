"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkoutSetsModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../prisma/prisma.module");
const workout_sets_controller_1 = require("./workout-sets.controller");
const workout_sets_service_1 = require("./workout-sets.service");
let WorkoutSetsModule = class WorkoutSetsModule {
};
exports.WorkoutSetsModule = WorkoutSetsModule;
exports.WorkoutSetsModule = WorkoutSetsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [workout_sets_controller_1.WorkoutSetsController],
        providers: [workout_sets_service_1.WorkoutSetsService],
    })
], WorkoutSetsModule);
//# sourceMappingURL=workout-sets.module.js.map