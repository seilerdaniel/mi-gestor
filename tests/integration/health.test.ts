import { afterAll, describe, expect, it } from 'vitest';
import { construirServidor } from '../../core/http/servidor.js';

const app = await construirServidor({ logger: false });

afterAll(async () => {
  await app.close();
});

describe('GET /api/health', () => {
  it('responde ok con la base disponible', async () => {
    const respuesta = await app.inject({ method: 'GET', url: '/api/health' });

    expect(respuesta.statusCode).toBe(200);
    expect(respuesta.json()).toMatchObject({ ok: true, servicio: 'mi-gestor' });
  });
});
