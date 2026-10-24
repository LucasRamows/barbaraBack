import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsController } from './notifications.controller';
import { PushNotificationsService } from './push-notifications.service';

@Module({
  imports: [PrismaModule],
  controllers: [NotificationsController],
  providers: [PushNotificationsService],
  exports: [PushNotificationsService],
})
export class NotificationsModule {}
