/**
 * Middleware para validação robusta de requisições
 * 
 * @module middleware/validateRequest
 * @description Valida, sanitiza e limita o tamanho do prompt nas requisições
 * 
 * Validações realizadas:
 * - Verifica se o body existe
 * - Verifica se o prompt existe
 * - Valida tipo (deve ser string)
 * - Valida tamanho mínimo (10 caracteres)
 * - Valida tamanho máximo (50.000 caracteres)
 * - Sanitiza entrada (remove caracteres de controle)
 * 
 * @example
 * // Usar no Express
 * app.post('/api/generate-menu', validateRequest, handler);
 */
import { REQUEST_LIMITS, ERROR_MESSAGES } from '../config/constants.js';
import { logger } from '../utils/logger.js';

/**
 * Sanitiza uma string removendo caracteres perigosos
 * @param {string} str - String a ser sanitizada
 * @returns {string} - String sanitizada
 */
function sanitizeString(str) {
  if (typeof str !== 'string') {
    return str;
  }

  // Remove caracteres de controle e normaliza espaços
  return str
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove caracteres de controle
    .replace(/\s+/g, ' ') // Normaliza espaços múltiplos
    .trim();
}

/**
 * Valida o tipo e estrutura do prompt
 * @param {any} prompt - Prompt a ser validado
 * @returns {{valid: boolean, error?: string, sanitized?: string}}
 */
function validatePrompt(prompt) {
  // Verificar se existe
  if (!prompt) {
    return { valid: false, error: ERROR_MESSAGES.PROMPT_REQUIRED };
  }

  // Verificar tipo
  if (typeof prompt !== 'string') {
    return { valid: false, error: 'Prompt deve ser uma string' };
  }

  // Verificar tamanho mínimo
  if (prompt.length < 10) {
    return { valid: false, error: 'Prompt muito curto. Forneça mais detalhes.' };
  }

  // Verificar tamanho máximo
  if (prompt.length > REQUEST_LIMITS.MAX_PROMPT_LENGTH) {
    return { valid: false, error: ERROR_MESSAGES.PROMPT_TOO_LARGE };
  }

  // Sanitizar
  const sanitized = sanitizeString(prompt);

  // Verificar se ficou vazio após sanitização
  if (!sanitized || sanitized.length < 10) {
    return { valid: false, error: 'Prompt inválido após sanitização' };
  }

  return { valid: true, sanitized };
}

/**
 * Middleware de validação de requisição
 * 
 * Valida body, sanitiza entrada e verifica limites.
 * O prompt validado e sanitizado é substituído no req.body.prompt.
 * 
 * @param {Object} req - Request do Express
 * @param {Object} req.body - Corpo da requisição
 * @param {string} req.body.prompt - Prompt a ser validado
 * @param {Object} res - Response do Express
 * @param {Function} next - Next middleware
 * 
 * @returns {void} - Chama next() se válido, ou retorna erro 400
 */
export function validateRequest(req, res, next) {
  try {
    // Verificar se há body
    if (!req.body) {
      return res.status(400).json({ 
        error: 'Corpo da requisição não fornecido' 
      });
    }

    // Verificar se prompt existe
    const { prompt } = req.body;

    // Validar prompt
    const promptValidation = validatePrompt(prompt);

    if (!promptValidation.valid) {
      logger.warn('Validação de prompt falhou:', promptValidation.error);
      return res.status(400).json({ 
        error: promptValidation.error 
      });
    }

    // Substituir prompt original pelo sanitizado
    req.body.prompt = promptValidation.sanitized;

    // Log em desenvolvimento
    if (logger.isDev()) {
      logger.debug('Requisição validada e sanitizada:', {
        promptLength: promptValidation.sanitized.length,
      });
    }

    next();
  } catch (error) {
    logger.error('Erro na validação de requisição:', error.message);
    return res.status(400).json({ 
      error: 'Erro ao validar requisição' 
    });
  }
}
