/**
 * Contratos de eventos del core.
 * No importan tipos de módulos: solo datos primitivos.
 */
export const EVENTOS = {
  compraRegistrada: 'compras.compra-registrada',
} as const;

export type CompraRegistrada = {
  compraId: string;
  usuarioId: string;
  nombre: string;
  montoCentavos: number;
  fecha: string;
  quincena: string;
  metaId: string | null;
};
