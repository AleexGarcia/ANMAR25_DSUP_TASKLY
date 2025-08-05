import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Like, Repository } from 'typeorm';
import { TaskStatus } from '../common/enums/TaskStatus.enum';
import { GetTaskQuery } from './dto/get-task-query.dto';
import { NotesService } from '../notes/notes.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private tasksRepository: Repository<Task>,
    @Inject(forwardRef(() => NotesService)) private notesService: NotesService,
  ) { }
  async create(createTaskDto: CreateTaskDto) {
    return this.tasksRepository.save(createTaskDto);
  }

  async findAll(query: GetTaskQuery) {
    const { category, priority, status, title, order, limit, page } = query;
    const offset = (page - 1) * limit;
    const findOptions = { take: limit, skip: offset };
    if (order) {
      Object.assign(findOptions, {
        order: {
          created_at: order,
        },
      });
    }
    if (category || priority || status || title) {
      const whereOptional = {};
      if (category) {
        Object.assign(whereOptional, { category: category });
      }
      if (priority) {
        Object.assign(whereOptional, { priority: priority });
      }
      if (status) {
        Object.assign(whereOptional, { status: status });
      }
      if (title) {
        Object.assign(whereOptional, { title: Like(`%${title}%`) });
      }
      Object.assign(findOptions, { where: whereOptional });
    }

    const [tasks, count] = await this.tasksRepository.findAndCount(findOptions);

    return this.responseFindAll(count, tasks, page);
  }

  async findOne(id: number) {
    const findResult = await this.tasksRepository.findOne({
      where: { id: id },
    });

    if (!findResult) {
      throw new NotFoundException('Task not found');
    }
    return findResult;
  }
  async findOneAndIncludeNotes(id: number) {
    const findResult = await this.tasksRepository.findOne({
      where: { id: id },
      relations: ['notes'],
    });

    if (!findResult) {
      throw new NotFoundException('Task not found');
    }
    return findResult;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const updateResult = await this.tasksRepository.update(
      { id: id },
      updateTaskDto,
    );
    if (updateResult && updateResult.affected === 0) {
      throw new NotFoundException('Task not found');
    }
    return this.findOne(id);
  }

  async remove(id: number) {
    const findTask = await this.findOneAndIncludeNotes(id);
    if (findTask.notes.length > 0) {
      await this.notesService.removeNotesByTaskId(id);
    }
    const result = await this.tasksRepository.delete({ id: id });
    return result;
  }

  async findAllByStatus(status: TaskStatus) {
    return this.tasksRepository.find({ where: { status: status } });
  }

  private responseFindAll(count: number, data: Task[], page: number) {
    return {
      page: page,
      total: count,
      tasks: data,
    };
  }
}
