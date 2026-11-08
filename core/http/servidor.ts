import { existsSync } from 'node:fs';
import { join } from 'node:path';
import cookie from '@fastify/cookie';
import fastifyStatic from '@fastify/static';
import Fastify, { type FastifyInstance } from 'fastify';
import { registrarRutasDeAuth } from '../auth/rutas.js';
import { registrarManejadorDeErrores } from './errores.js';
import { registrarHealth } from './health.js';

export type OpcionesServidor = {
  logger?: boolean;
};

export async function construirServidor(
  opciones: OpcionesServidor = {},
): Promise<FastifyInstance> {
  const app = Fastify({ logger: opciones.logger ?? true });

  await app.register(cookie);
  registrarManejadorDeErrores(app);
  await registrarHealth(app);
  await registrarRutasDeAuth(app);

  const distUi = join(process.cwd(), 'dist', 'ui');
  if (process.env.NODE_ENV === 'production' && existsSync(distUi)) {
    await app.register(fastifyStatic, { root: distUi, wildcard: false });
    app.setNotFoundHandler((req, reply) => {
      if (req.url.startsWith('/api/')) {
        return reply.status(404).send({ error: 'No encontrado' });
      }
      return reply.sendFile('index.html');
    });
  }

  return app;
}
