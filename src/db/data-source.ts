import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';
import { Task } from '../tasks/entities/task.entity';
import { Note } from '../notes/entities/note.entity';
const pathMigrations = join(__dirname, './migrations/*.{ts,js}');

const commonOptions = {
  entities: [Task, Note],
  migrations: [pathMigrations],
};

const prodOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'prod_user',
  password: process.env.DB_PASS || 'prod_pass',
  database: process.env.DB_NAME || 'prod_db',
  synchronize: false,
  ...commonOptions,
};

const testOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.TEST_DB_HOST || 'localhost',
  port: parseInt(process.env.TEST_DB_PORT || '5433'),
  username: process.env.TEST_DB_USER || 'test_user',
  password: process.env.TEST_DB_PASS || 'test_pass',
  database: process.env.TEST_DB_NAME || 'test_db',
  dropSchema: true,
  synchronize: true,
  logging: false,
  ...commonOptions,
};

export const dataSourceOptions =
  process.env.NODE_ENV === 'test' ? testOptions : prodOptions;

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;