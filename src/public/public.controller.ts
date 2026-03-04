import { Controller, Post, Body } from '@nestjs/common';
import { PublicService } from './public.service';

@Controller('public')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Post('register')
  async register(@Body() body: any) {
    return this.publicService.register(body);
  }

  @Post('login')
  async login(@Body() body: any) {
    return this.publicService.login(body);
  }
}
