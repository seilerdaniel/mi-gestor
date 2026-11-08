import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'core/db/schema.prisma',
  migrations: {
    path: 'core/db/migrations',
    seed: 'tsx scripts/seed.ts',
  },
  datasource: {
    url: process.env.DATABASE_URL ?? 'file:./mi-gestor.db',
  },
});
