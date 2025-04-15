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
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, createTaskSchema } from './dto/create-task.dto';
import { UpdateTaskDto, updateTaskSchema } from './dto/update-task.dto';
import { TaskStatus } from 'src/common/enums/TaskStatus.enum';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation/zod-validation.pipe';
import { GetTaskQuery, getTaskQuerySchema } from './dto/get-task-query.dto';

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

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const task = await this.tasksService.findOne(+id);
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  @Get('/status/:status')
  async findAllByStatus(@Param('status') status: TaskStatus) {
    return this.tasksService.findAllByStatus(status);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateTaskSchema)) updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    const deletedTask = await this.tasksService.remove(+id);
    if (deletedTask && deletedTask.affected === 0) {
      throw new NotFoundException('Task not found');
    }
  }
}
