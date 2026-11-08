import { mkdirSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import Database from 'better-sqlite3';

const directorio = join(process.cwd(), '.tmp');
mkdirSync(directorio, { recursive: true });

const nombre = `test-${process.pid}-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}.db`;
const relativo = `.tmp/${nombre}`;
const absoluto = join(process.cwd(), relativo);

rmSync(absoluto, { force: true });

const db = new Database(absoluto);
db.pragma('foreign_keys = ON');
db.exec(
  readFileSync(join(process.cwd(), 'core/db/migrations/0001_inicial/migration.sql'), 'utf8'),
);
db.close();

process.env.DATABASE_URL = `file:./${relativo}`;
process.env.NODE_ENV = 'test';
