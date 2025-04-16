import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UsePipes,
  NotFoundException,
  HttpCode,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto, createNoteSchema } from './dto/create-note.dto';
import { UpdateNoteDto, updateNoteSchema } from './dto/update-note.dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation/zod-validation.pipe';
import { DeleteResult } from 'typeorm';

@Controller()
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post('tasks/:taskId/notes')
  @UsePipes(new ZodValidationPipe(createNoteSchema))
  async create(@Body() createNoteDto: CreateNoteDto) {
    return this.notesService.create(createNoteDto);
  }

  @Get('tasks/:taskId/notes')
  async findAll(@Param('taskId') taskId: string) {
    return this.notesService.findAll(+taskId);
  }

  @Get('notes/:id')
  async findOne(@Param('id') id: string) {
    return this.notesService.findOne(+id);
  }

  @Put('notes/:id')
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateNoteSchema)) updateNoteDto: UpdateNoteDto,
  ) {
    return this.notesService.update(+id, updateNoteDto);
  }

  @Delete('notes/:id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    const deleteResult: DeleteResult = await this.notesService.remove(+id);
    if (deleteResult && deleteResult.affected === 0) {
      throw new NotFoundException('Note not Found');
    }
  }
}
