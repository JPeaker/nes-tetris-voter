import { Pool } from 'pg';
import dotenv from 'dotenv';
import { ConnectionOptions, createConnection } from 'typeorm';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

const connectionString = `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

export const pool = new Pool({
  connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
  ssl: isProduction,
});

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
    entitiesDir: 'data/entity',
    migrationsDir: 'data/migration',
    subscribersDir: 'data/subscriber',
  },
  entities: [
    'data/entity/**/*.ts'
  ],
 migrations: [
    'data/migration/**/*.ts'
 ],
 subscribers: [
    'data/subscriber/**/*.ts'
 ],
} as ConnectionOptions);