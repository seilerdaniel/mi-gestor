import { hashearPassword } from '../../core/auth/password.js';
import { prisma } from '../../core/db/prisma.js';
import { CATEGORIAS_COMPRAS } from './categorias.js';
import { FERIADOS } from './feriados.js';

function anioDe(fecha: string): number {
  return Number(fecha.slice(0, 4));
}

export async function seedCore(): Promise<void> {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (email && password) {
    const passwordHash = await hashearPassword(password);
    await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email, passwordHash, nombre: 'Daniel' },
    });
    console.log(`[seed] usuario listo: ${email}`);
  } else {
    console.warn('[seed] SEED_ADMIN_EMAIL/SEED_ADMIN_PASSWORD no definidos; no se creó usuario.');
  }

  await prisma.settings.upsert({
    where: { id: 'default' },
    update: {},
    create: { id: 'default' },
  });

  for (const categoria of CATEGORIAS_COMPRAS) {
    await prisma.category.upsert({
      where: { externalId: categoria.externalId },
      update: { nombre: categoria.nombre, scope: 'compras' },
      create: { ...categoria, scope: 'compras' },
    });
  }
  console.log(`[seed] categorías: ${CATEGORIAS_COMPRAS.length}`);

  for (const feriado of FERIADOS) {
    await prisma.holiday.upsert({
      where: { externalId: feriado.externalId },
      update: {
        fecha: feriado.fecha,
        descripcion: feriado.descripcion,
        anio: anioDe(feriado.fecha),
      },
      create: { ...feriado, anio: anioDe(feriado.fecha) },
    });
  }
  console.log(`[seed] feriados: ${FERIADOS.length}`);
}
