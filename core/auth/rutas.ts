import type { FastifyInstance, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { prisma } from '../db/prisma.js';
import { ErrorHttp } from '../http/errores.js';
import { verificarPassword } from './password.js';
import { crearSesion, revocarSesion, usuarioDeToken } from './sesion.js';

const COOKIE = 'mg_session';
const esProduccion = process.env.NODE_ENV === 'production';

const esquemaLogin = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type UsuarioPublico = {
  id: string;
  email: string;
  nombre: string;
};

export async function registrarRutasDeAuth(app: FastifyInstance): Promise<void> {
  app.post('/api/auth/login', async (req, reply) => {
    const { email, password } = esquemaLogin.parse(req.body);

    const usuario = await prisma.user.findUnique({ where: { email } });
    if (!usuario || !(await verificarPassword(password, usuario.passwordHash))) {
      throw new ErrorHttp(401, 'Credenciales inválidas');
    }

    const { token, expiresAt } = await crearSesion(usuario.id);

    reply.setCookie(COOKIE, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: esProduccion,
      path: '/',
      expires: expiresAt,
    });

    return { usuario: aPublico(usuario) };
  });

  app.post('/api/auth/logout', async (req, reply) => {
    const token = req.cookies[COOKIE];
    if (token) await revocarSesion(token);
    reply.clearCookie(COOKIE, { path: '/' });
    return { ok: true };
  });

  app.get('/api/auth/me', async (req) => {
    return { usuario: await usuarioActual(req) };
  });
}

export async function usuarioActual(req: FastifyRequest): Promise<UsuarioPublico> {
  const token = req.cookies[COOKIE];
  if (!token) throw new ErrorHttp(401, 'No autenticado');

  const usuario = await usuarioDeToken(token);
  if (!usuario) throw new ErrorHttp(401, 'Sesión inválida o vencida');

  return aPublico(usuario);
}

export async function requiereSesion(req: FastifyRequest): Promise<void> {
  await usuarioActual(req);
}

function aPublico(usuario: { id: string; email: string; nombre: string }): UsuarioPublico {
  return { id: usuario.id, email: usuario.email, nombre: usuario.nombre };
}
