import { Controller, Post, Get, Put, Delete, Body, Param, Query, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { WorkoutService } from './workout.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('private')
@UseGuards(AuthGuard)
export class WorkoutController {
  constructor(private readonly workoutService: WorkoutService) {}

  @Post('plans')
  async createPlan(@Body() body: any, @Req() req: any) {
    return this.workoutService.createPlan(body, req.user.id);
  }

  @Get('plans')
  async getPlans(@Req() req: any) {
    return this.workoutService.getPlans(req.user.id);
  }

  @Put('plans/:id')
  async updatePlan(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    return this.workoutService.updatePlan(id, body, req.user.id);
  }

  @Delete('plans/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePlan(@Param('id') id: string, @Req() req: any) {
    return this.workoutService.deletePlan(id, req.user.id);
  }

  @Post('plans/:planId/days')
  async addDayToPlan(@Param('planId') planId: string, @Body() body: any, @Req() req: any) {
    return this.workoutService.addDayToPlan(planId, body, req.user.id);
  }

  @Post('days/:dayId/exercises')
  async addExerciseToDay(@Param('dayId') dayId: string, @Body() body: any) {
    return this.workoutService.addExerciseToDay(dayId, body);
  }

  @Put('exercises-on-day/:id')
  async updateExerciseOnDay(@Param('id') id: string, @Body() body: any) {
    return this.workoutService.updateExerciseOnDay(id, body);
  }

  @Get('users/by-phone/:phone/exercises/today')
  async getExercisesToday(@Param('phone') phone: string) {
    return this.workoutService.getExercisesToday(phone);
  }

  @Post('exercises')
  async createExercise(@Body() body: any) {
    return this.workoutService.createExercise(body);
  }

  @Get('exercises')
  async getExercises(@Query('search') search: string) {
    return this.workoutService.getExercises(search);
  }

  @Delete('exercises-on-day/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteExerciseOnDay(@Param('id') id: string) {
    return this.workoutService.deleteExerciseOnDay(id);
  }
}
