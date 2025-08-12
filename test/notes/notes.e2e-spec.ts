import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../../src/app.module';
import { DataSource } from 'typeorm';
import { CreateTaskDto } from '../../src/tasks/dto/create-task.dto';
import { TaskCategory } from '../../src/common/enums/TaskCategory.enum';
import { CreateNoteDto } from '../../src/notes/dto/create-note.dto';
import { UpdateNoteDto } from '../../src/notes/dto/update-note.dto';
import { GetNotesQueryDto } from '../../src/notes/dto/get-notes-param.dto';
import { NoteSchema, PaginationNoteResponse } from '../../src/notes/dto/response-note.dto';

describe('Notes E2E', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let taskId: number;
  let noteId: number;

  const NON_EXISTENT_ID = 99999999;
  const INVALID_ID = -1;

  const createTaskPayload = (overrides?: Partial<CreateTaskDto>): CreateTaskDto => ({
    title: 'Default Task',
    category: TaskCategory.bug_fixing,
    description: 'Default description',
    ...overrides,
  });

  const createNotePayload = (overrides?: Partial<CreateNoteDto>): CreateNoteDto => ({
    content: 'Default Content',
    ...overrides
  })
  const updateNotePayload = (overrides?: Partial<UpdateNoteDto>): UpdateNoteDto => ({
    content: 'Update Content',
    ...overrides
  })


  const makeRequest = () => request(app.getHttpServer());

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dataSource = app.get(DataSource);

    const resCreateTask = await makeRequest()
      .post('/tasks')
      .send(createTaskPayload({ title: 'Setup Task' }))
      .expect(201);

    taskId = resCreateTask.body.id;

    const resCreateNotes = await makeRequest()
      .post(`/tasks/${taskId}/notes`)
      .send(createNotePayload({ content: 'new note to setup task' }));

    noteId = resCreateNotes.body.id;

  });

  afterAll(async () => {
    await dataSource.dropDatabase();
    await dataSource.destroy();
    await app.close();
  });

  describe('/tasks/:taskId/notes (GET)', () => {
    it('should return all notes without filters', async () => {
      const res = await makeRequest()
        .get(`/tasks/${taskId}/notes`)
        .expect(200)
      expect(PaginationNoteResponse.parse(res.body)).not.toThrow();
    })

    it('should return notes with valid query filters', async () =>{
      const res = await makeRequest()
      .get(`/tasks/${taskId}/notes`)
      .query(<GetNotesQueryDto>{
        limit: 10,
        page: 1,
      })
      .expect(200)
      
      expect(PaginationNoteResponse.parse(res.body)).not.toThrow();
      
    })


    it('should return 400 with invalid query filters', async () =>
      makeRequest()
        .get(`/tasks/${taskId}/notes`)
        .query(<GetNotesQueryDto>{
          limit: -1,
          page: -1,
        })
        .expect(400));
  });

  describe('/tasks/:taskId/notes (POST)', () => {
    it('should create a task successfully', async () => {
      const res = await makeRequest()
        .post(`/tasks/${taskId}/notes`)
        .send(createNotePayload({ content: 'New content Task' }))
        .expect(201);

      expect(NoteSchema.parse(res.body)).not.toThrow();
    });

    it('should return 400 when payload is invalid', () =>
      makeRequest()
        .post(`/tasks/${taskId}/notes`)
        .send({ content: undefined })
        .expect(400));
  });


  describe('/notes/:id (GET)', () => {
    it('should return a note by valid ID', async () => {
      const res = await makeRequest()
        .get(`/notes/${noteId}`)
        .expect(200);

      expect(NoteSchema.parse(res.body)).not.toThrow();
    });

    it('should return 404 for non-existent note', () =>
      makeRequest().get(`/notes/${NON_EXISTENT_ID}`).expect(404));

    it('should return 400 for invalid ID', () =>
      makeRequest().get(`/notes/${INVALID_ID}`).expect(400));
  });

  describe('/notes/:id (PUT)', () => {
    it('should update note successfully', async () => {
      const res = await makeRequest()
        .put(`/notes/${noteId}`)
        .send(updateNotePayload())
        .expect(200);

      expect(NoteSchema.parse(res.body)).not.toThrow();
      expect(res.body).toMatchObject(updateNotePayload());
    });

    it('should return 404 for non-existent task', () =>
      makeRequest().put(`/notes/${NON_EXISTENT_ID}`).send(updateNotePayload()).expect(404));

    it('should return 400 for invalid payload', () =>
      makeRequest()
        .put(`/notes/${noteId}`)
        .send(updateNotePayload({ content: undefined }))
        .expect(400));
  });

  describe('/notes/:id (DELETE)', () => {
    it('should delete note successfully', () =>
      makeRequest().delete(`/notes/${noteId}`).expect(204));

    it('should return 404 for non-existent task', () =>
      makeRequest().delete(`/notes/${NON_EXISTENT_ID}`).expect(404));

    it('should return 400 for invalid ID', () =>
      makeRequest().delete(`/notes/${INVALID_ID}`).expect(400));
  });
});
