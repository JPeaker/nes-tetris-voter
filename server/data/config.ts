import dotenv from 'dotenv';
import { ConnectionOptions, createConnection } from 'typeorm';

dotenv.config();

export const getConnectionOptions = (): ConnectionOptions => {
  return {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    synchronize: true,
    ssl: process.env.NODE_ENV === 'production',
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
      'server/data/migration/*.ts'
    ],
    subscribers: [
      './subscriber/*.ts'
    ],
  }
};

export const connection = createConnection(getConnectionOptions());