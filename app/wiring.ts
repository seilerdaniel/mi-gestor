import type { FastifyInstance } from 'fastify';
import { bus } from '../core/events/bus.js';

/**
 * Composition root.
 * Fase 2: registra rutas de Finanzas y suscribe el puente al evento de compra.
 * Fase 3: registra rutas de Compras y publica `EVENTOS.compraRegistrada`.
 */
export async function cablearModulos(app: FastifyInstance): Promise<void> {
  void app;
  void bus;
}
