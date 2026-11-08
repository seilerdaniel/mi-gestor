import { prisma } from '../../../core/db/prisma.js';

/**
 * Saldo derivado: nunca se materializa en Account.
 * ingreso y ajuste suman; gasto resta; transferencia se resuelve en Fase 2
 * cuando exista cuentaDestinoId.
 */
export async function saldoActual(cuentaId: string): Promise<number> {
  const filas = await prisma.transaction.groupBy({
    by: ['tipo'],
    where: { cuentaId },
    _sum: { montoCentavos: true },
  });

  let saldo = 0;
  for (const fila of filas) {
    const monto = fila._sum.montoCentavos ?? 0;
    if (fila.tipo === 'ingreso' || fila.tipo === 'ajuste') saldo += monto;
    else if (fila.tipo === 'gasto') saldo -= monto;
  }

  return saldo;
}
