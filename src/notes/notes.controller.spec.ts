import { Test, TestingModule } from '@nestjs/testing';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { ParamTaskIdDto } from './dto/param-taskid-dto';
import { CreateNoteDto } from './dto/create-note.dto';
import { ResponseNoteDto } from './dto/response-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { DeleteResult } from 'typeorm';
describe('NotesController', () => {
  let controller: NotesController;
  let service: NotesService;
  const mockNotesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotesController],
      providers: [{
        provide: NotesService,
        useValue: mockNotesService,
      }],
    }).compile();

    controller = module.get<NotesController>(NotesController);
    service = module.get<NotesService>(NotesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /tasks/:tasksId/notes', () => {
    it('should create a note for a valid task ID and valid body', async () => {
      const paramTaskId: ParamTaskIdDto = { taskId: 1 };
      const createNoteDto: CreateNoteDto = { content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sit amet eleifend tellus, a tincidunt arcu. Donec id pharetra eros. Sed in tellus in enim.' };
      const expectedNote: ResponseNoteDto = {
        content: createNoteDto.content,
        taskId: paramTaskId.taskId,
        created_at: new Date(),
        updated_at: new Date(),
        id: 1
      }
      mockNotesService.create.mockResolvedValueOnce(expectedNote);

      const result = await controller.create(paramTaskId, createNoteDto);
      expect(result).toEqual(expectedNote);

    });
  });

  describe('GET /tasks/:taskId/notes', () => {
    it('should return all notes for a valid task ID', async () => {
      const paramTaskId: ParamTaskIdDto = { taskId: 1 };
      const query = {};
      const arrNotes: ResponseNoteDto[] = [{
        id: 1,
        content: 'note for task 1',
        created_at: new Date(),
        updated_at: new Date(),
        taskId: 1,
      }, {
        id: 2,
        content: 'note for task 1',
        created_at: new Date(),
        updated_at: new Date(),
        taskId: 1,
      }];
      mockNotesService.findAll.mockResolvedValueOnce({ page: 1, total: arrNotes.length, notes: arrNotes });
      const result = await controller.findAll(paramTaskId, query);
      expect(result).toMatchObject({ page: 1, total: arrNotes.length, notes: arrNotes });
    });

  });

  describe('GET /notes/:id', () => {
    it('should return a note by ID', async () => {
      const paramId = { id: 1 };
      const note: ResponseNoteDto = {
        taskId: 1,
        id: 1,
        content: 'note for task 1',
        created_at: new Date(),
        updated_at: new Date()
      }
      mockNotesService.findOne.mockResolvedValueOnce(note);
      const result = await controller.findOne(paramId);
      expect(result.id).toBe(note.id);
    });
  });

  describe('PUT /notes/:id', () => {
    it('should update a note with valid data', async () => {
      const paramId = { id: 1 };
      const updateDto: UpdateNoteDto = {
        content: 'New content'
      }
      const note: ResponseNoteDto = {
        taskId: 1,
        id: 1,
        content: 'note for task 1',
        created_at: new Date(2025, 8, 3),
        updated_at: new Date(2025, 8, 3),
      }
      const updateDate = new Date();
      mockNotesService.update.mockResolvedValueOnce({
        ...note,
        content: updateDto.content,
        updated_at: updateDate
      });
      const result = await controller.update(paramId, updateDto);
      expect(result.id).toBe(note.id);
      expect(result.content).toBe(updateDto.content);
      expect(result.updated_at).toEqual(updateDate);
    });
  });

  describe('DELETE /notes/:id', () => {
    it('should delete a note by ID and return 204', async () => {
      const paramId = { id: 1 };
      const deleteResult: DeleteResult = {
        raw: [],
        affected: 1,
      };
      mockNotesService.remove.mockResolvedValueOnce(deleteResult);
      const result = await controller.remove(paramId);
      expect(result).toBeUndefined();
      expect(mockNotesService.remove).toHaveBeenCalledWith(paramId.id);
    });
  });

});
