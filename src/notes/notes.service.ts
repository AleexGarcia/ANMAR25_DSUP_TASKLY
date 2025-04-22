import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { Repository } from 'typeorm';
import { Task } from '../tasks/entities/task.entity';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note) private noteRepository: Repository<Note>,
    @InjectRepository(Task) private taskRepository: Repository<Task>,
  ) {}
  async create(taskId: number, createNoteDto: CreateNoteDto) {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException('Task not found!');
    }
    return await this.noteRepository.save(
      new Note(task, createNoteDto.content),
    );
  }

  async findAll(taskId: number) {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });
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
}
