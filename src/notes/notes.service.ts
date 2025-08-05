import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { Repository } from 'typeorm';
import { ResponseNoteDto } from './dto/response-note.dto';
import { TasksService } from '../tasks/tasks.service';

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
      ...rest,
      taskId: task.id,
    }
    return responseNote;
  }

  async findAll(taskId: number) {
    const task = await this.tasksService.findOne(taskId);
    if (!task) throw new NotFoundException('Task not Found!');
    const notes = await this.noteRepository.find({
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
    });
    return notes.map((note) => ({
      ...note,
      taskId: note.task.id,
      task: undefined,
    }));
  }

  async findOne(id: number) {
    const note = await this.noteRepository.findOne({
      where: { id: id },
      relations: { task: true },
      select: { task: { id: true } },
    });
    if (!note) throw new NotFoundException('Note not Found');
    return { ...note, taskId: note.task.id, task: undefined };
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

  async removeNotesByTaskId(taskId: number) {
    await this.noteRepository.delete({ task: { id: taskId } })
  }
}
