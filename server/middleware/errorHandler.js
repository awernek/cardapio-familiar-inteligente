/**
 * Middleware global de tratamento de erros
 * 
 * @module middleware/errorHandler
 * @description Captura erros não tratados e formata resposta padronizada
 * 
 * Funcionalidades:
 * - Captura erros lançados em rotas e middlewares
 * - Categoriza erros automaticamente
 * - Formata resposta de erro amigável
 * - Loga erros estruturados
 * - Trata rotas não encontradas (404)
 * 
 * @example
 * // Deve ser o último middleware adicionado
 * app.use(notFoundMiddleware);
 * app.use(errorHandlerMiddleware);
 */

import { handleError } from '../utils/errorHandler.js';
import { logger } from '../utils/logger.js';

/**
 * Middleware de tratamento de erros global
 * 
 * Captura todos os erros não tratados e formata resposta padronizada.
 * Deve ser o último middleware adicionado ao app.
 * 
 * @param {Error} err - Erro capturado
 * @param {Object} req - Request do Express
 * @param {Object} res - Response do Express
 * @param {Function} next - Next middleware
 * 
 * @returns {void} - Envia resposta de erro formatada
 */
export function errorHandlerMiddleware(err, req, res, next) {
  // Se a resposta já foi enviada, delegar para o handler padrão do Express
  if (res.headersSent) {
    return next(err);
  }

  // Tratar o erro
  const errorResponse = handleError(err, { logError: true });

  // Log adicional da requisição em desenvolvimento
  if (logger.isDev()) {
    logger.debug('Erro capturado na requisição:', {
      method: req.method,
      path: req.path,
      ip: req.ip,
    });
  }

  // Enviar resposta de erro formatada
  res.status(errorResponse.statusCode).json({
    error: errorResponse.error,
    ...(errorResponse.details && { details: errorResponse.details }),
  });
}

/**
 * Middleware para capturar rotas não encontradas (404)
 * 
 * Deve ser adicionado após todas as rotas, mas antes do errorHandlerMiddleware.
 * 
 * @param {Object} req - Request do Express
 * @param {Object} res - Response do Express
 * @param {Function} next - Next middleware
 * 
 * @returns {void} - Passa erro 404 para o errorHandlerMiddleware
 */
export function notFoundMiddleware(req, res, next) {
  const error = new Error(`Rota não encontrada: ${req.method} ${req.path}`);
  error.statusCode = 404;
  next(error);
}
