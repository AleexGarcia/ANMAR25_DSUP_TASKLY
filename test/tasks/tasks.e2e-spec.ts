import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../../src/app.module';
import { DataSource } from 'typeorm';
import { PaginationTaskResponse, TaskSchema, TaskSchemaWithRelation } from '../../src/tasks/dto/response-task.dto';
import { CreateTaskDto } from '../../src/tasks/dto/create-task.dto';
import { TaskCategory } from '../../src/common/enums/TaskCategory.enum';
import { TaskStatus } from '../../src/common/enums/TaskStatus.enum';
import { UpdateTaskDto } from '../../src/tasks/dto/update-task.dto';
import { TaskPriority } from '../../src/common/enums/TaskPriority.enum';
import { GetTaskQuery } from '../../src/tasks/dto/get-task-query.dto';

describe('Tasks E2E', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let taskId: number;

  const NON_EXISTENT_ID = 99999999;
  const INVALID_ID = -1;

  const createTaskPayload = (overrides?: Partial<CreateTaskDto>): CreateTaskDto => ({
    title: 'Default Task',
    category: TaskCategory.bug_fixing,
    description: 'Default description',
    ...overrides,
  });

  const updateTaskPayload = (overrides?: Partial<UpdateTaskDto>): UpdateTaskDto => ({
    title: 'Updated Title',
    description: 'Updated description',
    category: TaskCategory.bug_fixing,
    status: TaskStatus.todo,
    priority: TaskPriority.low,
    ...overrides,
  });

  const invalidQuery = {
    category: 'invalid-category',
    status: 'invalid-status',
    priority: 'invalid-priority',
    order: 'ascendent',
    limit: -1,
    page: -1,
  };

  const makeRequest = () => request(app.getHttpServer());

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dataSource = app.get(DataSource);

    const res = await makeRequest()
      .post('/tasks')
      .send(createTaskPayload({ title: 'Setup Task' }))
      .expect(201);

    taskId = res.body.id;
  });

  afterAll(async () => {
    await dataSource.dropDatabase();
    await dataSource.destroy();
    await app.close();
  });

  describe('/tasks (GET)', () => {
    it('should return all tasks without filters', () =>
      makeRequest()
        .get('/tasks')
        .expect(200)
        .expect(res => PaginationTaskResponse.parse(res.body)));

    it('should return tasks with valid query filters', () =>
      makeRequest()
        .get('/tasks')
        .query(<GetTaskQuery>{
          category: TaskCategory.bug_fixing,
          status: TaskStatus.done,
          priority: TaskPriority.critical,
          title: 'example',
          order: 'asc',
          limit: 10,
          page: 1,
        })
        .expect(200)
        .expect(res => PaginationTaskResponse.parse(res.body)));

    it('should return 400 with invalid query filters', () =>
      makeRequest()
        .get('/tasks')
        .query(invalidQuery)
        .expect(400));
  });

  describe('/tasks (POST)', () => {
    it('should create a task successfully', async () => {
      const res = await makeRequest()
        .post('/tasks')
        .send(createTaskPayload({ title: 'New Task' }))
        .expect(201);

      TaskSchema.parse(res.body);
      expect(res.body).toMatchObject({
        title: 'New Task',
        category: TaskCategory.bug_fixing,
      });
    });

    it('should return 400 when payload is invalid', () =>
      makeRequest()
        .post('/tasks')
        .send({ category: 'invalid', description: 'desc' })
        .expect(400));
  });

  describe('/tasks/status/:status (GET)', () => {
    it('should return tasks filtered by status', async () => {
      const res = await makeRequest()
        .get(`/tasks/status/${TaskStatus.todo}`)
        .expect(200);

      if (res.body.length) {
        TaskSchema.parse(res.body[0]);
      }
    });
  });

  describe('/tasks/:id (GET)', () => {
    it('should return a task by valid ID', async () => {
      const res = await makeRequest()
        .get(`/tasks/${taskId}`)
        .expect(200);

      TaskSchemaWithRelation.parse(res.body);
    });

    it('should return 404 for non-existent task', () =>
      makeRequest().get(`/tasks/${NON_EXISTENT_ID}`).expect(404));

    it('should return 400 for invalid ID', () =>
      makeRequest().get(`/tasks/${INVALID_ID}`).expect(400));
  });

  describe('/tasks/:id (PUT)', () => {
    it('should update task successfully', async () => {
      const res = await makeRequest()
        .put(`/tasks/${taskId}`)
        .send(updateTaskPayload())
        .expect(200);

      TaskSchema.parse(res.body);
      expect(res.body).toMatchObject(updateTaskPayload());
    });

    it('should return 404 for non-existent task', () =>
      makeRequest().put(`/tasks/${NON_EXISTENT_ID}`).send(updateTaskPayload()).expect(404));

    it('should return 400 for invalid payload', () =>
      makeRequest()
        .put(`/tasks/${taskId}`)
        .send(updateTaskPayload({ category: 'invalid' as any }))
        .expect(400));
  });

  describe('/tasks/:id (DELETE)', () => {
    it('should delete task successfully', () =>
      makeRequest().delete(`/tasks/${taskId}`).expect(204));

    it('should return 404 for non-existent task', () =>
      makeRequest().delete(`/tasks/${NON_EXISTENT_ID}`).expect(404));

    it('should return 400 for invalid ID', () =>
      makeRequest().delete(`/tasks/${INVALID_ID}`).expect(400));
  });
});
