import { Controller, Post, Get, Put, Delete, Body, Param, Query, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { NotesService } from './notes.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('private')
@UseGuards(AuthGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post('notes')
  async createNote(@Body() body: any, @Req() req: any) {
    return this.notesService.createNote(body, req.user.id);
  }

  @Get('notes')
  async getNotes(@Query('folder') folder: string, @Req() req: any) {
    return this.notesService.getNotes(folder, req.user.id);
  }

  @Put('notes/:id')
  async updateNote(@Param('id') id: string, @Body() body: any) {
    return this.notesService.updateNote(id, body);
  }

  @Delete('notes/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteNote(@Param('id') id: string) {
    return this.notesService.deleteNote(id);
  }
}
