export type FeriadoSeed = {
  fecha: string;
  descripcion: string;
  externalId: string;
};

/**
 * Feriados nacionales 2025 verificados contra la API pública argentinadatos.com.
 * Incluye inamovibles, trasladables y puentes turísticos.
 *
 * TODO: el Jueves Santo (2025-04-17) es "no laborable" pero no feriado nacional;
 * la fuente no lo lista. Verificar si debe afectar el cálculo de días hábiles.
 */
export const FERIADOS_2025: readonly FeriadoSeed[] = [
  { fecha: '2025-01-01', descripcion: 'Año nuevo', externalId: 'feriado-2025-01-01' },
  { fecha: '2025-03-03', descripcion: 'Carnaval', externalId: 'feriado-2025-03-03' },
  { fecha: '2025-03-04', descripcion: 'Carnaval', externalId: 'feriado-2025-03-04' },
  {
    fecha: '2025-03-24',
    descripcion: 'Día Nacional de la Memoria por la Verdad y la Justicia',
    externalId: 'feriado-2025-03-24',
  },
  {
    fecha: '2025-04-02',
    descripcion: 'Día del Veterano y de los Caídos en la Guerra de Malvinas',
    externalId: 'feriado-2025-04-02',
  },
  { fecha: '2025-04-18', descripcion: 'Viernes Santo', externalId: 'feriado-2025-04-18' },
  { fecha: '2025-05-01', descripcion: 'Día del Trabajador', externalId: 'feriado-2025-05-01' },
  {
    fecha: '2025-05-02',
    descripcion: 'Puente turístico no laborable',
    externalId: 'feriado-2025-05-02',
  },
  {
    fecha: '2025-05-25',
    descripcion: 'Día de la Revolución de Mayo',
    externalId: 'feriado-2025-05-25',
  },
  {
    fecha: '2025-06-16',
    descripcion: 'Paso a la Inmortalidad del General Martín Güemes',
    externalId: 'feriado-2025-06-16',
  },
  {
    fecha: '2025-06-20',
    descripcion: 'Paso a la Inmortalidad del General Manuel Belgrano',
    externalId: 'feriado-2025-06-20',
  },
  { fecha: '2025-07-09', descripcion: 'Día de la Independencia', externalId: 'feriado-2025-07-09' },
  {
    fecha: '2025-08-15',
    descripcion: 'Puente turístico no laborable',
    externalId: 'feriado-2025-08-15',
  },
  {
    fecha: '2025-08-17',
    descripcion: 'Paso a la Inmortalidad del Gral. José de San Martín',
    externalId: 'feriado-2025-08-17',
  },
  {
    fecha: '2025-10-10',
    descripcion: 'Puente turístico no laborable',
    externalId: 'feriado-2025-10-10',
  },
  {
    fecha: '2025-10-12',
    descripcion: 'Día del Respeto a la Diversidad Cultural',
    externalId: 'feriado-2025-10-12',
  },
  {
    fecha: '2025-11-21',
    descripcion: 'Puente turístico no laborable',
    externalId: 'feriado-2025-11-21',
  },
  {
    fecha: '2025-11-24',
    descripcion: 'Día de la Soberanía Nacional',
    externalId: 'feriado-2025-11-24',
  },
  {
    fecha: '2025-12-08',
    descripcion: 'Día de la Inmaculada Concepción de María',
    externalId: 'feriado-2025-12-08',
  },
  { fecha: '2025-12-25', descripcion: 'Navidad', externalId: 'feriado-2025-12-25' },
];

/**
 * Feriados nacionales 2026.
 *
 * Fuente: https://www.argentina.gob.ar/sites/default/files/holidays-2026-es.json
 * (Ministerio del Interior, dateModified 2026-10-02).
 * Base legal: Ley 27.399, Decreto 614/2025 (traslados), Resolución 164/2025 (turísticos),
 * Decreto 1103/2026 (visita papal).
 *
 * Criterio: solo días no laborables en todo el territorio nacional (inamovibles, trasladables
 * y turísticos). Quedan fuera los "días no laborables" religiosos (arts. 2 y 3, Ley 27.399)
 * y los feriados de alcance territorial limitado (arts. 3 y 4, DNU 1103/2026), porque no
 * cierran la actividad bancaria en todo el país.
 *
 * Pendientes: ninguno. Los 20 registros están confirmados por la fuente oficial.
 */
export const FERIADOS_2026: readonly FeriadoSeed[] = [
  { fecha: '2026-01-01', descripcion: 'Año Nuevo', externalId: 'feriado-2026-01-01' },
  { fecha: '2026-02-16', descripcion: 'Carnaval', externalId: 'feriado-2026-02-16' },
  { fecha: '2026-02-17', descripcion: 'Carnaval', externalId: 'feriado-2026-02-17' },
  {
    fecha: '2026-03-23',
    descripcion: 'Día no laborable con fines turísticos',
    externalId: 'feriado-2026-03-23',
  },
  {
    fecha: '2026-03-24',
    descripcion: 'Día Nacional de la Memoria por la Verdad y la Justicia',
    externalId: 'feriado-2026-03-24',
  },
  {
    fecha: '2026-04-02',
    descripcion: 'Día del Veterano y de los Caídos en la Guerra de Malvinas',
    externalId: 'feriado-2026-04-02',
  },
  { fecha: '2026-04-03', descripcion: 'Viernes Santo', externalId: 'feriado-2026-04-03' },
  { fecha: '2026-05-01', descripcion: 'Día del Trabajador', externalId: 'feriado-2026-05-01' },
  {
    fecha: '2026-05-25',
    descripcion: 'Día de la Revolución de Mayo',
    externalId: 'feriado-2026-05-25',
  },
  {
    fecha: '2026-06-15',
    descripcion: 'Paso a la Inmortalidad del Gral. Don Martín Miguel de Güemes (17/6)',
    externalId: 'feriado-2026-06-15',
  },
  {
    fecha: '2026-06-20',
    descripcion: 'Paso a la Inmortalidad del Gral. Manuel Belgrano',
    externalId: 'feriado-2026-06-20',
  },
  { fecha: '2026-07-09', descripcion: 'Día de la Independencia', externalId: 'feriado-2026-07-09' },
  {
    fecha: '2026-07-10',
    descripcion: 'Día no laborable con fines turísticos',
    externalId: 'feriado-2026-07-10',
  },
  {
    fecha: '2026-08-17',
    descripcion: 'Paso a la Inmortalidad del Gral. José de San Martín',
    externalId: 'feriado-2026-08-17',
  },
  {
    fecha: '2026-10-12',
    descripcion: 'Día del Respeto a la Diversidad Cultural',
    externalId: 'feriado-2026-10-12',
  },
  {
    fecha: '2026-11-09',
    descripcion: 'Visita de Su Santidad el Papa León XIV',
    externalId: 'feriado-2026-11-09',
  },
  {
    fecha: '2026-11-23',
    descripcion: 'Día de la Soberanía Nacional (20/11)',
    externalId: 'feriado-2026-11-23',
  },
  {
    fecha: '2026-12-07',
    descripcion: 'Día no laborable con fines turísticos',
    externalId: 'feriado-2026-12-07',
  },
  {
    fecha: '2026-12-08',
    descripcion: 'Inmaculada Concepción de María',
    externalId: 'feriado-2026-12-08',
  },
  { fecha: '2026-12-25', descripcion: 'Navidad', externalId: 'feriado-2026-12-25' },
];

/** Todos los feriados cargados, ordenados por año. */
export const FERIADOS: readonly FeriadoSeed[] = [...FERIADOS_2025, ...FERIADOS_2026];
