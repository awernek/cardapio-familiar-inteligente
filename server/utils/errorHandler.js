/**
 * Tratamento centralizado de erros
 */

import { logger } from './logger.js';
import { ERROR_MESSAGES } from '../config/constants.js';
import { AppError } from './errors.js';

/**
 * Tipos de erro
 * @enum {string}
 */
export const ErrorType = {
  API: 'API',
  VALIDATION: 'VALIDATION',
  SYSTEM: 'SYSTEM',
  RATE_LIMIT: 'RATE_LIMIT',
  UNKNOWN: 'UNKNOWN',
};

/**
 * Categoriza um erro baseado em sua mensagem, tipo ou instância
 * @param {Error} error - Erro a ser categorizado
 * @returns {string} - Tipo do erro
 */
export function categorizeError(error) {
  if (!error) {
    return ErrorType.UNKNOWN;
  }

  // Se for uma instância de AppError, usa o tipo definido
  if (error instanceof AppError) {
    return error.type;
  }

  const message = error.message?.toLowerCase() || '';
  const stack = error.stack?.toLowerCase() || '';

  // Erros de API
  if (message.includes('api') || message.includes('fetch') || message.includes('network') || 
      message.includes('groq') || message.includes('google') || message.includes('anthropic')) {
    return ErrorType.API;
  }

  // Erros de validação
  if (message.includes('validation') || message.includes('invalid') || message.includes('required') ||
      message.includes('deve ser') || message.includes('muito curto') || message.includes('muito grande')) {
    return ErrorType.VALIDATION;
  }

  // Erros de rate limit
  if (message.includes('rate limit') || message.includes('too many requests') || 
      message.includes('muitas requisições')) {
    return ErrorType.RATE_LIMIT;
  }

  // Erros de sistema
  if (stack.includes('node') || message.includes('internal') || message.includes('server') ||
      message.includes('eaddrinuse') || message.includes('enotfound')) {
    return ErrorType.SYSTEM;
  }

  return ErrorType.UNKNOWN;
}

/**
 * Obtém código de status HTTP apropriado para o tipo de erro
 * @param {Error} error - Erro (pode ser AppError com statusCode)
 * @param {string} errorType - Tipo do erro
 * @returns {number} - Código de status HTTP
 */
export function getStatusCode(error, errorType) {
  // Se for AppError, usa o statusCode definido
  if (error instanceof AppError && error.statusCode) {
    return error.statusCode;
  }

  switch (errorType) {
    case ErrorType.VALIDATION:
      return 400;
    case ErrorType.RATE_LIMIT:
      return 429;
    case ErrorType.API:
      return 502; // Bad Gateway - erro na API externa
    case ErrorType.SYSTEM:
      return 500;
    default:
      return 500;
  }
}

/**
 * Formata mensagem de erro para o usuário
 * @param {Error} error - Erro original
 * @param {string} errorType - Tipo do erro
 * @returns {string} - Mensagem amigável
 */
export function formatErrorMessage(error, errorType) {
  // Se já tem uma mensagem amigável, usa ela
  if (error.message && !error.message.includes('Error:') && !error.message.includes('at')) {
    return error.message;
  }

  switch (errorType) {
    case ErrorType.API:
      return 'Erro ao comunicar com o serviço de IA. Tente novamente em alguns instantes.';
    case ErrorType.VALIDATION:
      return error.message || ERROR_MESSAGES.PROMPT_REQUIRED;
    case ErrorType.RATE_LIMIT:
      return ERROR_MESSAGES.RATE_LIMIT_EXCEEDED;
    case ErrorType.SYSTEM:
      return ERROR_MESSAGES.GENERIC_ERROR;
    default:
      return error.message || ERROR_MESSAGES.GENERIC_ERROR;
  }
}

/**
 * Trata um erro e retorna resposta formatada
 * @param {Error} error - Erro a ser tratado
 * @param {Object} options - Opções adicionais
 * @param {boolean} options.logError - Se deve logar o erro (padrão: true)
 * @returns {{statusCode: number, error: string, type: string, details?: Object}} - Resposta formatada
 */
export function handleError(error, options = {}) {
  const { logError = true } = options;
  const errorType = categorizeError(error);
  const statusCode = getStatusCode(error, errorType);
  const message = formatErrorMessage(error, errorType);

  if (logError) {
    // Log estruturado
    const logData = {
      type: errorType,
      message: error.message || String(error),
      statusCode,
    };

    // Adicionar detalhes se for AppError
    if (error instanceof AppError && error.details) {
      logData.details = error.details;
    }

    logger.error(`[${errorType}]`, logData);

    // Stack trace apenas em desenvolvimento
    if (error.stack && logger.isDev()) {
      logger.debug('Stack trace:', error.stack);
    }
  }

  const response = {
    statusCode,
    error: message,
    type: errorType,
  };

  // Incluir detalhes em desenvolvimento (para debug)
  if (error instanceof AppError && error.details && logger.isDev()) {
    response.details = error.details;
  }

  return response;
}
