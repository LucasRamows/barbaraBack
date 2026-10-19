"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const prisma_module_1 = require("./prisma/prisma.module");
const storage_module_1 = require("./storage/storage.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const personals_module_1 = require("./personals/personals.module");
const students_module_1 = require("./students/students.module");
const exercises_module_1 = require("./exercises/exercises.module");
const workout_plans_module_1 = require("./workout-plans/workout-plans.module");
const workout_schedules_module_1 = require("./workout-schedules/workout-schedules.module");
const workout_sessions_module_1 = require("./workout-sessions/workout-sessions.module");
const workout_sets_module_1 = require("./workout-sets/workout-sets.module");
const load_progression_module_1 = require("./load-progression/load-progression.module");
const deloads_module_1 = require("./deloads/deloads.module");
const workout_history_module_1 = require("./workout-history/workout-history.module");
const body_measurements_module_1 = require("./body-measurements/body-measurements.module");
const progress_photos_module_1 = require("./progress-photos/progress-photos.module");
const gifts_module_1 = require("./gifts/gifts.module");
const reward_rules_module_1 = require("./reward-rules/reward-rules.module");
const reward_achievements_module_1 = require("./reward-achievements/reward-achievements.module");
const platform_settings_module_1 = require("./platform-settings/platform-settings.module");
const admin_module_1 = require("./admin/admin.module");
const health_module_1 = require("./health/health.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            throttler_1.ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
            prisma_module_1.PrismaModule,
            storage_module_1.StorageModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            personals_module_1.PersonalsModule,
            students_module_1.StudentsModule,
            exercises_module_1.ExercisesModule,
            workout_plans_module_1.WorkoutPlansModule,
            workout_schedules_module_1.WorkoutSchedulesModule,
            workout_sessions_module_1.WorkoutSessionsModule,
            workout_sets_module_1.WorkoutSetsModule,
            load_progression_module_1.LoadProgressionModule,
            deloads_module_1.DeloadsModule,
            workout_history_module_1.WorkoutHistoryModule,
            body_measurements_module_1.BodyMeasurementsModule,
            progress_photos_module_1.ProgressPhotosModule,
            gifts_module_1.GiftsModule,
            reward_rules_module_1.RewardRulesModule,
            reward_achievements_module_1.RewardAchievementsModule,
            platform_settings_module_1.PlatformSettingsModule,
            admin_module_1.AdminModule,
            health_module_1.HealthModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map