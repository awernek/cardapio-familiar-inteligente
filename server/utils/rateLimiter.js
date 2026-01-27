/**
 * Rate Limiter em memória com limpeza automática de registros expirados
 * 
 * @module utils/rateLimiter
 * @description Sistema de rate limiting que limita requisições por IP
 * 
 * Características:
 * - Limite: 20 requisições por hora por IP
 * - Limpeza automática a cada 30 minutos
 * - Previne memory leaks removendo registros expirados
 * - Suporte a proxies reversos (X-Forwarded-For, X-Real-IP)
 * - Métricas detalhadas (requisições totais, IPs bloqueados, etc.)
 * 
 * @example
 * // Verificar rate limit
 * const result = checkRateLimit('192.168.1.1');
 * if (!result.allowed) {
 *   // Rate limit excedido
 * }
 * 
 * // Iniciar limpeza automática
 * startCleanup();
 * 
 * // Obter métricas
 * const metrics = getMetrics();
 * console.log(`Total de requisições: ${metrics.totalRequests}`);
 */

import { RATE_LIMIT } from '../config/constants.js';
import { logger } from './logger.js';

// Mapa de IPs e seus registros de rate limit
const rateLimitMap = new Map();

// Intervalo de limpeza (30 minutos)
const CLEANUP_INTERVAL_MS = 30 * 60 * 1000;

// Métricas globais
const metrics = {
  totalRequests: 0,
  blockedRequests: 0,
  uniqueIps: new Set(),
  blockedIps: new Set(),
  lastCleanup: null,
  cleanupCount: 0,
};

/**
 * Limpa registros expirados do mapa de rate limiting
 * Também limpa IPs bloqueados que já expiraram das métricas
 */
function cleanupExpiredRecords() {
  const now = Date.now();
  let cleaned = 0;
  let blockedCleaned = 0;

  for (const [ip, record] of rateLimitMap.entries()) {
    if (now > record.resetAt) {
      rateLimitMap.delete(ip);
      cleaned++;
      
      // Remover IP bloqueado das métricas se expirou
      if (metrics.blockedIps.has(ip)) {
        metrics.blockedIps.delete(ip);
        blockedCleaned++;
      }
    }
  }

  metrics.lastCleanup = now;
  metrics.cleanupCount++;

  if (cleaned > 0) {
    logger.debug(`Limpeza automática: ${cleaned} registros expirados removidos (${blockedCleaned} IPs bloqueados limpos)`);
  }
}

// Inicia limpeza automática periódica
let cleanupInterval = null;

/**
 * Inicia o processo de limpeza automática
 */
export function startCleanup() {
  if (cleanupInterval) {
    return; // Já está rodando
  }

  cleanupInterval = setInterval(cleanupExpiredRecords, CLEANUP_INTERVAL_MS);
  logger.debug('Limpeza automática de rate limit iniciada');
}

/**
 * Para o processo de limpeza automática
 */
export function stopCleanup() {
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
    cleanupInterval = null;
    logger.debug('Limpeza automática de rate limit parada');
  }
}

/**
 * Verifica se um IP pode fazer uma requisição
 * 
 * @param {string} ip - Endereço IP do cliente
 * @returns {{allowed: boolean, remaining: number, resetAt?: number}} - Resultado da verificação
 * @returns {boolean} allowed - Se a requisição é permitida
 * @returns {number} remaining - Número de requisições restantes
 * @returns {number} [resetAt] - Timestamp de quando o limite será resetado (se bloqueado)
 * 
 * @example
 * const result = checkRateLimit('192.168.1.1');
 * if (result.allowed) {
 *   console.log(`${result.remaining} requisições restantes`);
 * } else {
 *   const secondsUntilReset = Math.ceil((result.resetAt - Date.now()) / 1000);
 *   console.log(`Bloqueado por ${secondsUntilReset} segundos`);
 * }
 */
export function checkRateLimit(ip) {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  // Atualizar métricas
  metrics.totalRequests++;
  metrics.uniqueIps.add(ip);
  
  if (!record) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT.WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT.MAX_REQUESTS - 1 };
  }
  
  if (now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT.WINDOW_MS });
    // Remover IP bloqueado se resetou
    if (metrics.blockedIps.has(ip)) {
      metrics.blockedIps.delete(ip);
    }
    return { allowed: true, remaining: RATE_LIMIT.MAX_REQUESTS - 1 };
  }
  
  if (record.count >= RATE_LIMIT.MAX_REQUESTS) {
    // Atualizar métricas de bloqueio
    metrics.blockedRequests++;
    metrics.blockedIps.add(ip);
    return { allowed: false, remaining: 0, resetAt: record.resetAt };
  }
  
  record.count++;
  return { allowed: true, remaining: RATE_LIMIT.MAX_REQUESTS - record.count };
}

/**
 * Obtém estatísticas básicas do rate limiter
 * 
 * @returns {{totalIps: number, activeRecords: number}} - Estatísticas básicas
 * @returns {number} totalIps - Total de IPs no mapa (incluindo expirados)
 * @returns {number} activeRecords - IPs com registros ainda válidos
 * 
 * @example
 * const stats = getStats();
 * console.log(`${stats.activeRecords} IPs ativos de ${stats.totalIps} total`);
 */
export function getStats() {
  const now = Date.now();
  let activeRecords = 0;

  for (const record of rateLimitMap.values()) {
    if (now <= record.resetAt) {
      activeRecords++;
    }
  }

  return {
    totalIps: rateLimitMap.size,
    activeRecords,
  };
}

/**
 * Obtém métricas detalhadas do rate limiter
 * 
 * @returns {Object} - Métricas detalhadas
 * @returns {number} totalRequests - Total de requisições processadas
 * @returns {number} blockedRequests - Total de requisições bloqueadas
 * @returns {number} uniqueIps - Número de IPs únicos que fizeram requisições
 * @returns {number} currentlyBlocked - IPs atualmente bloqueados
 * @returns {number} activeRecords - IPs com registros ativos
 * @returns {Date|null} lastCleanup - Timestamp da última limpeza
 * @returns {number} cleanupCount - Número de limpezas realizadas
 * 
 * @example
 * const metrics = getMetrics();
 * console.log(`Taxa de bloqueio: ${(metrics.blockedRequests / metrics.totalRequests * 100).toFixed(2)}%`);
 */
export function getMetrics() {
  const now = Date.now();
  let activeRecords = 0;

  for (const record of rateLimitMap.values()) {
    if (now <= record.resetAt) {
      activeRecords++;
    }
  }

  return {
    totalRequests: metrics.totalRequests,
    blockedRequests: metrics.blockedRequests,
    uniqueIps: metrics.uniqueIps.size,
    currentlyBlocked: metrics.blockedIps.size,
    activeRecords,
    lastCleanup: metrics.lastCleanup ? new Date(metrics.lastCleanup) : null,
    cleanupCount: metrics.cleanupCount,
    blockRate: metrics.totalRequests > 0 
      ? ((metrics.blockedRequests / metrics.totalRequests) * 100).toFixed(2) + '%'
      : '0%',
  };
}

/**
 * Detecta o IP real do cliente, considerando proxies reversos
 * 
 * @param {Object} req - Objeto de requisição do Express
 * @returns {string} - IP detectado
 * 
 * @description
 * Ordem de prioridade:
 * 1. X-Forwarded-For (primeiro IP da lista, se confiável)
 * 2. X-Real-IP
 * 3. req.ip (do Express)
 * 4. req.connection.remoteAddress (fallback)
 * 5. 'unknown' (se nenhum disponível)
 * 
 * @example
 * const clientIp = detectClientIp(req);
 * const rateLimit = checkRateLimit(clientIp);
 */
export function detectClientIp(req) {
  // X-Forwarded-For pode conter múltiplos IPs (proxies em cadeia)
  // O primeiro IP é geralmente o IP original do cliente
  const xForwardedFor = req.headers['x-forwarded-for'];
  if (xForwardedFor) {
    // Pega o primeiro IP da lista (cliente original)
    const firstIp = xForwardedFor.split(',')[0].trim();
    if (firstIp && firstIp !== 'unknown') {
      return firstIp;
    }
  }

  // X-Real-IP é usado por alguns proxies (Nginx, etc.)
  const xRealIp = req.headers['x-real-ip'];
  if (xRealIp && xRealIp !== 'unknown') {
    return xRealIp.trim();
  }

  // req.ip do Express (já processado)
  if (req.ip && req.ip !== 'unknown') {
    return req.ip;
  }

  // Fallback para connection.remoteAddress
  if (req.connection?.remoteAddress) {
    return req.connection.remoteAddress;
  }

  // Último recurso
  return 'unknown';
}
