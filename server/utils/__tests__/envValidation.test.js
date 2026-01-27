import { describe, it, expect, beforeEach, vi } from 'vitest';
import { validateEnvVars } from '../envValidation.js';

describe('envValidation', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Resetar env antes de cada teste
    process.env = { ...originalEnv };
    vi.clearAllMocks();
  });

  it('deve retornar válido quando há pelo menos uma API key', () => {
    process.env.GROQ_API_KEY = 'test-key';
    
    const result = validateEnvVars();
    
    expect(result.isValid).toBe(true);
    expect(result.missing).toHaveLength(0);
  });

  it('deve retornar inválido quando não há API keys', () => {
    delete process.env.GROQ_API_KEY;
    delete process.env.GOOGLE_API_KEY;
    delete process.env.ANTHROPIC_API_KEY;
    
    const result = validateEnvVars();
    
    expect(result.isValid).toBe(false);
    expect(result.missing.length).toBeGreaterThan(0);
  });

  it('deve detectar Groq API key', () => {
    process.env.GROQ_API_KEY = 'gsk_test';
    delete process.env.GOOGLE_API_KEY;
    delete process.env.ANTHROPIC_API_KEY;
    
    const result = validateEnvVars();
    
    expect(result.isValid).toBe(true);
  });

  it('deve detectar Google API key', () => {
    delete process.env.GROQ_API_KEY;
    process.env.GOOGLE_API_KEY = 'test-key';
    delete process.env.ANTHROPIC_API_KEY;
    
    const result = validateEnvVars();
    
    expect(result.isValid).toBe(true);
  });

  it('deve detectar Anthropic API key', () => {
    delete process.env.GROQ_API_KEY;
    delete process.env.GOOGLE_API_KEY;
    process.env.ANTHROPIC_API_KEY = 'sk-ant-test';
    
    const result = validateEnvVars();
    
    expect(result.isValid).toBe(true);
  });

  it('deve incluir warnings para variáveis opcionais ausentes', () => {
    process.env.GROQ_API_KEY = 'test-key';
    delete process.env.PORT;
    
    const result = validateEnvVars();
    
    expect(result.warnings.length).toBeGreaterThan(0);
  });
});
