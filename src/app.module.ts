import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { FinanceModule } from './finance/finance.module';
import { HealthModule } from './health/health.module';
import { UserModule } from './user/user.module';
import { NotesModule } from './notes/notes.module';
import { SecurityModule } from './security/security.module';
import { TasksModule } from './tasks/tasks.module';
import { WorkoutModule } from './workout/workout.module';
import { PublicModule } from './public/public.module';

@Module({
  imports: [PrismaModule, FinanceModule, HealthModule, UserModule, NotesModule, SecurityModule, TasksModule, WorkoutModule, PublicModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
