import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useMenuGeneration } from '../useMenuGeneration';

// Mock do módulo promptBuilder
vi.mock('../../utils/promptBuilder', () => ({
  buildPrompt: vi.fn(() => 'Mock prompt'),
  calculateBMI: vi.fn((w, h) => w && h ? '24.0' : null),
}));

// Mock do menuLogic
vi.mock('../../utils/menuLogic', () => ({
  generateWeeklyPriorities: vi.fn(() => ['Prioridade 1']),
  generateInsights: vi.fn(() => [{ name: 'João', insights: ['Insight 1'] }]),
}));

// Mock do logger
vi.mock('../../utils/logger', () => ({
  logger: {
    log: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock do errorHandler
vi.mock('../../utils/errorHandler', () => ({
  errorHandler: {
    handleError: vi.fn((err) => ({ message: err.message, originalError: err })),
    handleApiError: vi.fn(async (response) => {
      const error = new Error('API Error');
      error.status = response.status;
      return { message: 'API Error', originalError: error };
    }),
  },
}));

// Mock global do fetch
global.fetch = vi.fn();

describe('useMenuGeneration Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve inicializar com loading false e error null', () => {
    const { result } = renderHook(() => useMenuGeneration());
    
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('deve gerar cardápio com sucesso', async () => {
    const mockMenuData = {
      days: [{ day: 'Segunda-feira', breakfast: { base: 'Café' } }],
      shoppingList: { frutas_vegetais: ['banana'] },
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockMenuData,
    });

    const { result } = renderHook(() => useMenuGeneration());

    const profiles = [{ id: 1, name: 'João', weight: 70, height: 170 }];
    const individualAnswers = { 1: {} };
    const weeklyContext = { busy: 'normal' };

    let menuResult;
    await act(async () => {
      menuResult = await result.current.generateMenu(profiles, individualAnswers, weeklyContext);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(menuResult).toEqual(mockMenuData);
    expect(result.current.error).toBeNull();
    expect(global.fetch).toHaveBeenCalled();
  });

  it('deve definir loading como true durante geração', async () => {
    let resolveFetch;
    const fetchPromise = new Promise((resolve) => {
      resolveFetch = resolve;
    });

    global.fetch.mockReturnValueOnce(fetchPromise);

    const { result } = renderHook(() => useMenuGeneration());

    const profiles = [{ id: 1, name: 'João', weight: 70, height: 170 }];
    const individualAnswers = { 1: {} };
    const weeklyContext = { busy: 'normal' };

    act(() => {
      result.current.generateMenu(profiles, individualAnswers, weeklyContext);
    });

    // Deve estar carregando
    expect(result.current.loading).toBe(true);

    // Resolve o fetch
    await act(async () => {
      resolveFetch({
        ok: true,
        status: 200,
        json: async () => ({ days: [] }),
      });
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it('deve tratar erro de API corretamente', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: async () => ({ error: 'Server error' }),
    });

    const { result } = renderHook(() => useMenuGeneration());

    const profiles = [{ id: 1, name: 'João', weight: 70, height: 170 }];
    const individualAnswers = { 1: {} };
    const weeklyContext = { busy: 'normal' };

    await act(async () => {
      try {
        await result.current.generateMenu(profiles, individualAnswers, weeklyContext);
      } catch (err) {
        // Erro esperado
      }
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
  });

  it('deve tratar erro de rede corretamente', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useMenuGeneration());

    const profiles = [{ id: 1, name: 'João', weight: 70, height: 170 }];
    const individualAnswers = { 1: {} };
    const weeklyContext = { busy: 'normal' };

    await act(async () => {
      try {
        await result.current.generateMenu(profiles, individualAnswers, weeklyContext);
      } catch (err) {
        // Erro esperado
      }
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
  });

  it('deve limpar erro anterior em nova tentativa', async () => {
    // Primeira chamada com erro
    global.fetch.mockRejectedValueOnce(new Error('First error'));

    const { result } = renderHook(() => useMenuGeneration());

    const profiles = [{ id: 1, name: 'João', weight: 70, height: 170 }];
    const individualAnswers = { 1: {} };
    const weeklyContext = { busy: 'normal' };

    await act(async () => {
      try {
        await result.current.generateMenu(profiles, individualAnswers, weeklyContext);
      } catch (err) {
        // Erro esperado
      }
    });

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });

    // Segunda chamada com sucesso
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ days: [] }),
    });

    await act(async () => {
      await result.current.generateMenu(profiles, individualAnswers, weeklyContext);
    });

    await waitFor(() => {
      expect(result.current.error).toBeNull();
    });
  });
});
