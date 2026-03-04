import { Controller, Get, Put, Body, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('private')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async getMe(@Req() req: any) {
    return this.userService.getMe(req.user.id);
  }

  @Put('update')
  async updateUser(@Body() body: any, @Req() req: any) {
    return this.userService.updateUser(body, req.user.id);
  }
}
