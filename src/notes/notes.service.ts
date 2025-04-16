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
  async create(createNoteDto: CreateNoteDto) {
    const { taskId, content } = createNoteDto;
    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException('Task not found!');
    }
    return await this.noteRepository.save(new Note(task, content));
  }

  async findAll(taskId: number) {
    return this.noteRepository.find({
      where: {
        task: {
          id: taskId,
        },
      },
    });
  }

  async findOne(id: number) {
    return this.noteRepository.findOne({ where: { id: id } });
  }

  async update(id: number, updateNoteDto: UpdateNoteDto) {
    const note = await this.noteRepository.findOne({ where: { id: id } });
    if (!note) throw new NotFoundException('Note not Found');
    return this.noteRepository.update(
      {
        id: id,
      },
      { content: updateNoteDto.content },
    );
  }

  async remove(id: number) {
    return this.noteRepository.delete({ id: id });
  }
}
