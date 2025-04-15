import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module';
import { NotesModule } from './notes/notes.module';
import { dataSourceOptions } from './db/data-source';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions), TasksModule, NotesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
