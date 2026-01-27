import { describe, it, expect, beforeEach, vi } from 'vitest';
import { generateMenuWithAnthropic } from '../anthropicService.js';

// Mock global do fetch
global.fetch = vi.fn();

describe('anthropicService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve gerar cardápio com sucesso', async () => {
    const mockResponse = {
      content: [{
        text: '{"days": [{"day": "Segunda-feira", "meals": {}}]}'
      }]
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await generateMenuWithAnthropic('Gere um cardápio', 'test-key');

    expect(result).toHaveProperty('days');
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('deve lançar erro quando API retorna erro', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      json: async () => ({ error: { message: 'Invalid API key' } }),
    });

    await expect(
      generateMenuWithAnthropic('Gere um cardápio', 'invalid-key')
    ).rejects.toThrow();
  });

  it('deve lançar erro quando resposta não tem conteúdo', async () => {
    const mockResponse = {
      content: [] // Sem conteúdo
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    await expect(
      generateMenuWithAnthropic('Gere um cardápio', 'test-key')
    ).rejects.toThrow('conteúdo válido');
  });
});
