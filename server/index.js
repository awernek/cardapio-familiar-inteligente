/**
 * Servidor Express para geração de cardápios com IA
 * 
 * @module server
 * @description Servidor backend que atua como proxy para APIs de IA (Groq, Google Gemini, Anthropic)
 * 
 * @example
 * // Iniciar servidor
 * npm run dev
 * 
 * // Servidor estará disponível em http://localhost:3001
 */

import express from 'express';
import dotenv from 'dotenv';
import { logger } from './utils/logger.js';
import {
  RATE_LIMIT,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from './config/constants.js';
import { checkRateLimit, startCleanup, detectClientIp, getMetrics } from './utils/rateLimiter.js';
import { handleError } from './utils/errorHandler.js';
import { corsMiddleware } from './config/cors.js';
import { generateMenu, getProviderInfo, hasApiKey } from './services/apiProvider.js';
import { validateEnvVars } from './utils/envValidation.js';
import { validateRequest } from './middleware/validateRequest.js';
import { errorHandlerMiddleware, notFoundMiddleware } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configurado
app.use(corsMiddleware);

app.use(express.json({ limit: '1mb' }));

/**
 * Rota POST /api/generate-menu
 * Gera um cardápio personalizado usando IA
 * 
 * @route POST /api/generate-menu
 * @middleware validateRequest - Valida e sanitiza o prompt
 * 
 * @param {Object} req.body - Corpo da requisição
 * @param {string} req.body.prompt - Prompt para geração do cardápio (validado e sanitizado)
 * 
 * @returns {Object} 200 - Cardápio gerado em formato JSON
 * @returns {Object} 400 - Erro de validação ou API key não configurada
 * @returns {Object} 429 - Rate limit excedido
 * @returns {Object} 500 - Erro interno do servidor
 * 
 * @example
 * // Request
 * POST /api/generate-menu
 * {
 *   "prompt": "Gere um cardápio semanal para família de 4 pessoas..."
 * }
 * 
 * // Response 200
 * {
 *   "days": [...],
 *   "shoppingList": [...]
 * }
 */
app.post('/api/generate-menu', validateRequest, async (req, res) => {
  // Rate limiting com detecção melhorada de IP
  const clientIp = detectClientIp(req);
  
  const rateLimit = checkRateLimit(clientIp);
  
  res.setHeader('X-RateLimit-Limit', RATE_LIMIT.MAX_REQUESTS);
  res.setHeader('X-RateLimit-Remaining', rateLimit.remaining);
  
  if (!rateLimit.allowed) {
    return res.status(429).json({ 
      error: ERROR_MESSAGES.RATE_LIMIT_EXCEEDED,
      retryAfter: Math.ceil((rateLimit.resetAt - Date.now()) / 1000)
    });
  }

  try {
    const { prompt } = req.body; // Já validado e sanitizado pelo middleware
    
    // Verificar se há API key configurada
    if (!hasApiKey()) {
      return res.status(400).json({ 
        error: ERROR_MESSAGES.API_KEY_NOT_CONFIGURED
      });
    }

    // Gerar cardápio usando o provider disponível
    const menuJson = await generateMenu(prompt);
    
    logger.log('✅', SUCCESS_MESSAGES.MENU_GENERATED);
    return res.json(menuJson);
  } catch (error) {
    const errorResponse = handleError(error);
    return res.status(errorResponse.statusCode).json({ 
      error: errorResponse.error
    });
  }
});

/**
 * Rota GET /api/health
 * Health check do servidor
 * 
 * @route GET /api/health
 * @returns {Object} 200 - Status do servidor
 * 
 * @example
 * // Response
 * {
 *   "status": "ok",
 *   "message": "Servidor funcionando"
 * }
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: SUCCESS_MESSAGES.SERVER_RUNNING });
});

/**
 * Rota GET /api/metrics
 * Retorna métricas detalhadas do rate limiter
 * 
 * @route GET /api/metrics
 * @returns {Object} 200 - Métricas do rate limiter
 * 
 * @example
 * // Response
 * {
 *   "totalRequests": 150,
 *   "blockedRequests": 5,
 *   "uniqueIps": 25,
 *   "currentlyBlocked": 2,
 *   "activeRecords": 10,
 *   "blockRate": "3.33%"
 * }
 */
app.get('/api/metrics', (req, res) => {
  const metrics = getMetrics();
  res.json(metrics);
});

// Middleware para rotas não encontradas (404)
app.use(notFoundMiddleware);

// Middleware de tratamento de erros global (deve ser o último)
app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
  logger.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  
  // Validar variáveis de ambiente
  const envValidation = validateEnvVars();
  
  // Iniciar limpeza automática de rate limit
  startCleanup();
  
  // Verificar qual API está configurada
  const providerInfo = getProviderInfo();
  
  if (providerInfo.configured) {
    logger.log(`✅ Usando API: ${providerInfo.name}`);
  } else {
    logger.warn(`⚠️  Nenhuma API configurada! Configure GROQ_API_KEY, GOOGLE_API_KEY ou ANTHROPIC_API_KEY no .env`);
  }
  
  logger.log(`🔒 Rate limit: ${RATE_LIMIT.MAX_REQUESTS} requisições/hora por IP`);
});
