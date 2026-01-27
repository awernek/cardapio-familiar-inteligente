/**
 * Utilitário para parsing de respostas JSON de APIs
 * Remove markdown code blocks e valida JSON
 */

import { logger } from './logger.js';

/**
 * Remove markdown code blocks de uma string
 * @param {string} content - Conteúdo com possível markdown
 * @returns {string} - Conteúdo limpo
 */
function removeMarkdownBlocks(content) {
  if (typeof content !== 'string') {
    return content;
  }

  // Remove ```json e ``` do início e fim
  return content
    .replace(/^```json\n?/gi, '')
    .replace(/^```\n?/g, '')
    .replace(/\n?```$/g, '')
    .trim();
}

/**
 * Valida se uma string é um JSON válido
 * @param {string} content - String para validar
 * @returns {boolean} - True se for JSON válido
 */
function isValidJson(content) {
  if (typeof content !== 'string') {
    return false;
  }

  try {
    JSON.parse(content);
    return true;
  } catch {
    return false;
  }
}

/**
 * Parse uma resposta JSON de API, removendo markdown e validando
 * @param {string} content - Conteúdo da resposta da API
 * @param {Object} options - Opções
 * @param {string} options.provider - Nome do provider (para logs)
 * @returns {Object} - JSON parseado
 * @throws {Error} - Se o JSON não for válido
 */
export function parseJsonResponse(content, options = {}) {
  const { provider = 'unknown' } = options;

  if (!content) {
    throw new Error(`Resposta da API ${provider} não contém conteúdo válido`);
  }

  // Remove markdown code blocks
  const cleanContent = removeMarkdownBlocks(content);

  // Valida JSON antes de fazer parse
  if (!isValidJson(cleanContent)) {
    logger.error(`JSON inválido do provider ${provider}:`, cleanContent.substring(0, 200));
    throw new Error(`Resposta da API ${provider} não contém JSON válido`);
  }

  try {
    const parsed = JSON.parse(cleanContent);
    logger.debug(`JSON parseado com sucesso do provider ${provider}`);
    return parsed;
  } catch (error) {
    logger.error(`Erro ao fazer parse do JSON do provider ${provider}:`, error.message);
    throw new Error(`Erro ao processar resposta da API ${provider}: ${error.message}`);
  }
}
