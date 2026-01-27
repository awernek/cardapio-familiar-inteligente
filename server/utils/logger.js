/**
 * Sistema de logging condicional para Node.js
 * Logs apenas em desenvolvimento, erros sempre logam
 */

const isDevelopment = process.env.NODE_ENV !== 'production';
const isProduction = process.env.NODE_ENV === 'production';

/**
 * Logger utilitário para substituir console.log/error
 * @namespace logger
 */
export const logger = {
  /**
   * Log apenas em desenvolvimento
   * @param {...any} args - Argumentos para logar
   */
  log: (...args) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },

  /**
   * Log de erro (sempre loga, mesmo em produção)
   * @param {...any} args - Argumentos para logar
   */
  error: (...args) => {
    console.error(...args);
  },

  /**
   * Log de warning (apenas em desenvolvimento)
   * @param {...any} args - Argumentos para logar
   */
  warn: (...args) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },

  /**
   * Log de informação (apenas em desenvolvimento)
   * @param {...any} args - Argumentos para logar
   */
  info: (...args) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },

  /**
   * Log de debug (apenas em desenvolvimento)
   * @param {...any} args - Argumentos para logar
   */
  debug: (...args) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  },

  /**
   * Verifica se está em modo de desenvolvimento
   * @returns {boolean}
   */
  isDev: () => isDevelopment,

  /**
   * Verifica se está em modo de produção
   * @returns {boolean}
   */
  isProd: () => isProduction,
};
