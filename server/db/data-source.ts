import { DataSource, DataSourceOptions } from 'typeorm';

import * as dotenv from 'dotenv';
dotenv.config();

export const DataSourceConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  synchronize: false,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  migrations: ['dist/db/migrations/*.js'],
  logging: false, // Enable for Query Logging
  ssl: process.env.POSTGRES_SSL === 'true',
  extra: process.env.POSTGRES_SSL === 'true' ? { ssl: { rejectUnauthorized: false } } : {},
  migrationsRun: true,
};

const dataSource = new DataSource(DataSourceConfig);
export default dataSource;
