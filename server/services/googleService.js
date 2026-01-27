/**
 * Serviço para integração com Google Gemini API
 * 
 * @module services/googleService
 * @description Integração com Google Gemini com fallback automático entre modelos
 * 
 * Modelos tentados (em ordem):
 * 1. gemini-2.0-flash
 * 2. gemini-1.5-flash-latest
 * 3. gemini-pro
 * 
 * Se um modelo falhar (404 ou 429), tenta o próximo automaticamente.
 * 
 * @example
 * const menu = await generateMenuWithGoogle(prompt, apiKey);
 * // Tenta todos os modelos até encontrar um que funcione
 */

import { API_ENDPOINTS, GOOGLE_MODELS, API_CONFIG } from '../config/constants.js';
import { parseJsonResponse } from '../utils/parseJsonResponse.js';
import { logger } from '../utils/logger.js';

/**
 * Gera cardápio usando Google Gemini API com fallback entre modelos
 * 
 * Tenta cada modelo na ordem de prioridade até encontrar um que funcione.
 * 
 * @param {string} prompt - Prompt para geração do cardápio
 * @param {string} apiKey - Chave da API Google
 * @returns {Promise<Object>} - Cardápio gerado em formato JSON
 * @throws {Error} - Se todos os modelos falharem
 * 
 * @example
 * try {
 *   const menu = await generateMenuWithGoogle(prompt, apiKey);
 *   // Sucesso com algum dos modelos
 * } catch (error) {
 *   // Todos os modelos falharam
 *   console.error('Erro Google:', error.message);
 * }
 */
export async function generateMenuWithGoogle(prompt, apiKey) {
  let lastError = null;
  
  for (const model of GOOGLE_MODELS) {
    logger.log(`🤖 Tentando modelo: ${model}`);
    
    try {
      const response = await fetch(
        `${API_ENDPOINTS.GOOGLE_BASE}/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }],
            generationConfig: {
              temperature: API_CONFIG.GOOGLE.TEMPERATURE,
              topK: API_CONFIG.GOOGLE.TOP_K,
              topP: API_CONFIG.GOOGLE.TOP_P,
              maxOutputTokens: API_CONFIG.GOOGLE.MAX_OUTPUT_TOKENS,
              responseMimeType: API_CONFIG.GOOGLE.RESPONSE_MIME_TYPE
            }
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        lastError = new Error(`Erro na API Google (${model}): ${response.status} - ${errorData.error?.message || response.statusText}`);
        
        // Tenta próximo modelo se for 404 ou 429
        if ((response.status === 404 || response.status === 429) && GOOGLE_MODELS.indexOf(model) < GOOGLE_MODELS.length - 1) {
          continue;
        }
        
        throw lastError;
      }

      const data = await response.json();
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!content) {
        // Tenta próximo modelo se não houver conteúdo
        if (GOOGLE_MODELS.indexOf(model) < GOOGLE_MODELS.length - 1) {
          continue;
        }
        throw new Error('Resposta da API não contém conteúdo válido');
      }
      
      return parseJsonResponse(content, { provider: `Google (${model})` });
    } catch (err) {
      lastError = err;
      // Tenta próximo modelo se ainda houver
      if (GOOGLE_MODELS.indexOf(model) < GOOGLE_MODELS.length - 1) {
        continue;
      }
      throw err;
    }
  }
  
  // Se chegou aqui, todos os modelos falharam
  throw lastError || new Error('Todos os modelos do Google falharam');
}
