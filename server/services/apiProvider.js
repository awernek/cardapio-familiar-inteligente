/**
 * Factory para escolher e usar o provider de API disponível
 * 
 * @module services/apiProvider
 * @description Gerencia a seleção automática e uso de providers de IA
 * 
 * Prioridade de seleção:
 * 1. Groq (gratuito e rápido)
 * 2. Google Gemini (com fallback entre modelos)
 * 3. Anthropic Claude
 * 
 * @example
 * // Gerar cardápio (usa provider disponível automaticamente)
 * const menu = await generateMenu(prompt);
 * 
 * // Verificar provider configurado
 * const info = getProviderInfo();
 * console.log(info.name); // "Groq (Llama 3.3 70B)"
 */

import { API_PROVIDER_PRIORITY } from '../config/constants.js';
import { logger } from '../utils/logger.js';
import { generateMenuWithGroq } from './groqService.js';
import { generateMenuWithGoogle } from './googleService.js';
import { generateMenuWithAnthropic } from './anthropicService.js';

/**
 * Obtém as chaves de API configuradas
 * @returns {{groqKey: string|null, googleKey: string|null, anthropicKey: string|null}}
 */
export function getApiKeys() {
  return {
    groqKey: process.env.GROQ_API_KEY || null,
    googleKey: process.env.GOOGLE_API_KEY || null,
    anthropicKey: process.env.ANTHROPIC_API_KEY || null,
  };
}

/**
 * Detecta qual provider está disponível baseado nas chaves configuradas
 * @returns {string|null} - Nome do provider ('groq', 'google', 'anthropic') ou null
 */
export function detectProvider() {
  const { groqKey, googleKey, anthropicKey } = getApiKeys();
  
  // Segue a prioridade definida
  if (groqKey) {
    return 'groq';
  }
  if (googleKey) {
    return 'google';
  }
  if (anthropicKey) {
    return 'anthropic';
  }
  
  return null;
}

/**
 * Valida se pelo menos uma API key está configurada
 * @returns {boolean} - True se houver pelo menos uma chave
 */
export function hasApiKey() {
  const { groqKey, googleKey, anthropicKey } = getApiKeys();
  return !!(groqKey || googleKey || anthropicKey);
}

/**
 * Obtém a chave da API do provider especificado
 * @param {string} provider - Nome do provider ('groq', 'google', 'anthropic')
 * @returns {string|null} - Chave da API ou null
 */
export function getApiKey(provider) {
  const keys = getApiKeys();
  
  switch (provider) {
    case 'groq':
      return keys.groqKey;
    case 'google':
      return keys.googleKey;
    case 'anthropic':
      return keys.anthropicKey;
    default:
      return null;
  }
}

/**
 * Gera cardápio usando o provider disponível
 * 
 * Seleciona automaticamente o melhor provider baseado nas API keys configuradas.
 * A prioridade é: Groq > Google > Anthropic
 * 
 * @param {string} prompt - Prompt para geração do cardápio
 * @returns {Promise<Object>} - Cardápio gerado em formato JSON
 * @throws {Error} - Se nenhum provider estiver configurado ou houver erro na API
 * 
 * @example
 * try {
 *   const menu = await generateMenu("Gere um cardápio para família de 4...");
 *   console.log(menu.days); // Array com os dias da semana
 * } catch (error) {
 *   console.error('Erro:', error.message);
 * }
 */
export async function generateMenu(prompt) {
  const provider = detectProvider();
  
  if (!provider) {
    throw new Error('Nenhuma API key configurada. Configure GROQ_API_KEY, GOOGLE_API_KEY ou ANTHROPIC_API_KEY.');
  }
  
  const apiKey = getApiKey(provider);
  
  if (!apiKey) {
    throw new Error(`API key não encontrada para o provider ${provider}`);
  }
  
  logger.log(`📡 Usando provider: ${provider}`);
  
  switch (provider) {
    case 'groq':
      return await generateMenuWithGroq(prompt, apiKey);
    case 'google':
      return await generateMenuWithGoogle(prompt, apiKey);
    case 'anthropic':
      return await generateMenuWithAnthropic(prompt, apiKey);
    default:
      throw new Error(`Provider desconhecido: ${provider}`);
  }
}

/**
 * Obtém informações sobre o provider configurado
 * 
 * @returns {{provider: string|null, name: string, configured: boolean}} - Informações do provider
 * @returns {string|null} provider - Nome do provider ('groq', 'google', 'anthropic') ou null
 * @returns {string|null} name - Nome amigável do provider ou null
 * @returns {boolean} configured - Se pelo menos uma API key está configurada
 * 
 * @example
 * const info = getProviderInfo();
 * if (info.configured) {
 *   console.log(`Usando: ${info.name}`);
 * } else {
 *   console.log('Nenhuma API configurada');
 * }
 */
export function getProviderInfo() {
  const provider = detectProvider();
  const { groqKey, googleKey, anthropicKey } = getApiKeys();
  
  const providerNames = {
    groq: 'Groq (Llama 3.3 70B)',
    google: 'Google Gemini',
    anthropic: 'Anthropic Claude',
  };
  
  return {
    provider,
    name: provider ? providerNames[provider] : null,
    configured: !!(groqKey || googleKey || anthropicKey),
  };
}
