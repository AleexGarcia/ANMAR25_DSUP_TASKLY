import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { DeleteResult, Repository } from 'typeorm';
import { ResponseNoteDto } from './dto/response-note.dto';
import { TasksService } from '../tasks/tasks.service';
import { GetNotesQueryDto } from './dto/get-notes-param.dto';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note) private noteRepository: Repository<Note>,
    @Inject(forwardRef(() => TasksService)) private tasksService: TasksService,
  ) { }
  async create(taskId: number, createNoteDto: CreateNoteDto): Promise<ResponseNoteDto> {
    const findTask = await this.tasksService.findOne(taskId);
    const { task, ...rest } = await this.noteRepository.save(
      new Note(findTask, createNoteDto.content),
    );
    const responseNote: ResponseNoteDto = {
      ...rest, taskId: task.id,
    }

    return responseNote;
  }

  async findAll(taskId: number, query: GetNotesQueryDto) {
    await this.tasksService.findOne(taskId);
    let { limit, page } = query;
    page = page ? page : 1;
    limit = limit ? limit : 5;
    const offset = (page - 1) * limit;
    const [notes, count] = await this.noteRepository.findAndCount({
      where: {
        task: {
          id: taskId,
        },
      },
      relations: {
        task: true,
      },
      select: {
        task: { id: true },
      },
      take: limit,
      skip: offset,
      order: {
        created_at: 'asc',
      }
    });
    return {
      page: page,
      total: count,
      notes: notes.map<ResponseNoteDto>(({ task, ...rest }) => ({ ...rest, taskId: task.id }))
    }
  }

  async findOne(id: number): Promise<ResponseNoteDto> {
    const note = await this.noteRepository.findOne({
      where: { id: id },
      relations: { task: true },
      select: { task: { id: true } },
    });
    if (!note) throw new NotFoundException('Note not Found');
    const { task, ...rest } = note;
    return { ...rest, taskId: task.id };
  }

  async update(id: number, updateNoteDto: UpdateNoteDto) {
    await this.findOne(id);
    await this.noteRepository.update(
      {
        id: id,
      },
      { content: updateNoteDto.content },
    );
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.noteRepository.delete({ id: id });
  }

  async removeNotesByTaskId(taskId: number): Promise<DeleteResult> {
    return this.noteRepository.delete({ task: { id: taskId } })
  }
}
