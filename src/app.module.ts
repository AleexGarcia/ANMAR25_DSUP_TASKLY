import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module';
import { NotesModule } from './notes/notes.module';
import { dataSourceOptions } from './db/data-source';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions), TasksModule, NotesModule],
})
export class AppModule {}
