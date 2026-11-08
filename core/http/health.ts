import type { FastifyInstance } from 'fastify';
import { prisma } from '../db/prisma.js';

export async function registrarHealth(app: FastifyInstance): Promise<void> {
  app.get('/api/health', async () => {
    await prisma.$queryRaw`SELECT 1`;
    return { ok: true, servicio: 'mi-gestor', version: '0.1.0' };
  });
}
