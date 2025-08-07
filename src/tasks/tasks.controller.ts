import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UsePipes,
  HttpCode,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, createTaskSchema } from './dto/create-task.dto';
import { UpdateTaskDto, updateTaskSchema } from './dto/update-task.dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation/zod-validation.pipe';
import { GetTaskQuery, getTaskQuerySchema } from './dto/get-task-query.dto';
import {
  getTaskByStatusDto,
  getTaskByStatusSchema,
} from './dto/get-task-by-status.dto';
import { paramIdSchema, ParamIdDto } from './dto/param-id.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createTaskSchema))
  async create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  @UsePipes(new ZodValidationPipe(getTaskQuerySchema))
  async findAll(@Query() query: GetTaskQuery) {
    return this.tasksService.findAll(query);
  }

  @Get('/status/:status')
  async findAllByStatus(
    @Param(new ZodValidationPipe(getTaskByStatusSchema))
    { status }: getTaskByStatusDto,
  ) {
    return this.tasksService.findAllByStatus(status);
  }

  @Get(':id')
  async findOne(
    @Param(new ZodValidationPipe(paramIdSchema)) { id }: ParamIdDto,
  ) {
    return this.tasksService.findOneAndIncludeNotes(id);
  }

  @Put(':id')
  async update(
    @Param(new ZodValidationPipe(paramIdSchema)) { id }: ParamIdDto,
    @Body(new ZodValidationPipe(updateTaskSchema)) updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(
    @Param(new ZodValidationPipe(paramIdSchema)) { id }: ParamIdDto,
  ) {
    await this.tasksService.remove(id);
  }
}
