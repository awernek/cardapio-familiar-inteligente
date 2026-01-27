/**
 * Classes de erro customizadas para categorização e tratamento
 */

import { ErrorType } from './errorHandler.js';

/**
 * Classe base para erros customizados
 */
export class AppError extends Error {
  /**
   * @param {string} message - Mensagem de erro
   * @param {string} type - Tipo do erro (ErrorType)
   * @param {number} statusCode - Código de status HTTP
   * @param {Object} details - Detalhes adicionais do erro
   */
  constructor(message, type = ErrorType.UNKNOWN, statusCode = 500, details = {}) {
    super(message);
    this.name = this.constructor.name;
    this.type = type;
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Erro de API externa
 */
export class ApiError extends AppError {
  /**
   * @param {string} message - Mensagem de erro
   * @param {Object} details - Detalhes adicionais (provider, statusCode, etc)
   */
  constructor(message, details = {}) {
    super(
      message,
      ErrorType.API,
      502, // Bad Gateway
      details
    );
  }
}

/**
 * Erro de validação
 */
export class ValidationError extends AppError {
  /**
   * @param {string} message - Mensagem de erro
   * @param {Object} details - Detalhes adicionais (field, value, etc)
   */
  constructor(message, details = {}) {
    super(
      message,
      ErrorType.VALIDATION,
      400, // Bad Request
      details
    );
  }
}

/**
 * Erro de rate limit
 */
export class RateLimitError extends AppError {
  /**
   * @param {string} message - Mensagem de erro
   * @param {Object} details - Detalhes adicionais (resetAt, remaining, etc)
   */
  constructor(message, details = {}) {
    super(
      message,
      ErrorType.RATE_LIMIT,
      429, // Too Many Requests
      details
    );
  }
}

/**
 * Erro de sistema
 */
export class SystemError extends AppError {
  /**
   * @param {string} message - Mensagem de erro
   * @param {Object} details - Detalhes adicionais
   */
  constructor(message, details = {}) {
    super(
      message,
      ErrorType.SYSTEM,
      500, // Internal Server Error
      details
    );
  }
}
