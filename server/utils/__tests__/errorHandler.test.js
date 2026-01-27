import { describe, it, expect, beforeEach } from 'vitest';
import { categorizeError, getStatusCode, formatErrorMessage, handleError, ErrorType } from '../errorHandler.js';
import { ApiError, ValidationError, RateLimitError, SystemError } from '../errors.js';

describe('errorHandler', () => {
  describe('categorizeError', () => {
    it('deve categorizar AppError pelo tipo', () => {
      const error = new ApiError('Erro de API');
      expect(categorizeError(error)).toBe(ErrorType.API);
    });

    it('deve categorizar erro de API pela mensagem', () => {
      const error = new Error('Erro na API Groq');
      expect(categorizeError(error)).toBe(ErrorType.API);
    });

    it('deve categorizar erro de validação', () => {
      const error = new Error('Prompt deve ser uma string');
      expect(categorizeError(error)).toBe(ErrorType.VALIDATION);
    });

    it('deve categorizar erro de rate limit', () => {
      const error = new Error('Muitas requisições');
      expect(categorizeError(error)).toBe(ErrorType.RATE_LIMIT);
    });

    it('deve categorizar erro de sistema', () => {
      const error = new Error('Erro interno do servidor');
      expect(categorizeError(error)).toBe(ErrorType.SYSTEM);
    });

    it('deve retornar UNKNOWN para erro desconhecido', () => {
      const error = new Error('Erro genérico');
      expect(categorizeError(error)).toBe(ErrorType.UNKNOWN);
    });

    it('deve retornar UNKNOWN para null/undefined', () => {
      expect(categorizeError(null)).toBe(ErrorType.UNKNOWN);
      expect(categorizeError(undefined)).toBe(ErrorType.UNKNOWN);
    });
  });

  describe('getStatusCode', () => {
    it('deve usar statusCode de AppError', () => {
      const error = new ValidationError('Erro de validação');
      expect(getStatusCode(error, ErrorType.VALIDATION)).toBe(400);
    });

    it('deve retornar 400 para VALIDATION', () => {
      const error = new Error('Erro de validação');
      expect(getStatusCode(error, ErrorType.VALIDATION)).toBe(400);
    });

    it('deve retornar 429 para RATE_LIMIT', () => {
      const error = new Error('Rate limit');
      expect(getStatusCode(error, ErrorType.RATE_LIMIT)).toBe(429);
    });

    it('deve retornar 502 para API', () => {
      const error = new Error('Erro de API');
      expect(getStatusCode(error, ErrorType.API)).toBe(502);
    });

    it('deve retornar 500 para SYSTEM', () => {
      const error = new Error('Erro de sistema');
      expect(getStatusCode(error, ErrorType.SYSTEM)).toBe(500);
    });
  });

  describe('formatErrorMessage', () => {
    it('deve usar mensagem amigável se disponível', () => {
      const error = new Error('Prompt não fornecido');
      const message = formatErrorMessage(error, ErrorType.VALIDATION);
      expect(message).toBe('Prompt não fornecido');
    });

    it('deve formatar mensagem para erro de API', () => {
      const error = new Error('Erro na API: 500');
      const message = formatErrorMessage(error, ErrorType.API);
      expect(message).toContain('comunicar com o serviço');
    });

    it('deve formatar mensagem para erro de validação', () => {
      const error = new ValidationError('Campo inválido');
      const message = formatErrorMessage(error, ErrorType.VALIDATION);
      expect(message).toBe('Campo inválido');
    });
  });

  describe('handleError', () => {
    it('deve tratar erro e retornar resposta formatada', () => {
      const error = new ValidationError('Erro de validação');
      const result = handleError(error, { logError: false });
      
      expect(result.statusCode).toBe(400);
      expect(result.error).toBe('Erro de validação');
      expect(result.type).toBe(ErrorType.VALIDATION);
    });

    it('deve incluir detalhes em desenvolvimento', () => {
      const error = new ApiError('Erro de API', { provider: 'Groq' });
      const result = handleError(error, { logError: false });
      
      // Em desenvolvimento, deve incluir details
      expect(result.details).toBeDefined();
    });

    it('deve logar erro por padrão', () => {
      const error = new Error('Erro de teste');
      const result = handleError(error, { logError: true });
      
      expect(result.statusCode).toBeDefined();
      expect(result.error).toBeDefined();
    });
  });
});
