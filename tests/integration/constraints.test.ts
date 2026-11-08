import { beforeAll, describe, expect, it } from 'vitest';
import { prisma } from '../../core/db/prisma.js';

type CompraRaw = {
  id: string;
  usuarioId: string;
  nombre: string;
  prioridad: string;
  estado: string;
  quincena: string | null;
  precioEstimadoCentavos: number | null;
  precioEstimadoTexto: string | null;
  externalId: string;
};

let usuarioId: string;

beforeAll(async () => {
  const usuario = await prisma.user.create({
    data: { email: 'constraints@test.local', passwordHash: 'x', nombre: 'Test' },
  });
  usuarioId = usuario.id;
});

async function insertarCompra(compra: CompraRaw): Promise<void> {
  await prisma.$executeRawUnsafe(
    `INSERT INTO "PurchaseItem"
      ("id","usuarioId","nombre","prioridad","estado","quincena",
       "precioEstimadoCentavos","precioEstimadoTexto","externalId","createdAt")
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    compra.id,
    compra.usuarioId,
    compra.nombre,
    compra.prioridad,
    compra.estado,
    compra.quincena,
    compra.precioEstimadoCentavos,
    compra.precioEstimadoTexto,
    compra.externalId,
    new Date().toISOString(),
  );
}

describe('constraints de PurchaseItem', () => {
  it('P5 no puede estar activo', async () => {
    await expect(
      insertarCompra({
        id: 'p5-1',
        usuarioId,
        nombre: 'Segunda heladera',
        prioridad: 'P5',
        estado: 'activo',
        quincena: '2026-Q1',
        precioEstimadoCentavos: 500_000,
        precioEstimadoTexto: null,
        externalId: 'test-p5-1',
      }),
    ).rejects.toThrow();
  });

  it('P5 puede existir bloqueado con precio pendiente', async () => {
    await insertarCompra({
      id: 'p5-2',
      usuarioId,
      nombre: 'Mascotas',
      prioridad: 'P5',
      estado: 'bloqueado',
      quincena: null,
      precioEstimadoCentavos: null,
      precioEstimadoTexto: 'pendiente',
      externalId: 'test-p5-2',
    });

    const fila = await prisma.purchaseItem.findUnique({ where: { id: 'p5-2' } });
    expect(fila?.estado).toBe('bloqueado');
  });

  it('no permite dos compras activas en la misma quincena', async () => {
    await insertarCompra({
      id: 'p0-1',
      usuarioId,
      nombre: 'Heladera',
      prioridad: 'P0',
      estado: 'activo',
      quincena: '2027-Q1',
      precioEstimadoCentavos: 300_000,
      precioEstimadoTexto: null,
      externalId: 'test-p0-1',
    });

    await expect(
      insertarCompra({
        id: 'p0-2',
        usuarioId,
        nombre: 'Cocina',
        prioridad: 'P0',
        estado: 'activo',
        quincena: '2027-Q1',
        precioEstimadoCentavos: 200_000,
        precioEstimadoTexto: null,
        externalId: 'test-p0-2',
      }),
    ).rejects.toThrow();
  });

  it('una compra activa exige quincena', async () => {
    await expect(
      insertarCompra({
        id: 'p0-3',
        usuarioId,
        nombre: 'Sin quincena',
        prioridad: 'P0',
        estado: 'activo',
        quincena: null,
        precioEstimadoCentavos: 100_000,
        precioEstimadoTexto: null,
        externalId: 'test-p0-3',
      }),
    ).rejects.toThrow();
  });

  it('una compra sin precio exige texto pendiente', async () => {
    await expect(
      insertarCompra({
        id: 'p0-4',
        usuarioId,
        nombre: 'Sin monto',
        prioridad: 'P0',
        estado: 'pendiente',
        quincena: null,
        precioEstimadoCentavos: null,
        precioEstimadoTexto: null,
        externalId: 'test-p0-4',
      }),
    ).rejects.toThrow();
  });

  it('la deuda exige monto o texto pendiente', async () => {
    await expect(
      prisma.$executeRawUnsafe(
        `INSERT INTO "Debt" ("id","usuarioId","acreedor","estado","externalId","createdAt")
         VALUES (?, ?, ?, ?, ?, ?)`,
        'debt-1',
        usuarioId,
        'Sin monto',
        'pendiente',
        'test-debt-1',
        new Date().toISOString(),
      ),
    ).rejects.toThrow();
  });
});

describe('anti-drift de constraints', () => {
  it('el CHECK de P5 sigue en sqlite_master', async () => {
    const filas = await prisma.$queryRawUnsafe<Array<{ sql: string | null }>>(
      `SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'PurchaseItem'`,
    );

    expect(filas[0]?.sql).toContain('purchase_item_p5_bloqueado');
    expect(filas[0]?.sql).toContain('purchase_item_activo_con_quincena');
    expect(filas[0]?.sql).toContain('purchase_item_monto_valido');
  });

  it('el índice parcial de meta activa sigue en sqlite_master', async () => {
    const filas = await prisma.$queryRawUnsafe<Array<{ sql: string | null }>>(
      `SELECT sql FROM sqlite_master
       WHERE type = 'index' AND name = 'purchase_item_meta_activa_por_quincena'`,
    );

    expect(filas).toHaveLength(1);
    expect(filas[0]?.sql).toContain('WHERE "estado" = \'activo\'');
  });
});
