import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { CurrentUserPayload } from '../auth/current-user.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { PushSubscriptionDto } from './dto/push-subscription.dto';
import { PushNotificationsService } from './push-notifications.service';

@ApiTags('notifications')
@ApiBearerAuth()
@Controller('notifications/push')
export class NotificationsController {
  constructor(private readonly push: PushNotificationsService) {}

  @Get('public-key')
  @ApiOperation({ summary: 'Chave pública VAPID do Web Push' })
  publicKey() { return { publicKey: this.push.publicKey }; }

  @Post('subscriptions')
  @HttpCode(HttpStatus.NO_CONTENT)
  register(@CurrentUser() user: CurrentUserPayload, @Body() dto: PushSubscriptionDto) {
    return this.push.register(user.sub, dto);
  }

  @Delete('subscriptions')
  @HttpCode(HttpStatus.NO_CONTENT)
  unregister(@CurrentUser() user: CurrentUserPayload, @Body('endpoint') endpoint: string) {
    return this.push.unregister(user.sub, endpoint);
  }
}
