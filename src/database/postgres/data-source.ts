import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config({
  path: `.env.${process.env.NODE_ENV}`,
});
const SSL = process.env.DB_SSL == '1' ? true : false;
const DB_SYNC = process.env.DB_SYNC == '1' ? true : false;
const DB_LOGGIN = typeof process.env.DB_LOGGIN == 'string' ? true : false;

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: DB_SYNC,
  logging: DB_LOGGIN,
  entities: ['src/modules/**/entity/**/*.ts'],
  migrations: ['./src/migration/*.ts'],
  ssl: SSL,
  subscribers: [],
});
