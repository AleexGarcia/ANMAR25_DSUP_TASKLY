import { forwardRef, Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { NotesModule } from '../notes/notes.module';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
  imports: [TypeOrmModule.forFeature([Task]), forwardRef(() => NotesModule)],
  exports: [TasksService]
})
export class TasksModule { }
