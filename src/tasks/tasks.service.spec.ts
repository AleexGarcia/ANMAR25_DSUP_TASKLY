import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { DeleteResult, Like, Repository, UpdateResult } from 'typeorm';
import { NotesService } from '../notes/notes.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskCategory } from '../common/enums/TaskCategory.enum';
import { GetTaskQuery } from './dto/get-task-query.dto';
import { TaskPriority } from '../common/enums/TaskPriority.enum';
import { TaskStatus } from '../common/enums/TaskStatus.enum';
import { NotFoundException } from '@nestjs/common';
import { Note } from '../notes/entities/note.entity';
import { UpdateTaskDto } from './dto/update-task.dto';

describe('TasksService', () => {
  let service: TasksService;
  let taskRepository: Repository<Task>;
  let notesServices: NotesService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: {
            save: jest.fn(),
            findAndCount: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            find: jest.fn()
          },
        },
        {
          provide: NotesService,
          useValue: {
            removeNotesByTaskId: jest.fn(),
          }
        }
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    notesServices = module.get<NotesService>(NotesService);
    taskRepository = module.get<Repository<Task>>(getRepositoryToken(Task));

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('create', () => {
    it('should be create a new Task', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'new task',
        description: 'description',
        category: TaskCategory.bug_fixing,
      };
      const newTask = new Task(createTaskDto.title, createTaskDto.description, createTaskDto.category);
      const spyOn = jest.spyOn(taskRepository, 'save');
      spyOn.mockResolvedValueOnce(newTask);
      const result = await service.create(createTaskDto);
      expect(spyOn).toHaveBeenCalledWith(newTask);
      expect(result).toEqual(newTask);
    })
    it('should throw an error if save fails', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'new task',
        description: 'description',
        category: TaskCategory.bug_fixing,
      };
      const newTask = new Task(createTaskDto.title, createTaskDto.description, createTaskDto.category);
      const spyOn = jest.spyOn(taskRepository, 'save');
      spyOn.mockRejectedValueOnce(new Error);
      await expect(service.create(createTaskDto)).rejects.toThrow();
      expect(spyOn).toHaveBeenCalledWith(newTask);
    })
  })

  describe('findAll', () => {
    it('should return paginated tasks without filters', async () => {
      const query: GetTaskQuery = {};
      const tasksList: Task[] = [];
      const spyOn = jest.spyOn(taskRepository, 'findAndCount');
      spyOn.mockResolvedValueOnce([tasksList, tasksList.length]);
      const result = await service.findAll(query);
      expect(spyOn).toHaveBeenCalledWith({ take: 5, skip: 0 })
      expect(result).toEqual({ page: 1, total: tasksList.length, tasks: tasksList });

    });

    it('should return tasks filtered by category, priority, status, title, ordered and paginated', async () => {
      const query = {
        category: TaskCategory.bug_fixing,
        priority: TaskPriority.high,
        status: TaskStatus.in_progress,
        title: 'fix',
        order: 'asc',
        limit: 10,
        page: 2,
      };
      const offset = (query.page - 1) * query.limit;
      const tasksList: Task[] = [];
      const spyOn = jest.spyOn(taskRepository, 'findAndCount');
      spyOn.mockResolvedValueOnce([tasksList, tasksList.length]);
      const result = await service.findAll(query as GetTaskQuery);
      expect(spyOn).toHaveBeenCalledWith(
        {
          take: query.limit,
          skip: offset,
          order: {
            created_at: query.order
          },
          where: {
            category: query.category,
            priority: query.priority,
            status: query.status,
            title: Like(`%${query.title}%`)
          }
        }
      )
      expect(result).toEqual({ page: query.page, total: tasksList.length, tasks: tasksList });
    })
  })

  describe('findOne', () => {
    it('should return the task when found', async () => {
      const id = 1;
      const task = new Task('title', 'description', TaskCategory.bug_fixing);
      task.id = 1;
      const spyOn = jest.spyOn(taskRepository, 'findOne');
      spyOn.mockResolvedValueOnce(task);
      const result = await service.findOne(id);
      expect(result).toEqual(task);
      expect(spyOn).toHaveBeenCalledWith({ where: { id: id } });
    });

    it('should throw NotFoundException when task does not exist', async () => {
      const id = -1;
      const spyOn = jest.spyOn(taskRepository, 'findOne');
      spyOn.mockResolvedValueOnce(null);
      expect(service.findOne(id)).rejects.toThrow(NotFoundException);
      expect(spyOn).toHaveBeenCalledWith({ where: { id: id } });
    });
  })

  describe('findOneAndIncludeNotes', () => {

    it('should return the task with notes when found', async () => {
      const id = 1;
      const task = new Task('title', 'description', TaskCategory.bug_fixing);
      task.id = 1;
      task.notes = [new Note(task, 'note 1')];
      const spyOn = jest.spyOn(taskRepository, 'findOne');
      spyOn.mockResolvedValueOnce(task);
      const result = await service.findOneAndIncludeNotes(id);
      expect(spyOn).toHaveBeenCalledWith({ where: { id: id }, relations: ['notes'] });
      expect(result).toEqual(task);
    });

    it('should throw NotFoundException when task does not exist', async () => {
      const id = -1;
      const spyOn = jest.spyOn(taskRepository, 'findOne');
      spyOn.mockResolvedValueOnce(null);
      await expect(service.findOneAndIncludeNotes(id)).rejects.toThrow(NotFoundException);
      expect(spyOn).toHaveBeenCalledWith({ where: { id: id }, relations: ['notes'] });
    });
  })

  describe('update', () => {

    it('should update and return the updated task', async () => {
      const id = 1;
      const updateTaskDto: UpdateTaskDto = {
        title: 'new title',
        description: 'new description',
        category: TaskCategory.bug_fixing,
        status: TaskStatus.todo,
        priority: TaskPriority.low
      }
      const task = new Task('title', 'description', TaskCategory.bug_fixing);
      task.id = 1;
      Object.assign(task, updateTaskDto);
      task.updated_at = new Date();

      const updateSpyOn = jest.spyOn(taskRepository, 'update');
      updateSpyOn.mockResolvedValueOnce({ affected: 1 } as UpdateResult);
      const findSpyOn = jest.spyOn(taskRepository, 'findOne').mockResolvedValueOnce(task);


      const result = await service.update(id, updateTaskDto);
      expect(result).toEqual(task);
      expect(updateSpyOn).toHaveBeenCalledWith({ id: id }, updateTaskDto);
    });

    it('should throw NotFoundException when task does not exist', async () => {
      const id = -1;
      const updateTaskDto: UpdateTaskDto = {
        title: 'new title',
        description: 'new description',
        category: TaskCategory.bug_fixing,
        status: TaskStatus.todo,
        priority: TaskPriority.low
      }

      const updateSpyOn = jest.spyOn(taskRepository, 'update');
      updateSpyOn.mockResolvedValueOnce({ affected: 0 } as UpdateResult);

      await expect(service.update(id, updateTaskDto)).rejects.toThrow(NotFoundException);

      expect(updateSpyOn).toHaveBeenCalledWith({ id: id }, updateTaskDto);
    });
  })

  describe('remove', () => {

    it('should remove a task without notes', async () => {
      const id = 1;
      const task = new Task('title', 'description', TaskCategory.bug_fixing);
      task.id = 1;

      const findOneSpy = jest.spyOn(taskRepository, 'findOne');
      const deleteSpy = jest.spyOn(taskRepository, 'delete');
      findOneSpy.mockResolvedValueOnce(task);
      deleteSpy.mockResolvedValueOnce({ affected: 1 } as DeleteResult);

      const result = await service.remove(id);
      expect(result).toEqual({ affected: 1 });
      expect(deleteSpy).toHaveBeenCalledWith({ id: id });
      expect(deleteSpy).toHaveBeenCalledTimes(1);

    });

    it('should remove a task and its notes if present', async () => {
      const id = 1;
      const task = new Task('title', 'description', TaskCategory.bug_fixing);
      task.id = 1;
      task.notes = [new Note(task, 'content')];
      const findOneSpy = jest.spyOn(taskRepository, 'findOne');
      const deleteSpy = jest.spyOn(taskRepository, 'delete');
      const removeNotesSpy = jest.spyOn(notesServices, 'removeNotesByTaskId');
      removeNotesSpy.mockResolvedValueOnce({ affected: task.notes.length } as DeleteResult)
      findOneSpy.mockResolvedValueOnce(task);
      deleteSpy.mockResolvedValueOnce({ affected: 1 } as DeleteResult);
      const result = await service.remove(id);
      expect(result).toEqual({ affected: 1 });
      expect(deleteSpy).toHaveBeenCalledWith({ id: id });
      expect(deleteSpy).toHaveBeenCalledTimes(1);
      expect(removeNotesSpy).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when task does not exist', async () => {
      const id = 1;
      const task = new Task('title', 'description', TaskCategory.bug_fixing);
      task.id = 1;
      const findOneSpy = jest.spyOn(taskRepository, 'findOne');
      findOneSpy.mockRejectedValueOnce(new NotFoundException);
      await expect(service.remove(id)).rejects.toThrow(NotFoundException);

    });
  })

  describe('findAllByStatus', () => {
    it('should return all tasks matching the given status', async () => {
      const status: TaskStatus = TaskStatus.in_progress;
      const tasksList: Task[] = []
      const spy = jest.spyOn(taskRepository, 'find');
      spy.mockResolvedValueOnce(tasksList);
      const result = await service.findAllByStatus(status);
      expect(result).toEqual(tasksList);
      expect(spy).toHaveBeenCalledWith({ where: { status: status } });

    });
  })

});
