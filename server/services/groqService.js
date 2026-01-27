/**
 * Serviço para integração com Groq API
 * 
 * @module services/groqService
 * @description Integração com Groq API usando modelo Llama 3.3 70B
 * 
 * Características:
 * - Modelo: llama-3.3-70b-versatile
 * - Resposta em JSON nativo
 * - Rápido e gratuito
 * 
 * @example
 * const menu = await generateMenuWithGroq(prompt, apiKey);
 * console.log(menu.days); // Array com cardápio da semana
 */

import { API_ENDPOINTS, API_CONFIG } from '../config/constants.js';
import { parseJsonResponse } from '../utils/parseJsonResponse.js';
import { logger } from '../utils/logger.js';

/**
 * Gera cardápio usando Groq API
 * 
 * @param {string} prompt - Prompt para geração do cardápio
 * @param {string} apiKey - Chave da API Groq
 * @returns {Promise<Object>} - Cardápio gerado em formato JSON
 * @throws {Error} - Se houver erro na API ou no parsing
 * 
 * @example
 * try {
 *   const menu = await generateMenuWithGroq("Gere um cardápio...", "gsk_...");
 *   return menu;
 * } catch (error) {
 *   console.error('Erro Groq:', error.message);
 *   throw error;
 * }
 */
export async function generateMenuWithGroq(prompt, apiKey) {
  logger.log('🚀 Gerando cardápio via Groq...');
  
  const response = await fetch(API_ENDPOINTS.GROQ, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: API_CONFIG.GROQ.MODEL,
      messages: [
        { 
          role: "system", 
          content: API_CONFIG.GROQ.SYSTEM_MESSAGE
        },
        { role: "user", content: prompt }
      ],
      temperature: API_CONFIG.GROQ.TEMPERATURE,
      max_tokens: API_CONFIG.GROQ.MAX_TOKENS,
      response_format: { type: "json_object" }
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Erro na API Groq: ${response.status} - ${errorData.error?.message || response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  
  if (!content) {
    throw new Error('Resposta da API Groq não contém conteúdo válido');
  }
  
  return parseJsonResponse(content, { provider: 'Groq' });
}
