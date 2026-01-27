import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useGamification } from '../useGamification';
import * as storage from '../../utils/storage';

// Mock do módulo storage
vi.mock('../../utils/storage', () => ({
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

describe('useGamification Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    storage.getStorageItem.mockResolvedValue(null);
  });

  it('deve inicializar com stats padrão', () => {
    const { result } = renderHook(() => useGamification());
    
    expect(result.current.stats).toHaveProperty('menusGenerated', 0);
    expect(result.current.stats).toHaveProperty('weeksUsed', 0);
    expect(result.current.stats).toHaveProperty('maxProfiles', 0);
    expect(result.current.newAchievement).toBeNull();
  });

  it('deve rastrear cardápio gerado', async () => {
    const { result } = renderHook(() => useGamification());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.trackMenuGenerated();
    });

    expect(result.current.stats.menusGenerated).toBe(1);
    expect(storage.setStorageItem).toHaveBeenCalled();
  });

  it('deve rastrear contagem de perfis', async () => {
    const { result } = renderHook(() => useGamification());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.trackProfilesCount(3);
    });

    expect(result.current.stats.maxProfiles).toBe(3);
  });

  it('deve atualizar maxProfiles apenas se for maior', async () => {
    const { result } = renderHook(() => useGamification());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.trackProfilesCount(5);
    });

    expect(result.current.stats.maxProfiles).toBe(5);

    await act(async () => {
      await result.current.trackProfilesCount(3);
    });

    // Deve manter 5, não diminuir para 3
    expect(result.current.stats.maxProfiles).toBe(5);
  });

  it('deve rastrear uso de lista de compras', async () => {
    const { result } = renderHook(() => useGamification());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.trackShoppingListUsed();
    });

    expect(result.current.stats.shoppingListUsed).toBe(1);
  });

  it('deve desbloquear conquista quando condição for atendida', async () => {
    const { result } = renderHook(() => useGamification());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Primeiro cardápio deve desbloquear "Primeiro Passo"
    await act(async () => {
      await result.current.trackMenuGenerated();
    });

    await waitFor(() => {
      expect(result.current.newAchievement).toBeTruthy();
    });

    expect(result.current.newAchievement.id).toBe('firstMenu');
  });

  it('deve descartar notificação de conquista', async () => {
    const { result } = renderHook(() => useGamification());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.trackMenuGenerated();
    });

    await waitFor(() => {
      expect(result.current.newAchievement).toBeTruthy();
    });

    act(() => {
      result.current.dismissAchievement();
    });

    expect(result.current.newAchievement).toBeNull();
  });

  it('deve retornar missões corretamente', async () => {
    const { result } = renderHook(() => useGamification());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const missions = result.current.getMissions();
    
    expect(missions).toBeInstanceOf(Array);
    expect(missions.length).toBeGreaterThan(0);
    expect(missions[0]).toHaveProperty('id');
    expect(missions[0]).toHaveProperty('title');
  });

  it('deve retornar conquistas corretamente', async () => {
    const { result } = renderHook(() => useGamification());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const achievements = result.current.getAchievements();
    
    expect(achievements).toBeInstanceOf(Array);
    expect(achievements.length).toBeGreaterThan(0);
    expect(achievements[0]).toHaveProperty('id');
    expect(achievements[0]).toHaveProperty('title');
  });

  it('deve retornar nível corretamente', async () => {
    const { result } = renderHook(() => useGamification());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const level = result.current.getLevel();
    
    expect(level).toHaveProperty('level');
    expect(level).toHaveProperty('title');
    expect(level).toHaveProperty('icon');
  });
});
