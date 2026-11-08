import { formatInTimeZone } from 'date-fns-tz';
import { ZONA_ARGENTINA } from './quincena.js';

export function hoyISO(instante: Date = new Date()): string {
  return formatInTimeZone(instante, ZONA_ARGENTINA, 'yyyy-MM-dd');
}

export function esFinDeSemana(fechaISO: string): boolean {
  const dia = new Date(`${fechaISO}T12:00:00Z`).getUTCDay();
  return dia === 0 || dia === 6;
}

export function esDiaHabil(fechaISO: string, feriados: ReadonlySet<string>): boolean {
  return !esFinDeSemana(fechaISO) && !feriados.has(fechaISO);
}

/**
 * Devuelve el 4° día hábil de la quincena indicada.
 * `quincena` 1 arranca el día 1; `quincena` 2 arranca el día 16.
 */
export function cuartoDiaHabil(
  anio: number,
  mes: number,
  quincena: 1 | 2,
  feriados: ReadonlySet<string>,
): string {
  let dia = quincena === 1 ? 1 : 16;
  let habiles = 0;

  while (dia <= 31) {
    const fecha = `${anio}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    const fechaDate = new Date(`${fecha}T12:00:00Z`);
    if (fechaDate.getUTCMonth() + 1 !== mes) break;

    if (esDiaHabil(fecha, feriados)) {
      habiles += 1;
      if (habiles === 4) return fecha;
    }

    dia += 1;
  }

  throw new Error(`No se encontró el 4° día hábil para ${anio}-${mes} Q${quincena}`);
}

const aniosAdvertidos = new Set<number>();

/**
 * Emite un único warning por año sin datos de feriados.
 */
export function advertirAnioSinFeriados(anio: number, feriados: ReadonlySet<string>): void {
  const tieneFeriados = [...feriados].some((fecha) => fecha.startsWith(`${anio}-`));
  if (!tieneFeriados && !aniosAdvertidos.has(anio)) {
    aniosAdvertidos.add(anio);
    console.warn(`[feriados] Sin datos para ${anio}; se usa fallback lunes-viernes.`);
  }
}
