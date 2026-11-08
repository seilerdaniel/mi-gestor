import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { hashearPassword } from '../../core/auth/password.js';
import { prisma } from '../../core/db/prisma.js';
import { construirServidor } from '../../core/http/servidor.js';

const EMAIL = 'auth@test.local';
const PASSWORD = 'clave-de-prueba';

const app = await construirServidor({ logger: false });

beforeAll(async () => {
  const passwordHash = await hashearPassword(PASSWORD);
  await prisma.user.create({
    data: { email: EMAIL, passwordHash, nombre: 'Test' },
  });
});

afterAll(async () => {
  await app.close();
});

function extraerCookie(respuesta: { headers: Record<string, unknown> }): string {
  const setCookie = respuesta.headers['set-cookie'];
  const valor = Array.isArray(setCookie) ? setCookie[0] : setCookie;
  if (typeof valor !== 'string') throw new Error('La respuesta no incluyó cookie');
  const par = valor.split(';')[0];
  if (!par) throw new Error('Cookie vacía');
  return par;
}

describe('autenticación', () => {
  it('rechaza credenciales inválidas', async () => {
    const respuesta = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { email: EMAIL, password: 'incorrecta' },
    });

    expect(respuesta.statusCode).toBe(401);
  });

  it('rechaza payload inválido', async () => {
    const respuesta = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { email: 'no-es-email' },
    });

    expect(respuesta.statusCode).toBe(400);
  });

  it('loguea, lee /me y revoca la sesión al salir', async () => {
    const login = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { email: EMAIL, password: PASSWORD },
    });

    expect(login.statusCode).toBe(200);
    const cookie = extraerCookie(login);

    const me = await app.inject({
      method: 'GET',
      url: '/api/auth/me',
      headers: { cookie },
    });
    expect(me.statusCode).toBe(200);
    expect(me.json()).toMatchObject({ usuario: { email: EMAIL } });

    const logout = await app.inject({
      method: 'POST',
      url: '/api/auth/logout',
      headers: { cookie },
    });
    expect(logout.statusCode).toBe(200);

    const meDespues = await app.inject({
      method: 'GET',
      url: '/api/auth/me',
      headers: { cookie },
    });
    expect(meDespues.statusCode).toBe(401);
  });
});
