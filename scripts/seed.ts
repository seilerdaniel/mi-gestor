import 'dotenv/config';
import { prisma } from '../core/db/prisma.js';
import { seedCompras } from './seed/compras.js';
import { seedCore } from './seed/core.js';
import { seedFinanzas } from './seed/finanzas.js';

async function main(): Promise<void> {
  await seedCore();
  await seedFinanzas();
  await seedCompras();
  console.log('[seed] listo');
}

main()
  .catch((error: unknown) => {
    console.error('[seed] error', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
