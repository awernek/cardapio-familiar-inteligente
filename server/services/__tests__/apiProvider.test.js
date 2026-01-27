import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getApiKeys, detectProvider, hasApiKey, getApiKey, getProviderInfo } from '../apiProvider.js';

describe('apiProvider', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    vi.clearAllMocks();
  });

  describe('getApiKeys', () => {
    it('deve retornar todas as chaves configuradas', () => {
      process.env.GROQ_API_KEY = 'groq-key';
      process.env.GOOGLE_API_KEY = 'google-key';
      process.env.ANTHROPIC_API_KEY = 'anthropic-key';

      const keys = getApiKeys();

      expect(keys.groqKey).toBe('groq-key');
      expect(keys.googleKey).toBe('google-key');
      expect(keys.anthropicKey).toBe('anthropic-key');
    });

    it('deve retornar null para chaves não configuradas', () => {
      delete process.env.GROQ_API_KEY;
      delete process.env.GOOGLE_API_KEY;
      delete process.env.ANTHROPIC_API_KEY;

      const keys = getApiKeys();

      expect(keys.groqKey).toBeNull();
      expect(keys.googleKey).toBeNull();
      expect(keys.anthropicKey).toBeNull();
    });
  });

  describe('detectProvider', () => {
    it('deve detectar Groq quando configurado', () => {
      process.env.GROQ_API_KEY = 'groq-key';
      delete process.env.GOOGLE_API_KEY;
      delete process.env.ANTHROPIC_API_KEY;

      expect(detectProvider()).toBe('groq');
    });

    it('deve detectar Google quando Groq não está configurado', () => {
      delete process.env.GROQ_API_KEY;
      process.env.GOOGLE_API_KEY = 'google-key';
      delete process.env.ANTHROPIC_API_KEY;

      expect(detectProvider()).toBe('google');
    });

    it('deve detectar Anthropic quando outros não estão configurados', () => {
      delete process.env.GROQ_API_KEY;
      delete process.env.GOOGLE_API_KEY;
      process.env.ANTHROPIC_API_KEY = 'anthropic-key';

      expect(detectProvider()).toBe('anthropic');
    });

    it('deve retornar null quando nenhum está configurado', () => {
      delete process.env.GROQ_API_KEY;
      delete process.env.GOOGLE_API_KEY;
      delete process.env.ANTHROPIC_API_KEY;

      expect(detectProvider()).toBeNull();
    });
  });

  describe('hasApiKey', () => {
    it('deve retornar true quando há pelo menos uma chave', () => {
      process.env.GROQ_API_KEY = 'groq-key';

      expect(hasApiKey()).toBe(true);
    });

    it('deve retornar false quando não há chaves', () => {
      delete process.env.GROQ_API_KEY;
      delete process.env.GOOGLE_API_KEY;
      delete process.env.ANTHROPIC_API_KEY;

      expect(hasApiKey()).toBe(false);
    });
  });

  describe('getApiKey', () => {
    it('deve retornar chave do provider especificado', () => {
      process.env.GROQ_API_KEY = 'groq-key';
      process.env.GOOGLE_API_KEY = 'google-key';

      expect(getApiKey('groq')).toBe('groq-key');
      expect(getApiKey('google')).toBe('google-key');
    });

    it('deve retornar null para provider desconhecido', () => {
      expect(getApiKey('unknown')).toBeNull();
    });
  });

  describe('getProviderInfo', () => {
    it('deve retornar informações do provider configurado', () => {
      process.env.GROQ_API_KEY = 'groq-key';

      const info = getProviderInfo();

      expect(info.provider).toBe('groq');
      expect(info.name).toBe('Groq (Llama 3.3 70B)');
      expect(info.configured).toBe(true);
    });

    it('deve retornar null quando nenhum provider está configurado', () => {
      delete process.env.GROQ_API_KEY;
      delete process.env.GOOGLE_API_KEY;
      delete process.env.ANTHROPIC_API_KEY;

      const info = getProviderInfo();

      expect(info.provider).toBeNull();
      expect(info.name).toBeNull();
      expect(info.configured).toBe(false);
    });
  });
});
