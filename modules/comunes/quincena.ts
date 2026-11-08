import { formatInTimeZone } from 'date-fns-tz';

export const ZONA_ARGENTINA = 'America/Argentina/Buenos_Aires';

export type Quincena = `${number}-Q1` | `${number}-Q2`;

/**
 * Deriva la quincena desde una fecha de calendario argentina (YYYY-MM-DD).
 * Días 1-15 => Q1. Días 16-fin de mes => Q2.
 */
export function calcularQuincena(fechaISO: string): Quincena {
  const partes = fechaISO.split('-');
  if (partes.length !== 3) throw new Error(`Fecha inválida: "${fechaISO}"`);

  const [anioTexto, mesTexto, diaTexto] = partes;
  const anio = Number(anioTexto);
  const mes = Number(mesTexto);
  const dia = Number(diaTexto);

  if (
    !Number.isInteger(anio) ||
    !Number.isInteger(mes) ||
    mes < 1 ||
    mes > 12 ||
    !Number.isInteger(dia) ||
    dia < 1 ||
    dia > 31
  ) {
    throw new Error(`Fecha inválida: "${fechaISO}"`);
  }

  return `${anio}-Q${dia <= 15 ? 1 : 2}` as Quincena;
}

/**
 * Deriva la quincena de un instante, calculando primero la fecha en hora argentina.
 */
export function calcularQuincenaDeInstante(instante: Date): Quincena {
  const fechaLocal = formatInTimeZone(instante, ZONA_ARGENTINA, 'yyyy-MM-dd');
  return calcularQuincena(fechaLocal);
}
