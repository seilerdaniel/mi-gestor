import { createHash, randomBytes } from 'node:crypto';
import { prisma } from '../db/prisma.js';

const DURACION_MS = 30 * 24 * 60 * 60 * 1000;

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export async function crearSesion(usuarioId: string) {
  const token = randomBytes(32).toString('base64url');
  const expiresAt = new Date(Date.now() + DURACION_MS);

  await prisma.session.create({
    data: { tokenHash: hashToken(token), usuarioId, expiresAt },
  });

  return { token, expiresAt };
}

export async function usuarioDeToken(token: string) {
  const sesion = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { usuario: true },
  });

  if (!sesion) return null;

  if (sesion.expiresAt.getTime() <= Date.now()) {
    await prisma.session.delete({ where: { id: sesion.id } });
    return null;
  }

  return sesion.usuario;
}

export async function revocarSesion(token: string): Promise<void> {
  await prisma.session.deleteMany({ where: { tokenHash: hashToken(token) } });
}
