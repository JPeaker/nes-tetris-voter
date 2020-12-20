import dotenv from 'dotenv';
import { ConnectionOptions, createConnection } from 'typeorm';

dotenv.config();

export const connection = createConnection({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: true,
  cli: {
    entitiesDir: 'entity',
    migrationsDir: 'migration',
    subscribersDir: 'subscriber',
  },
  entities: [
    'server/data/entity/*.ts'
  ],
  migrations: [
    './migration/*.ts'
  ],
  subscribers: [
    './subscriber/*.ts'
  ],
} as ConnectionOptions);