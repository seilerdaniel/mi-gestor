export type CategoriaSeed = {
  nombre: string;
  externalId: string;
};

/**
 * Taxonomía de Compras definida en el brief.
 * Scope: compras. Las categorías de Finanzas se agregan en Fase 2.
 */
export const CATEGORIAS_COMPRAS: readonly CategoriaSeed[] = [
  { nombre: 'Cocina', externalId: 'cat-compras-cocina' },
  { nombre: 'Limpieza', externalId: 'cat-compras-limpieza' },
  { nombre: 'Baño', externalId: 'cat-compras-bano' },
  { nombre: 'Dormitorio', externalId: 'cat-compras-dormitorio' },
  { nombre: 'Iluminación', externalId: 'cat-compras-iluminacion' },
  { nombre: 'Electricidad', externalId: 'cat-compras-electricidad' },
  { nombre: 'Seguridad', externalId: 'cat-compras-seguridad' },
  { nombre: 'Lavadero', externalId: 'cat-compras-lavadero' },
  { nombre: 'Herramientas', externalId: 'cat-compras-herramientas' },
  { nombre: 'Organización', externalId: 'cat-compras-organizacion' },
  { nombre: 'Electrodomésticos', externalId: 'cat-compras-electrodomesticos' },
  { nombre: 'Ropa', externalId: 'cat-compras-ropa' },
  { nombre: 'Comedor', externalId: 'cat-compras-comedor' },
  { nombre: 'Clima', externalId: 'cat-compras-clima' },
  { nombre: 'Varios', externalId: 'cat-compras-varios' },
  { nombre: 'Decoración', externalId: 'cat-compras-decoracion' },
  { nombre: 'Escritorio', externalId: 'cat-compras-escritorio' },
  { nombre: 'PC', externalId: 'cat-compras-pc' },
  { nombre: 'Conectividad', externalId: 'cat-compras-conectividad' },
  { nombre: 'Agua', externalId: 'cat-compras-agua' },
  { nombre: 'Mantenimiento', externalId: 'cat-compras-mantenimiento' },
  { nombre: 'Eficiencia', externalId: 'cat-compras-eficiencia' },
  { nombre: 'Living', externalId: 'cat-compras-living' },
  { nombre: 'Textiles', externalId: 'cat-compras-textiles' },
  { nombre: 'En pausa', externalId: 'cat-compras-en-pausa' },
];
