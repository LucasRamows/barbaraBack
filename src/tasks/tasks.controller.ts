import { Controller, Post, Get, Put, Delete, Body, Param, Query, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('private')
@UseGuards(AuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('tasks')
  async createTask(@Body() body: any, @Req() req: any) {
    return this.tasksService.createTask(body, req.user.id);
  }

  @Get('tasks')
  async getTasks(@Query('type') type: string, @Query('priority') priority: string, @Req() req: any) {
    return this.tasksService.getTasks(type, priority, req.user.id);
  }

  @Put('tasks/:id')
  async updateTask(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    return this.tasksService.updateTask(id, body, req.user.id);
  }

  @Delete('tasks/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTask(@Param('id') id: string, @Req() req: any) {
    return this.tasksService.deleteTask(id, req.user.id);
  }

  @Get('stats/summary') // Notice Express mapped tasks to 'tasks/:id' and 'stats/summary' separately
  async getStatsSummary(@Req() req: any) {
    return this.tasksService.getStatsSummary(req.user.id);
  }
}
