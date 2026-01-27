import { describe, it, expect } from 'vitest';
import { calculateBMI, getBMICategory } from '../bmi';

describe('BMI Utils', () => {
  describe('calculateBMI', () => {
    it('deve calcular IMC corretamente', () => {
      expect(calculateBMI(70, 170)).toBe('24.2');
      expect(calculateBMI(80, 180)).toBe('24.7');
      expect(calculateBMI(60, 160)).toBe('23.4');
    });

    it('deve retornar null quando peso ou altura não fornecidos', () => {
      expect(calculateBMI(null, 170)).toBeNull();
      expect(calculateBMI(70, null)).toBeNull();
      expect(calculateBMI(0, 170)).toBeNull();
      expect(calculateBMI(70, 0)).toBeNull();
    });

    it('deve retornar string formatada com 1 casa decimal', () => {
      const bmi = calculateBMI(70, 170);
      expect(typeof bmi).toBe('string');
      expect(bmi.split('.')[1]?.length).toBeLessThanOrEqual(1);
    });
  });

  describe('getBMICategory', () => {
    it('deve classificar IMC abaixo do peso', () => {
      expect(getBMICategory('18.0')).toBe('Abaixo do peso');
      expect(getBMICategory(17.5)).toBe('Abaixo do peso');
    });

    it('deve classificar IMC normal', () => {
      expect(getBMICategory('22.0')).toBe('Peso normal');
      expect(getBMICategory(24.0)).toBe('Peso normal');
    });

    it('deve classificar IMC sobrepeso', () => {
      expect(getBMICategory('27.0')).toBe('Sobrepeso');
      expect(getBMICategory(29.0)).toBe('Sobrepeso');
    });

    it('deve classificar IMC obesidade', () => {
      expect(getBMICategory('30.0')).toBe('Obesidade');
      expect(getBMICategory(35.0)).toBe('Obesidade');
    });

    it('deve retornar string vazia quando IMC inválido', () => {
      expect(getBMICategory(null)).toBe('');
      expect(getBMICategory('')).toBe('');
      expect(getBMICategory(undefined)).toBe('');
    });
  });
});
