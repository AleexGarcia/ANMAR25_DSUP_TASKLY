import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module';
import { NotesModule } from './notes/notes.module';
import { Task } from './tasks/entities/task.entity';
import { Note } from './notes/entities/note.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db_taskly',
      entities: [Task, Note],
      synchronize: true,
    }),
    TasksModule,
    NotesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
