import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { config } from '../config';
import { migrate } from './migrations';

const open = () => {
  if (config.databasePath !== ':memory:') mkdirSync(dirname(config.databasePath), { recursive: true });
  const db = new Database(config.databasePath);
  db.pragma('journal_mode = WAL'); // readers don't block the writer
  db.pragma('foreign_keys = ON');
  db.pragma('busy_timeout = 5000');
  migrate(db);
  return db;
};

export const sql = open();

export const parseJson = <T>(value: unknown, fallback: T): T =>
  typeof value === 'string' ? (JSON.parse(value) as T) : fallback;

export const isUniqueViolation = (err: unknown) =>
  (err as { code?: string } | null)?.code === 'SQLITE_CONSTRAINT_UNIQUE';
