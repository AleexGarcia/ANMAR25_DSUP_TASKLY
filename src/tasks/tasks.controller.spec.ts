import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskCategory } from '../common/enums/TaskCategory.enum';
import { Task } from './entities/task.entity';
import { TaskStatus } from '../common/enums/TaskStatus.enum';
import { TaskPriority } from '../common/enums/TaskPriority.enum';
import { GetTaskQuery } from './dto/get-task-query.dto';
import { getTaskByStatusDto } from './dto/get-task-by-status.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Repository } from 'typeorm';
import { NotesService } from '../notes/notes.service';
const mockTasks: Task[] = [
  {
    id: 1,
    title: 'Fix login bug',
    description: 'Resolve issue where users cannot login',
    status: TaskStatus.todo,
    priority: TaskPriority.high,
    category: TaskCategory.bug_fixing,
    notes: [],
    created_at: new Date('2025-08-01T10:00:00Z'),
    updated_at: new Date('2025-08-01T10:00:00Z'),
  },
  {
    id: 2,
    title: 'Add search feature',
    description: 'Implement search on tasks list',
    status: TaskStatus.in_progress,
    priority: TaskPriority.medium,
    category: TaskCategory.feature,
    notes: [],
    created_at: new Date('2025-08-02T09:30:00Z'),
    updated_at: new Date('2025-08-03T11:15:00Z'),
  },
  {
    id: 3,
    title: 'Update dependencies',
    description: 'Update outdated npm packages',
    status: TaskStatus.done,
    priority: TaskPriority.low,
    category: TaskCategory.configuration_management,
    notes: [],
    created_at: new Date('2025-07-30T14:20:00Z'),
    updated_at: new Date('2025-08-01T08:45:00Z'),
  },
];
describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;
  const mockTasksService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findAllByStatus: jest.fn(),
    findOneAndIncludeNotes: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [{
        provide: TasksService,
        useValue: mockTasksService,
      }],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('POST /tasks', () => {

    it('should successfully create a new task', async () => {
      const createTaskDto: CreateTaskDto = {
        category: TaskCategory.bug_fixing,
        title: 'title',
        description: 'description'
      };
      const mockTask = {
        id: 1,
        title: 'Fix login bug',
        description: 'Fix the issue with login redirect',
        status: TaskStatus.todo,
        priority: TaskPriority.high,
        category: TaskCategory.bug_fixing,
        created_at: new Date('2025-08-01T10:00:00Z'),
        updated_at: new Date('2025-08-02T12:00:00Z'),
        notes: [],
      };
      mockTasksService.create.mockResolvedValueOnce(mockTask);
      const result = await controller.create(createTaskDto);
      expect(result).toEqual(mockTask);
    });
  });


  describe('GET /tasks/status/:status', () => {
    it('should successfully return all tasks by status', async () => {
      const param: getTaskByStatusDto = {
        status: TaskStatus.todo
      };
      const expectResult = mockTasks.filter(task => task.status === param.status);
      mockTasksService.findAllByStatus.mockResolvedValueOnce(expectResult);
      const result = await controller.findAllByStatus(param);
      expect(result).toEqual(expectResult);
    });
  });

  describe('GET /tasks/:id', () => {
    it('should successfully return a task with its notes by ID', async () => {
      const paramId = { id: 1 };
      mockTasksService.findOneAndIncludeNotes.mockResolvedValueOnce(mockTasks[0]);
      const result = await controller.findOne(paramId);
      expect(result).toEqual(mockTasks[0]);
    });
  });

  describe('PUT /tasks/:id', () => {
    it('should successfully update a task by ID', async () => {
      const paramId = { id: 1 };
      const updateTaskDto: UpdateTaskDto = {
        category: TaskCategory.bug_fixing,
        status: TaskStatus.todo,
        priority: TaskPriority.low,
        title: 'title',
        description: 'description'
      }
      const updatedTask: Task = {
        ...mockTasks[0],
        category: updateTaskDto.category,
        status: updateTaskDto.status,
        priority: updateTaskDto.priority,
        title: updateTaskDto.title,
        description: updateTaskDto.description,
        updated_at: new Date(),
      }
      mockTasksService.update.mockResolvedValueOnce(updatedTask);
      const result = await controller.update(paramId, updateTaskDto);
      expect(result).toEqual(updatedTask);
      expect(result.id).toEqual(updatedTask.id);

    });
  });

  describe('DELETE /tasks/:id', () => {
    it('should successfully delete a task by ID', async () => {
      const paramId = { id: 1 };
      await expect(controller.remove(paramId)).resolves.toBeUndefined();
    });
  });
});


describe('TaskController tests with real service', () => {
  let controller: TasksController;

  beforeEach(() => {
    const mockRepository = { findAndCount: jest.fn() } as unknown as Repository<Task>;
    const notesServices = {} as NotesService;
    const realService = new TasksService(mockRepository, notesServices);

    controller = new TasksController(realService);
  });

  describe('GET /tasks', () => {
    it('should successfully return all tasks based on query', async () => {
      const query: GetTaskQuery = {};

      const spy = jest.spyOn(controller['tasksService'], 'findAll');
      spy.mockResolvedValueOnce({ page: 1, tasks: mockTasks, total: mockTasks.length });

      const result = await controller.findAll(query);

      expect(result).toEqual({ page: 1, tasks: mockTasks, total: mockTasks.length });
      expect(spy).toHaveBeenCalledWith(query);
    });
  });
});