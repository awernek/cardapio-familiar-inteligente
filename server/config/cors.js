/**
 * Configuração CORS para o servidor
 */

import cors from 'cors';
import { ALLOWED_ORIGINS, ERROR_MESSAGES } from './constants.js';

/**
 * Middleware CORS configurado
 * Permite requisições das origens permitidas e localhost em desenvolvimento
 */
export const corsMiddleware = cors({
  origin: function(origin, callback) {
    // Permite requisições sem origin (ex: curl, Postman) em dev
    if (!origin) {
      return callback(null, true);
    }

    // Verifica se está na lista de origens permitidas
    if (ALLOWED_ORIGINS.includes(origin)) {
      return callback(null, true);
    }

    // Permite localhost em desenvolvimento
    if (origin.includes('localhost')) {
      return callback(null, true);
    }

    // Rejeita outras origens
    return callback(new Error(ERROR_MESSAGES.CORS_NOT_ALLOWED), false);
  },
  credentials: true,
});
