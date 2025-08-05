import { forwardRef, Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { TasksModule } from '../tasks/tasks.module';

@Module({
  imports: [TypeOrmModule.forFeature([Note]), forwardRef(() => TasksModule)],
  controllers: [NotesController],
  providers: [NotesService],
  exports:[NotesService]
})
export class NotesModule {}
