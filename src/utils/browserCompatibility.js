/**
 * Utilitários para compatibilidade cross-browser
 */

import { logger } from './logger';

/**
 * Verifica se o navegador suporta Clipboard API
 */
export const supportsClipboard = () => {
  return navigator.clipboard && typeof navigator.clipboard.writeText === 'function';
};

/**
 * Copia texto para a área de transferência com fallback
 */
export const copyToClipboard = async (text) => {
  if (supportsClipboard()) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      logger.error('Erro ao copiar:', err);
      return fallbackCopyToClipboard(text);
    }
  } else {
    return fallbackCopyToClipboard(text);
  }
};

/**
 * Fallback para navegadores antigos
 */
const fallbackCopyToClipboard = (text) => {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    document.body.removeChild(textArea);
    logger.error('Fallback copy failed:', err);
    return false;
  }
};

/**
 * Verifica se o navegador suporta localStorage
 */
export const supportsLocalStorage = () => {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Verifica se o navegador suporta IntersectionObserver
 */
export const supportsIntersectionObserver = () => {
  return 'IntersectionObserver' in window;
};
