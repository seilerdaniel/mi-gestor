import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { entorno } from '../config/env.js';
import { PrismaClient } from './generated/client.js';

const adapter = new PrismaBetterSqlite3({ url: entorno.DATABASE_URL });

export const prisma = new PrismaClient({ adapter });
