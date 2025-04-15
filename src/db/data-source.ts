import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';
const pathMigrations = join(__dirname, './migrations/*.{ts,js}');
export const dataSourceOptions: DataSourceOptions = {
  type: 'sqlite',
  database: 'db_taskly.db',
  synchronize: true,
  entities: [],
  migrations: [pathMigrations],
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
