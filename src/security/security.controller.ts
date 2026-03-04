import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { SecurityService } from './security.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('private')
@UseGuards(AuthGuard)
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}

  @Post('credentials')
  async createCredential(@Body() body: any, @Req() req: any) {
    return this.securityService.createCredential(body, req.user.id);
  }

  @Put('publickey')
  async updatePublicKey(@Body() body: any, @Req() req: any) {
    return this.securityService.updatePublicKey(body.key, req.user.id);
  }

  @Get('publickey')
  async getPublicKey(@Req() req: any) {
    return this.securityService.getPublicKey(req.user.id);
  }

  @Get('credentials')
  async getCredentials(@Req() req: any) {
    return this.securityService.getCredentials(req.user.id);
  }

  @Put('credentials/:id')
  async updateCredential(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    return this.securityService.updateCredential(id, body, req.user.id);
  }

  @Delete('credentials/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCredential(@Param('id') id: string, @Req() req: any) {
    return this.securityService.deleteCredential(id, req.user.id);
  }

  @Get('security/stats') // Need distinct path to avoid 'stats' conflict from other modules 'private/stats'
  async getStats(@Req() req: any) {
    return this.securityService.getStats(req.user.id);
  }
}
