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
  ],
})
export class AppModule {}
