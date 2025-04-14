import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { TaskStatus } from 'src/common/enums/TaskStatus.enum';
import { GetTaskQuery } from './dto/get-task-query.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private tasksRepository: Repository<Task>,
  ) {}
  async create(createTaskDto: CreateTaskDto) {
    return this.tasksRepository.save(createTaskDto);
  }

  async findAll(query: GetTaskQuery) {
    const whereOptional = {};
    const { category, priority, status } = query;
    if (category) {
      Object.assign(whereOptional, { category: category });
    }
    if (priority) {
      Object.assign(whereOptional, { priority: priority });
    }
    if (status) {
      Object.assign(whereOptional, { status: status });
    }
    return this.tasksRepository.find({ where: whereOptional });
  }

  async findOne(id: number) {
    return this.tasksRepository.findOne({ where: { id: id } });
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    return this.tasksRepository.update({ id: id }, updateTaskDto);
  }

  async remove(id: number) {
    return this.tasksRepository.delete({ id: id });
  }

  async findAllByStatus(status: TaskStatus) {
    return this.tasksRepository.find({ where: { status: status } });
  }
}
