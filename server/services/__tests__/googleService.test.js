import { describe, it, expect, beforeEach, vi } from 'vitest';
import { generateMenuWithGoogle } from '../googleService.js';

// Mock global do fetch
global.fetch = vi.fn();

describe('googleService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve gerar cardápio com primeiro modelo', async () => {
    const mockResponse = {
      candidates: [{
        content: {
          parts: [{
            text: '{"days": [{"day": "Segunda-feira"}]}'
          }]
        }
      }]
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await generateMenuWithGoogle('Gere um cardápio', 'test-key');

    expect(result).toHaveProperty('days');
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('deve fazer fallback para próximo modelo em caso de 404', async () => {
    // Primeiro modelo retorna 404
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ error: { message: 'Model not found' } }),
    });

    // Segundo modelo funciona
    const mockResponse = {
      candidates: [{
        content: {
          parts: [{
            text: '{"days": []}'
          }]
        }
      }]
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await generateMenuWithGoogle('Gere um cardápio', 'test-key');

    expect(result).toHaveProperty('days');
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it('deve fazer fallback para próximo modelo em caso de 429', async () => {
    // Primeiro modelo retorna 429
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 429,
      json: async () => ({ error: { message: 'Rate limit exceeded' } }),
    });

    // Segundo modelo funciona
    const mockResponse = {
      candidates: [{
        content: {
          parts: [{
            text: '{"days": []}'
          }]
        }
      }]
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await generateMenuWithGoogle('Gere um cardápio', 'test-key');

    expect(result).toHaveProperty('days');
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it('deve lançar erro se todos os modelos falharem', async () => {
    // Todos os modelos retornam erro não recuperável
    global.fetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ error: { message: 'Internal error' } }),
    });

    await expect(
      generateMenuWithGoogle('Gere um cardápio', 'test-key')
    ).rejects.toThrow();
  });
});
