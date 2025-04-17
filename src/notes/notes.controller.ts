import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto, createNoteSchema } from './dto/create-note.dto';
import { UpdateNoteDto, updateNoteSchema } from './dto/update-note.dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation/zod-validation.pipe';
import { ParamTaskIdDto, paramTaskIdSchema } from './dto/param-taskid-dto';
import { ParamIdDto, paramIdSchema } from './dto/param-id.dto';

@Controller()
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post('tasks/:taskId/notes')
  async create(
    @Param(new ZodValidationPipe(paramTaskIdSchema)) { taskId }: ParamTaskIdDto,
    @Body(new ZodValidationPipe(createNoteSchema))
    createNoteDto: CreateNoteDto,
  ) {
    return this.notesService.create(taskId, createNoteDto);
  }

  @Get('tasks/:taskId/notes')
  async findAll(
    @Param(new ZodValidationPipe(paramTaskIdSchema)) { taskId }: ParamTaskIdDto,
  ) {
    return this.notesService.findAll(taskId);
  }

  @Get('notes/:id')
  async findOne(
    @Param(new ZodValidationPipe(paramIdSchema)) { id }: ParamIdDto,
  ) {
    return this.notesService.findOne(id);
  }

  @Put('notes/:id')
  async update(
    @Param(new ZodValidationPipe(paramIdSchema)) { id }: ParamIdDto,
    @Body(new ZodValidationPipe(updateNoteSchema)) updateNoteDto: UpdateNoteDto,
  ) {
    return this.notesService.update(id, updateNoteDto);
  }

  @Delete('notes/:id')
  @HttpCode(204)
  async remove(
    @Param(new ZodValidationPipe(paramIdSchema)) { id }: ParamIdDto,
  ) {
    return this.notesService.remove(id);
  }
}
