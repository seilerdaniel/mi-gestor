import { beforeAll, describe, expect, it } from 'vitest';
import { prisma } from '../../core/db/prisma.js';
import { saldoActual } from '../../modules/finanzas/repositories/cuentas.repo.js';

let usuarioId: string;
let cuentaId: string;

beforeAll(async () => {
  const usuario = await prisma.user.create({
    data: { email: 'account@test.local', passwordHash: 'x', nombre: 'Test' },
  });
  usuarioId = usuario.id;

  const cuenta = await prisma.account.create({
    data: { usuarioId, nombre: 'Efectivo', tipo: 'efectivo' },
  });
  cuentaId = cuenta.id;
});

async function crearTransaccion(
  id: string,
  tipo: 'ingreso' | 'gasto' | 'transferencia' | 'ajuste',
  montoCentavos: number,
) {
  return prisma.transaction.create({
    data: {
      id,
      usuarioId,
      cuentaId,
      tipo,
      montoCentavos,
      fecha: '2026-11-05',
      quincena: '2026-Q1',
      descripcion: `Test ${id}`,
    },
  });
}

describe('saldoActual derivado de Transaction', () => {
  it('suma ingresos y ajustes, resta gastos e ignora transferencias', async () => {
    await crearTransaccion('tx-ingreso', 'ingreso', 100_000);
    await crearTransaccion('tx-gasto', 'gasto', 30_000);
    await crearTransaccion('tx-ajuste', 'ajuste', -5_000);
    await crearTransaccion('tx-transferencia', 'transferencia', 20_000);

    await expect(saldoActual(cuentaId)).resolves.toBe(65_000);
  });

  it('refleja ediciones', async () => {
    await prisma.transaction.update({
      where: { id: 'tx-gasto' },
      data: { montoCentavos: 40_000 },
    });

    await expect(saldoActual(cuentaId)).resolves.toBe(55_000);
  });

  it('refleja borrados', async () => {
    await prisma.transaction.delete({ where: { id: 'tx-gasto' } });

    await expect(saldoActual(cuentaId)).resolves.toBe(95_000);
  });
});
