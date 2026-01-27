import { defineConfig } from 'vitest/config';

/**
 * Configuração do Vitest para o servidor
 */
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: './test/setup.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'test/',
        '**/*.config.js',
        '**/*.test.js',
        '**/__tests__/**',
        'index.js', // Entry point não precisa de cobertura
      ],
    },
  },
});
