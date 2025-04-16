import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { Task } from '../tasks/entities/task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Note]), TypeOrmModule.forFeature([Task])],
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule {}
