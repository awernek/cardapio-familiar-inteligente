/**
 * Serviço para integração com Anthropic Claude API
 * 
 * @module services/anthropicService
 * @description Integração com Anthropic Claude usando modelo Sonnet 4
 * 
 * Características:
 * - Modelo: claude-sonnet-4-20250514
 * - Alta qualidade de resposta
 * - Suporte a JSON
 * 
 * @example
 * const menu = await generateMenuWithAnthropic(prompt, apiKey);
 * console.log(menu.days);
 */

import { API_ENDPOINTS, API_CONFIG } from '../config/constants.js';
import { parseJsonResponse } from '../utils/parseJsonResponse.js';
import { logger } from '../utils/logger.js';

/**
 * Gera cardápio usando Anthropic Claude API
 * 
 * @param {string} prompt - Prompt para geração do cardápio
 * @param {string} apiKey - Chave da API Anthropic
 * @returns {Promise<Object>} - Cardápio gerado em formato JSON
 * @throws {Error} - Se houver erro na API ou no parsing
 * 
 * @example
 * try {
 *   const menu = await generateMenuWithAnthropic(prompt, "sk-ant-...");
 *   return menu;
 * } catch (error) {
 *   console.error('Erro Anthropic:', error.message);
 *   throw error;
 * }
 */
export async function generateMenuWithAnthropic(prompt, apiKey) {
  logger.log('🤖 Gerando cardápio via Anthropic Claude...');
  
  const response = await fetch(API_ENDPOINTS.ANTHROPIC, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": API_CONFIG.ANTHROPIC.VERSION
    },
    body: JSON.stringify({
      model: API_CONFIG.ANTHROPIC.MODEL,
      max_tokens: API_CONFIG.ANTHROPIC.MAX_TOKENS,
      messages: [
        { role: "user", content: prompt }
      ],
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Erro na API Anthropic: ${response.status} - ${errorData.error?.message || response.statusText}`);
  }

  const data = await response.json();
  const content = data.content[0].text;
  
  if (!content) {
    throw new Error('Resposta da API Anthropic não contém conteúdo válido');
  }
  
  return parseJsonResponse(content, { provider: 'Anthropic' });
}
