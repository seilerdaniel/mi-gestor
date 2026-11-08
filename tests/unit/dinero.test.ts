import { describe, expect, it } from 'vitest';
import {
  formatearCentavos,
  parsearMontoACentavos,
  sumarCentavos,
} from '../../modules/comunes/dinero.js';

describe('parsearMontoACentavos', () => {
  it('parsea formato argentino con miles y decimales', () => {
    expect(parsearMontoACentavos('1.234,56')).toBe(123_456);
    expect(parsearMontoACentavos('700.000')).toBe(70_000_000);
    expect(parsearMontoACentavos('149.500')).toBe(14_950_000);
  });

  it('parsea enteros sin separador de miles', () => {
    expect(parsearMontoACentavos('150000')).toBe(15_000_000);
    expect(parsearMontoACentavos('0,5')).toBe(50);
  });

  it('acepta negativos', () => {
    expect(parsearMontoACentavos('-45.000')).toBe(-4_500_000);
  });

  it('rechaza formatos ambiguos o inválidos', () => {
    expect(() => parsearMontoACentavos('1.23')).toThrow();
    expect(() => parsearMontoACentavos('1,234')).toThrow();
    expect(() => parsearMontoACentavos('abc')).toThrow();
    expect(() => parsearMontoACentavos('')).toThrow();
  });
});

describe('formatearCentavos', () => {
  it('formatea sin aritmética flotante', () => {
    expect(formatearCentavos(123_456)).toBe('$ 1.234,56');
    expect(formatearCentavos(70_000_000)).toBe('$ 700.000,00');
    expect(formatearCentavos(-4_500_000)).toBe('-$ 45.000,00');
    expect(formatearCentavos(5)).toBe('$ 0,05');
  });
});

describe('sumarCentavos', () => {
  it('suma enteros', () => {
    expect(sumarCentavos(100, 250, -50)).toBe(300);
  });

  it('rechaza resultados fuera de rango seguro', () => {
    expect(() => sumarCentavos(Number.MAX_SAFE_INTEGER, 1)).toThrow();
  });
});
