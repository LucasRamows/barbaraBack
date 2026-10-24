import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { StorageModule } from './storage/storage.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PersonalsModule } from './personals/personals.module';
import { StudentsModule } from './students/students.module';
import { ExercisesModule } from './exercises/exercises.module';
import { WorkoutPlansModule } from './workout-plans/workout-plans.module';
import { WorkoutSchedulesModule } from './workout-schedules/workout-schedules.module';
import { WorkoutSessionsModule } from './workout-sessions/workout-sessions.module';
import { WorkoutSetsModule } from './workout-sets/workout-sets.module';
import { LoadProgressionModule } from './load-progression/load-progression.module';
import { DeloadsModule } from './deloads/deloads.module';
import { WorkoutHistoryModule } from './workout-history/workout-history.module';
import { BodyMeasurementsModule } from './body-measurements/body-measurements.module';
import { ProgressPhotosModule } from './progress-photos/progress-photos.module';
import { GiftsModule } from './gifts/gifts.module';
import { RewardRulesModule } from './reward-rules/reward-rules.module';
import { RewardAchievementsModule } from './reward-achievements/reward-achievements.module';
import { PlatformSettingsModule } from './platform-settings/platform-settings.module';
import { AdminModule } from './admin/admin.module';
import { HealthModule } from './health/health.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    PrismaModule,
    StorageModule,
    AuthModule,
    UsersModule,
    PersonalsModule,
    StudentsModule,
    ExercisesModule,
    WorkoutPlansModule,
    WorkoutSchedulesModule,
    WorkoutSessionsModule,
    WorkoutSetsModule,
    LoadProgressionModule,
    DeloadsModule,
    WorkoutHistoryModule,
    BodyMeasurementsModule,
    ProgressPhotosModule,
    GiftsModule,
    RewardRulesModule,
    RewardAchievementsModule,
    PlatformSettingsModule,
    AdminModule,
    HealthModule,
    NotificationsModule,
  ],
})
export class AppModule {}
