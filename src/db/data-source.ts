import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';
import { Task } from '../tasks/entities/task.entity';
import { Note } from '../notes/entities/note.entity';
const pathMigrations = join(__dirname, './migrations/*.{ts,js}');
export const dataSourceOptions: DataSourceOptions = {
  type: 'sqlite',
  database: 'db_taskly.db',
  synchronize: false,
  entities: [Task, Note],
  migrations: [pathMigrations],
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
