import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useHistory } from '../useHistory';
import * as storage from '../../utils/storage';

// Mock do módulo storage
vi.mock('../../utils/storage', () => ({
  listStorageKeys: vi.fn(),
  getStorageItem: vi.fn(),
  setStorageItem: vi.fn(),
}));

// Mock do logger
vi.mock('../../utils/logger', () => ({
  logger: {
    log: vi.fn(),
    error: vi.fn(),
  },
}));

describe('useHistory Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve inicializar com loading true e histórico vazio', () => {
    storage.listStorageKeys.mockResolvedValue([]);
    
    const { result } = renderHook(() => useHistory());
    
    expect(result.current.loading).toBe(true);
    expect(result.current.weekHistory).toEqual([]);
  });

  it('deve carregar histórico do storage', async () => {
    const mockHistoryData = [
      { date: '2026-01-20T00:00:00.000Z', dateLabel: '20/01/2026', profiles: [] },
      { date: '2026-01-27T00:00:00.000Z', dateLabel: '27/01/2026', profiles: [] },
    ];

    storage.listStorageKeys.mockResolvedValue(['week-history:1', 'week-history:2']);
    storage.getStorageItem
      .mockResolvedValueOnce(mockHistoryData[0])
      .mockResolvedValueOnce(mockHistoryData[1]);

    const { result } = renderHook(() => useHistory());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.weekHistory.length).toBe(2);
    expect(storage.listStorageKeys).toHaveBeenCalledWith('week-history:');
  });

  it('deve limitar histórico a 4 semanas mais recentes', async () => {
    const keys = Array.from({ length: 6 }, (_, i) => `week-history:${i}`);
    storage.listStorageKeys.mockResolvedValue(keys);
    storage.getStorageItem.mockResolvedValue({ date: '2026-01-01', profiles: [] });

    const { result } = renderHook(() => useHistory());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Deve pegar apenas as últimas 4
    expect(storage.getStorageItem).toHaveBeenCalledTimes(4);
  });

  it('deve salvar semana no histórico', async () => {
    storage.listStorageKeys.mockResolvedValue([]);
    storage.setStorageItem.mockResolvedValue();
    storage.getStorageItem.mockResolvedValue(null);

    const { result } = renderHook(() => useHistory());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const profiles = [{ id: 1, name: 'João', age: 30, weight: 70 }];
    const individualAnswers = { 1: { stress: 'normal' } };
    const weeklyContext = { busy: 'normal' };
    const generatePriorities = vi.fn(() => ['Prioridade 1']);
    const generateInsights = vi.fn(() => []);

    await result.current.saveWeekToHistory(
      profiles,
      individualAnswers,
      weeklyContext,
      generatePriorities,
      generateInsights
    );

    expect(storage.setStorageItem).toHaveBeenCalled();
    const callArgs = storage.setStorageItem.mock.calls[0];
    expect(callArgs[0]).toMatch(/^week-history:\d+$/);
    expect(callArgs[1]).toHaveProperty('date');
    expect(callArgs[1]).toHaveProperty('profiles');
    expect(callArgs[1].profiles[0].name).toBe('João');
  });

  it('deve ordenar histórico por data (mais recente primeiro)', async () => {
    const older = { date: '2026-01-20T00:00:00.000Z', dateLabel: '20/01/2026', profiles: [] };
    const newer = { date: '2026-01-27T00:00:00.000Z', dateLabel: '27/01/2026', profiles: [] };

    storage.listStorageKeys.mockResolvedValue(['week-history:1', 'week-history:2']);
    storage.getStorageItem
      .mockResolvedValueOnce(older)
      .mockResolvedValueOnce(newer);

    const { result } = renderHook(() => useHistory());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Mais recente deve vir primeiro
    expect(result.current.weekHistory[0].date).toBe(newer.date);
  });

  it('deve lidar com erro ao carregar histórico graciosamente', async () => {
    storage.listStorageKeys.mockRejectedValue(new Error('Storage error'));

    const { result } = renderHook(() => useHistory());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.weekHistory).toEqual([]);
  });
});
