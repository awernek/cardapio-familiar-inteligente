import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { checkRateLimit, startCleanup, stopCleanup, getStats, getMetrics, detectClientIp } from '../rateLimiter.js';
import { RATE_LIMIT } from '../../config/constants.js';

describe('rateLimiter', () => {
  beforeEach(() => {
    // Limpar intervalos antes de cada teste
    stopCleanup();
  });

  afterEach(() => {
    // Limpar intervalos após cada teste
    stopCleanup();
  });

  describe('checkRateLimit', () => {
    it('deve permitir primeira requisição de um IP', () => {
      const result = checkRateLimit('192.168.1.1');
      
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(RATE_LIMIT.MAX_REQUESTS - 1);
    });

    it('deve incrementar contador em requisições subsequentes', () => {
      const ip = '192.168.1.2';
      
      checkRateLimit(ip);
      const result = checkRateLimit(ip);
      
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(RATE_LIMIT.MAX_REQUESTS - 2);
    });

    it('deve bloquear após exceder limite', () => {
      const ip = '192.168.1.3';
      
      // Fazer requisições até o limite
      for (let i = 0; i < RATE_LIMIT.MAX_REQUESTS; i++) {
        checkRateLimit(ip);
      }
      
      // Próxima requisição deve ser bloqueada
      const result = checkRateLimit(ip);
      
      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
      expect(result.resetAt).toBeDefined();
    });

    it('deve resetar após expirar janela de tempo', () => {
      const ip = '192.168.1.4';
      
      // Fazer requisições até o limite
      for (let i = 0; i < RATE_LIMIT.MAX_REQUESTS; i++) {
        checkRateLimit(ip);
      }
      
      // Simular passagem do tempo
      vi.useFakeTimers();
      vi.advanceTimersByTime(RATE_LIMIT.WINDOW_MS + 1000);
      
      const result = checkRateLimit(ip);
      
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(RATE_LIMIT.MAX_REQUESTS - 1);
      
      vi.useRealTimers();
    });
  });

  describe('startCleanup e stopCleanup', () => {
    it('deve iniciar limpeza automática', () => {
      expect(() => startCleanup()).not.toThrow();
    });

    it('deve parar limpeza automática', () => {
      startCleanup();
      expect(() => stopCleanup()).not.toThrow();
    });
  });

  describe('getStats', () => {
    it('deve retornar estatísticas corretas', () => {
      const ip1 = '192.168.1.10';
      const ip2 = '192.168.1.11';
      
      checkRateLimit(ip1);
      checkRateLimit(ip2);
      
      const stats = getStats();
      
      expect(stats.totalIps).toBeGreaterThanOrEqual(2);
      expect(stats.activeRecords).toBeGreaterThanOrEqual(2);
    });
  });

  describe('getMetrics', () => {
    it('deve retornar métricas detalhadas', () => {
      const ip = '192.168.1.20';
      
      checkRateLimit(ip);
      const metrics = getMetrics();
      
      expect(metrics.totalRequests).toBeGreaterThan(0);
      expect(metrics.uniqueIps).toBeGreaterThan(0);
      expect(metrics).toHaveProperty('blockedRequests');
      expect(metrics).toHaveProperty('currentlyBlocked');
      expect(metrics).toHaveProperty('blockRate');
    });

    it('deve rastrear requisições bloqueadas', () => {
      const ip = '192.168.1.30';
      
      // Fazer requisições até o limite
      for (let i = 0; i < RATE_LIMIT.MAX_REQUESTS; i++) {
        checkRateLimit(ip);
      }
      
      // Próxima deve ser bloqueada
      checkRateLimit(ip);
      
      const metrics = getMetrics();
      expect(metrics.blockedRequests).toBeGreaterThan(0);
      expect(metrics.currentlyBlocked).toBeGreaterThan(0);
    });
  });

  describe('detectClientIp', () => {
    it('deve usar X-Forwarded-For quando disponível', () => {
      const req = {
        headers: {
          'x-forwarded-for': '192.168.1.100, 10.0.0.1',
        },
        ip: '10.0.0.1',
      };
      
      const ip = detectClientIp(req);
      expect(ip).toBe('192.168.1.100');
    });

    it('deve usar X-Real-IP quando X-Forwarded-For não está disponível', () => {
      const req = {
        headers: {
          'x-real-ip': '192.168.1.200',
        },
        ip: '10.0.0.1',
      };
      
      const ip = detectClientIp(req);
      expect(ip).toBe('192.168.1.200');
    });

    it('deve usar req.ip como fallback', () => {
      const req = {
        headers: {},
        ip: '192.168.1.300',
      };
      
      const ip = detectClientIp(req);
      expect(ip).toBe('192.168.1.300');
    });

    it('deve usar connection.remoteAddress como último recurso', () => {
      const req = {
        headers: {},
        connection: {
          remoteAddress: '192.168.1.400',
        },
      };
      
      const ip = detectClientIp(req);
      expect(ip).toBe('192.168.1.400');
    });

    it('deve retornar "unknown" se nenhum IP disponível', () => {
      const req = {
        headers: {},
      };
      
      const ip = detectClientIp(req);
      expect(ip).toBe('unknown');
    });

    it('deve ignorar "unknown" em X-Forwarded-For', () => {
      const req = {
        headers: {
          'x-forwarded-for': 'unknown, 192.168.1.500',
        },
        ip: '10.0.0.1',
      };
      
      const ip = detectClientIp(req);
      // Deve usar o próximo IP disponível ou fallback
      expect(ip).not.toBe('unknown');
    });
  });
});
