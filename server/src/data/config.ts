import dotenv from 'dotenv';
import { ConnectionOptions, createConnection } from 'typeorm';

dotenv.config();

export const connection = createConnection({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  logging: true,
  cli: {
    entitiesDir: 'entity',
    migrationsDir: 'migration',
    subscribersDir: 'subscriber',
  },
  entities: [
    'server/src/data/entity/*.ts'
  ],
  migrations: [
    './migration/*.ts'
  ],
  subscribers: [
    './subscriber/*.ts'
  ],
} as ConnectionOptions);