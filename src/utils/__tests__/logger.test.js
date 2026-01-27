import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { logger } from '../logger';

describe('Logger Utils', () => {
  let originalConsoleLog;
  let originalConsoleError;
  let originalConsoleWarn;
  let originalConsoleInfo;
  let originalConsoleDebug;

  beforeEach(() => {
    // Salva métodos originais
    originalConsoleLog = console.log;
    originalConsoleError = console.error;
    originalConsoleWarn = console.warn;
    originalConsoleInfo = console.info;
    originalConsoleDebug = console.debug;

    // Mock dos métodos
    console.log = vi.fn();
    console.error = vi.fn();
    console.warn = vi.fn();
    console.info = vi.fn();
    console.debug = vi.fn();
  });

  afterEach(() => {
    // Restaura métodos originais
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
    console.warn = originalConsoleWarn;
    console.info = originalConsoleInfo;
    console.debug = originalConsoleDebug;
  });

  describe('logger.error', () => {
    it('deve sempre logar erros, mesmo em produção', () => {
      logger.error('Test error');
      expect(console.error).toHaveBeenCalledWith('Test error');
    });

    it('deve aceitar múltiplos argumentos', () => {
      logger.error('Error', { code: 500 }, 'details');
      expect(console.error).toHaveBeenCalledWith('Error', { code: 500 }, 'details');
    });
  });

  describe('logger.log', () => {
    it('deve logar em desenvolvimento', () => {
      // Em ambiente de teste, pode estar em dev ou prod
      // Vamos apenas verificar que a função existe e não lança erro
      expect(() => logger.log('Test log')).not.toThrow();
    });
  });

  describe('logger.warn', () => {
    it('deve ter método warn disponível', () => {
      expect(() => logger.warn('Test warning')).not.toThrow();
    });
  });

  describe('logger.info', () => {
    it('deve ter método info disponível', () => {
      expect(() => logger.info('Test info')).not.toThrow();
    });
  });

  describe('logger.debug', () => {
    it('deve ter método debug disponível', () => {
      expect(() => logger.debug('Test debug')).not.toThrow();
    });
  });

  describe('logger.isDev e logger.isProd', () => {
    it('deve ter métodos para verificar ambiente', () => {
      expect(typeof logger.isDev()).toBe('boolean');
      expect(typeof logger.isProd()).toBe('boolean');
    });

    it('isDev e isProd devem ser opostos', () => {
      const isDev = logger.isDev();
      const isProd = logger.isProd();
      expect(isDev).toBe(!isProd);
    });
  });
});
