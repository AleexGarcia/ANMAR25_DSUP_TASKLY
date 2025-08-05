import { Test, TestingModule } from '@nestjs/testing';
import { NotesService } from './notes.service';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Note } from './entities/note.entity';
import { Task } from '../tasks/entities/task.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateNoteDto } from './dto/create-note.dto';
import { TaskStatus } from '../common/enums/TaskStatus.enum';
import { TaskPriority } from '../common/enums/TaskPriority.enum';
import { TaskCategory } from '../common/enums/TaskCategory.enum';
import { NotFoundException } from '@nestjs/common';
import { TasksService } from '../tasks/tasks.service';
import { ResponseNoteDto } from './dto/response-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

describe('NotesService', () => {
  let service: NotesService;
  let noteRepository: Repository<Note>;
  let taskServices: jest.Mocked<TasksService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotesService,
        {
          provide: getRepositoryToken(Note),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
          }
        },
        {
          provide: TasksService,
          useValue: {
            findOne: jest.fn(),
            save: jest.fn()
          }
        }
      ],
    }).compile();

    service = module.get<NotesService>(NotesService);
    noteRepository = module.get<Repository<Note>>(getRepositoryToken(Note));
    taskServices = module.get(TasksService);;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('create', () => {
    it('should create a note when the task exists', async () => {
      const validTaskId = 1;
      const createNoteDto: CreateNoteDto = {
        content: 'valid content'
      }
      const assossietedTask: Task = {
        id: 1,
        title: 'Implement authentication',
        description: 'Implement JWT authentication with NestJS',
        status: TaskStatus.todo,
        priority: TaskPriority.low,
        category: TaskCategory.bug_fixing,
        notes: [],
        created_at: new Date(),
        updated_at: new Date(),
      };

      taskServices.findOne.mockResolvedValueOnce(assossietedTask)

      const createdNote = new Note(assossietedTask, createNoteDto.content);
      const spyOnSave = jest.spyOn(noteRepository, 'save');
      spyOnSave.mockResolvedValueOnce(createdNote);

      const result = await service.create(validTaskId, createNoteDto);
      expect(result.taskId).toEqual(assossietedTask.id);

    });

    it('should throw NotFoundException if the task does not exist', async () => {
      const invalidTaskId = -1;
      const createNoteDto: CreateNoteDto = {
        content: 'valid content'
      }
      taskServices.findOne.mockRejectedValueOnce(new NotFoundException())

      await expect(service.create(invalidTaskId, createNoteDto)).rejects.toThrow(NotFoundException);

    });
  });
  describe('findAll', () => {
    it('should return all notes for a given task', async () => {
      const validTaskId = 1;
      const createNoteDto: CreateNoteDto = {
        content: 'valid content'
      }
      const assossietedTask: Task = {
        id: 1,
        title: 'Implement authentication',
        description: 'Implement JWT authentication with NestJS',
        status: TaskStatus.todo,
        priority: TaskPriority.low,
        category: TaskCategory.bug_fixing,
        notes: [],
        created_at: new Date(),
        updated_at: new Date(),
      };

      const arrNote: Note[] = []
      const expectArr: ResponseNoteDto[] = []
      taskServices.findOne.mockResolvedValueOnce(assossietedTask);
      const spyOn = jest.spyOn(noteRepository, 'find').mockResolvedValueOnce(arrNote);
      const result = await service.findAll(validTaskId);

      expect(result).toEqual(expectArr);

    });

    it('should throw NotFoundException if the task does not exist', async () => {
      const invalidTaskId = -1;
      taskServices.findOne.mockRejectedValueOnce(new NotFoundException);
      await expect(service.findAll(invalidTaskId)).rejects.toThrow(NotFoundException);
    });
  });
  describe('findOne', () => {
    it('should return a note by id', async () => {
      const noteId = 1;
      const note: Note = {
        id: 0,
        task: new Task,
        content: '',
        created_at: new Date(),
        updated_at: new Date()
      };
      const spyOn = jest.spyOn(noteRepository, 'findOne').mockResolvedValueOnce(note);
      const result = await service.findOne(noteId);
      expect(result.id).toEqual(note.id);
    });
    it('should throw NotFoundException if the note does not exist', async () => {
      const invalidNoteId = -1;

      const spyOn = jest.spyOn(noteRepository, 'findOne').mockRejectedValueOnce(new NotFoundException)
      expect(service.findOne(invalidNoteId)).rejects.toThrow(NotFoundException);
    });
  });
  describe('update', () => {
    it('should update a note by id', async () => {
      const noteId = 1;
      const updateNoteDto: UpdateNoteDto = {
        content: 'new Content',
      }
      const note: Note = {
        id: 0,
        task: new Task,
        content: 'actual content',
        created_at: new Date(),
        updated_at: new Date()
      }
      note.task.id = 1;
      const updatedNote: Note = {
        ...note,
        content: updateNoteDto.content,
        updated_at: new Date(),
      }
      const { task, ...rest } = updatedNote;
      const responseNote: ResponseNoteDto = { taskId: task.id, ...rest }
      const spyOnFindOne = jest.spyOn(noteRepository, 'findOne').mockResolvedValueOnce(note).mockResolvedValueOnce(updatedNote);
      const spyOnUpdate = jest.spyOn(noteRepository, 'update').mockResolvedValueOnce({ affected: 1, raw: [] } as UpdateResult);
      const result = await service.update(noteId, updateNoteDto);
      expect(spyOnFindOne).toHaveBeenCalledTimes(2);
      expect(spyOnUpdate).toHaveBeenCalledWith({ id: noteId }, { content: updateNoteDto.content });
      expect(result).toEqual(responseNote);
    });
    it('should throw NotFoundException if the note does not exist', async () => {
      const invalidNoteId = -1;

      const spyOn = jest.spyOn(noteRepository, 'findOne').mockRejectedValueOnce(new NotFoundException)
      expect(service.findOne(invalidNoteId)).rejects.toThrow(NotFoundException);
    });
  });
  describe('remove', () => {
    it('should delete a note by id', async () => {
      const noteId = 1;
      const note: Note = {
        id: 0,
        task: new Task,
        content: '',
        created_at: new Date,
        updated_at: new Date
      }
      const deleteResult: DeleteResult = { affected: 1, raw: [] };
      const findSpy = jest.spyOn(noteRepository, 'findOne').mockResolvedValueOnce(note);
      const deleteSpy = jest.spyOn(noteRepository, 'delete').mockResolvedValueOnce(deleteResult)
      const result = await service.remove(noteId);

      expect(deleteSpy).toHaveBeenCalledTimes(1);
      expect(deleteSpy).toHaveBeenCalledWith({ id: noteId });
      expect(result).toEqual(deleteResult);
    });
    it('should throw NotFoundException if the note does not exist', async () => {
      const invalidNoteId = -1;

      const spyOn = jest.spyOn(noteRepository, 'findOne').mockRejectedValueOnce(new NotFoundException)
      expect(service.findOne(invalidNoteId)).rejects.toThrow(NotFoundException);
    });
  });
});
