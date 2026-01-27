/**
 * Utilitários para armazenamento local
 * Compatível com diferentes APIs de storage
 */

import { logger } from './logger';

const STORAGE_PREFIX = 'week-history:';

/**
 * Lista todas as chaves que começam com o prefixo
 * @param {string} prefix - Prefixo para buscar
 * @returns {Promise<string[]>} Array de chaves
 */
export const listStorageKeys = async (prefix = STORAGE_PREFIX) => {
  try {
    // Tenta usar a API window.storage se disponível (ex: Cursor/Claude)
    if (window.storage && window.storage.list) {
      const result = await window.storage.list(prefix);
      return result?.keys || [];
    }
    
    // Fallback para localStorage
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        keys.push(key);
      }
    }
    return keys;
  } catch (error) {
    logger.error('Erro ao listar chaves do storage:', error);
    return [];
  }
};

/**
 * Obtém um valor do storage
 * @param {string} key - Chave
 * @returns {Promise<any>} Valor armazenado ou null
 */
export const getStorageItem = async (key) => {
  try {
    // Tenta usar a API window.storage se disponível
    if (window.storage && window.storage.get) {
      const result = await window.storage.get(key);
      if (result?.value) {
        return JSON.parse(result.value);
      }
      return null;
    }
    
    // Fallback para localStorage
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    logger.error('Erro ao obter item do storage:', error);
    return null;
  }
};

/**
 * Salva um valor no storage
 * @param {string} key - Chave
 * @param {any} value - Valor a ser salvo (será convertido para JSON)
 * @returns {Promise<void>}
 */
export const setStorageItem = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    
    // Tenta usar a API window.storage se disponível
    if (window.storage && window.storage.set) {
      await window.storage.set(key, jsonValue);
      return;
    }
    
    // Fallback para localStorage
    localStorage.setItem(key, jsonValue);
  } catch (error) {
    logger.error('Erro ao salvar item no storage:', error);
    throw error;
  }
};

/**
 * Remove um item do storage
 * @param {string} key - Chave
 * @returns {Promise<void>}
 */
export const removeStorageItem = async (key) => {
  try {
    if (window.storage && window.storage.delete) {
      await window.storage.delete(key);
      return;
    }
    
    localStorage.removeItem(key);
  } catch (error) {
    logger.error('Erro ao remover item do storage:', error);
  }
};
