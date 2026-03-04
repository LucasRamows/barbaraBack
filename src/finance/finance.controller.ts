import { Controller, Post, Get, Put, Delete, Body, Param, Query, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('private')
@UseGuards(AuthGuard)
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Post('transactions')
  async createTransaction(@Body() body: any, @Req() req: any) {
    return this.financeService.createTransaction(body, req.user.id);
  }

  @Get('transactions')
  async getTransactions(@Query('month') month: string, @Query('year') year: string, @Req() req: any) {
    return this.financeService.getTransactions(month, year, req.user.id);
  }

  @Get('summary')
  async getSummary(@Req() req: any) {
    return this.financeService.getSummary(req.user.id);
  }

  @Put('transactions/:id')
  async updateTransaction(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    return this.financeService.updateTransaction(id, body, req.user.id);
  }

  @Delete('transactions/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTransaction(@Param('id') id: string, @Req() req: any) {
    return this.financeService.deleteTransaction(id, req.user.id);
  }

  @Get('stats/categories')
  async getStatsCategories(@Req() req: any) {
    return this.financeService.getStatsCategories(req.user.id);
  }
}
