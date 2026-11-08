import { describe, expect, it } from 'vitest';
import {
  calcularQuincena,
  calcularQuincenaDeInstante,
} from '../../modules/comunes/quincena.js';

describe('calcularQuincena', () => {
  it('corta el día 15/16', () => {
    expect(calcularQuincena('2026-11-15')).toBe('2026-Q1');
    expect(calcularQuincena('2026-11-16')).toBe('2026-Q2');
    expect(calcularQuincena('2026-11-30')).toBe('2026-Q2');
    expect(calcularQuincena('2026-12-01')).toBe('2026-Q1');
  });

  it('rechaza fechas inválidas', () => {
    expect(() => calcularQuincena('2026-13-01')).toThrow();
    expect(() => calcularQuincena('2026-11')).toThrow();
  });
});

describe('calcularQuincenaDeInstante', () => {
  it('usa la fecha argentina, no UTC', () => {
    // 2026-11-01T02:00Z = 2026-10-31 23:00 en Argentina
    expect(calcularQuincenaDeInstante(new Date('2026-11-01T02:00:00Z'))).toBe('2026-Q2');
    // 2026-11-16T02:00Z = 2026-11-15 23:00 en Argentina
    expect(calcularQuincenaDeInstante(new Date('2026-11-16T02:00:00Z'))).toBe('2026-Q1');
  });
});
