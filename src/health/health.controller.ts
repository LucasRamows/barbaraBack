import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { HealthService } from './health.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('private')
@UseGuards(AuthGuard)
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Post('health')
  async createHealth(@Body() body: any, @Req() req: any) {
    return this.healthService.createHealth(body, req.user.id);
  }

  @Get('health')
  async getHealths(@Req() req: any) {
    return this.healthService.getHealths(req.user.id);
  }

  @Put('health/:id')
  async updateHealth(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    return this.healthService.updateHealth(id, body, req.user.id);
  }

  @Delete('health/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteHealth(@Param('id') id: string, @Req() req: any) {
    return this.healthService.deleteHealth(id, req.user.id);
  }
}
