import { prisma } from '../db/prisma.js';

export async function obtenerSettings() {
  return prisma.settings.upsert({
    where: { id: 'default' },
    update: {},
    create: { id: 'default' },
  });
}
