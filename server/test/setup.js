/**
 * Setup global para testes do servidor
 */

import { vi } from 'vitest';

// Mock do logger para não poluir os logs durante testes
vi.mock('../utils/logger.js', () => ({
  logger: {
    log: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
    isDev: () => true,
    isProd: () => false,
  },
}));

// Limpar mocks antes de cada teste
beforeEach(() => {
  vi.clearAllMocks();
});
