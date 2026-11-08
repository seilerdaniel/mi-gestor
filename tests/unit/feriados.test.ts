import { afterEach, describe, expect, it, vi } from 'vitest';
import { FERIADOS_2025, FERIADOS_2026 } from '../../scripts/seed/feriados.js';
import {
  advertirAnioSinFeriados,
  cuartoDiaHabil,
  esDiaHabil,
  esFinDeSemana,
} from '../../modules/comunes/fechas.js';

const feriados = new Set(FERIADOS_2025.map((feriado) => feriado.fecha));
const feriados2026 = new Set(FERIADOS_2026.map((feriado) => feriado.fecha));

describe('esDiaHabil', () => {
  it('excluye fines de semana', () => {
    expect(esFinDeSemana('2025-05-03')).toBe(true);
    expect(esFinDeSemana('2025-05-05')).toBe(false);
  });

  it('excluye feriados y puentes', () => {
    expect(esDiaHabil('2025-05-01', feriados)).toBe(false);
    expect(esDiaHabil('2025-05-02', feriados)).toBe(false);
    expect(esDiaHabil('2025-05-05', feriados)).toBe(true);
  });
});

describe('cuartoDiaHabil', () => {
  it('calcula la primera quincena de enero 2025', () => {
    // 1/1 feriado, 2 y 3 hábiles, 6 y 7 hábiles => 7/1
    expect(cuartoDiaHabil(2025, 1, 1, feriados)).toBe('2025-01-07');
  });

  it('salta el feriado y el puente de mayo 2025', () => {
    // 1/5 feriado, 2/5 puente, 5,6,7,8 hábiles => 8/5
    expect(cuartoDiaHabil(2025, 5, 1, feriados)).toBe('2025-05-08');
  });

  it('calcula la segunda quincena', () => {
    expect(cuartoDiaHabil(2025, 5, 2, feriados)).toBe('2025-05-21');
  });
});

describe('cuartoDiaHabil con feriados 2026', () => {
  it('noviembre 2026 Q2 da 19 con y sin feriados', () => {
    // Ningún feriado cae entre el 16 y el 19 de noviembre: el resultado no cambia.
    expect(cuartoDiaHabil(2026, 11, 2, new Set())).toBe('2026-11-19');
    expect(cuartoDiaHabil(2026, 11, 2, feriados2026)).toBe('2026-11-19');
  });

  it('abril 2026 Q1 corre el 4° hábil de 06 a 08 por Malvinas y Viernes Santo', () => {
    expect(cuartoDiaHabil(2026, 4, 1, new Set())).toBe('2026-04-06');
    expect(cuartoDiaHabil(2026, 4, 1, feriados2026)).toBe('2026-04-08');
  });

  it('2026 excluye no laborables religiosos y feriados locales', () => {
    expect(feriados2026.has('2026-03-20')).toBe(false); // Ramadán
    expect(feriados2026.has('2026-11-10')).toBe(false); // local CABA + Córdoba
    expect(feriados2026.has('2026-11-11')).toBe(false); // local PBA
    expect(feriados2026.has('2026-11-09')).toBe(true); // nacional, DNU 1103/2026
  });
});

describe('advertirAnioSinFeriados', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('emite un único warning por año faltante', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    advertirAnioSinFeriados(2099, feriados);
    advertirAnioSinFeriados(2099, feriados);
    expect(warn).toHaveBeenCalledTimes(1);
  });
});
