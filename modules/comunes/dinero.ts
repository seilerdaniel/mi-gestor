const PATRON_MONTO = /^(?:-?\d{1,3}(?:\.\d{3})*(?:,\d{1,2})?|-?\d+(?:,\d{1,2})?)$/;
const FORMATO_ENTERO = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 });

/**
 * Convierte un monto en formato argentino ("1.234,56") a centavos enteros.
 * Rechaza formatos ambiguos en vez de adivinar.
 */
export function parsearMontoACentavos(texto: string): number {
  const limpio = texto.trim().replace(/\s/g, '');
  if (!PATRON_MONTO.test(limpio)) {
    throw new Error(`Monto inválido: "${texto}"`);
  }

  const negativo = limpio.startsWith('-');
  const sinSigno = negativo ? limpio.slice(1) : limpio;
  const normalizado = sinSigno.replace(/\./g, '').replace(',', '.');
  const [enteroTexto = '0', decimales = ''] = normalizado.split('.');

  const entero = Number(enteroTexto);
  const centavosDecimales = Number(`${decimales}00`.slice(0, 2));
  const total = entero * 100 + centavosDecimales;

  if (!Number.isSafeInteger(total)) {
    throw new Error(`Monto fuera de rango: "${texto}"`);
  }

  return negativo ? -total : total;
}

/**
 * Formatea centavos enteros como moneda argentina, sin aritmética flotante.
 */
export function formatearCentavos(centavos: number): string {
  if (!Number.isSafeInteger(centavos)) {
    throw new Error(`Centavos inválidos: ${centavos}`);
  }

  const signo = centavos < 0 ? '-' : '';
  const absoluto = Math.abs(centavos);
  const entero = Math.floor(absoluto / 100);
  const decimales = String(absoluto % 100).padStart(2, '0');

  return `${signo}$ ${FORMATO_ENTERO.format(entero)},${decimales}`;
}

export function sumarCentavos(...montos: number[]): number {
  const total = montos.reduce((acumulado, monto) => acumulado + monto, 0);
  if (!Number.isSafeInteger(total)) {
    throw new Error('Suma de centavos fuera de rango');
  }
  return total;
}
