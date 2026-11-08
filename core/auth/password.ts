import { randomBytes, scrypt, timingSafeEqual, type ScryptOptions } from 'node:crypto';

const N = 2 ** 17;
const R = 8;
const P = 1;
const KEYLEN = 32;
const SALT_BYTES = 16;
const MAXMEM = 256 * 1024 * 1024;

function derivar(
  password: string,
  salt: Buffer,
  keylen: number,
  opciones: ScryptOptions,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, keylen, opciones, (error, clave) => {
      if (error) reject(error);
      else resolve(clave);
    });
  });
}

export async function hashearPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_BYTES);
  const hash = await derivar(password, salt, KEYLEN, { N, r: R, p: P, maxmem: MAXMEM });
  return `scrypt$${N}$${R}$${P}$${salt.toString('base64')}$${hash.toString('base64')}`;
}

export async function verificarPassword(password: string, almacenado: string): Promise<boolean> {
  const partes = almacenado.split('$');
  if (partes.length !== 6) return false;

  const [algoritmo, nTexto, rTexto, pTexto, saltB64, hashB64] = partes;
  if (algoritmo !== 'scrypt' || !nTexto || !rTexto || !pTexto || !saltB64 || !hashB64) {
    return false;
  }

  const n = Number(nTexto);
  const r = Number(rTexto);
  const p = Number(pTexto);
  if (!Number.isInteger(n) || !Number.isInteger(r) || !Number.isInteger(p)) return false;

  const salt = Buffer.from(saltB64, 'base64');
  const esperado = Buffer.from(hashB64, 'base64');
  const calculado = await derivar(password, salt, esperado.length, { N: n, r, p, maxmem: MAXMEM });

  return calculado.length === esperado.length && timingSafeEqual(calculado, esperado);
}
