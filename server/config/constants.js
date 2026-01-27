/**
 * Constantes centralizadas do servidor
 */

// Rate Limiting
export const RATE_LIMIT = {
  WINDOW_MS: 60 * 60 * 1000, // 1 hora
  MAX_REQUESTS: 20, // máximo 20 requisições por hora por IP
};

// API Endpoints
export const API_ENDPOINTS = {
  GROQ: 'https://api.groq.com/openai/v1/chat/completions',
  GOOGLE_BASE: 'https://generativelanguage.googleapis.com/v1beta/models',
  ANTHROPIC: 'https://api.anthropic.com/v1/messages',
};

// Google Gemini Models (ordem de prioridade)
export const GOOGLE_MODELS = [
  'gemini-2.0-flash',
  'gemini-1.5-flash-latest',
  'gemini-pro',
];

// API Configuration
export const API_CONFIG = {
  GROQ: {
    MODEL: 'llama-3.3-70b-versatile',
    TEMPERATURE: 0.7,
    MAX_TOKENS: 8000,
    SYSTEM_MESSAGE: 'Você é um nutricionista especializado. SEMPRE responda APENAS com JSON válido, sem markdown, sem texto adicional.',
  },
  GOOGLE: {
    TEMPERATURE: 0.7,
    TOP_K: 40,
    TOP_P: 0.95,
    MAX_OUTPUT_TOKENS: 8192,
    RESPONSE_MIME_TYPE: 'application/json',
  },
  ANTHROPIC: {
    MODEL: 'claude-sonnet-4-20250514',
    MAX_TOKENS: 6000,
    VERSION: '2023-06-01',
  },
};

// CORS
export const ALLOWED_ORIGINS = [
  'https://cardapio-familiar-inteligente.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173',
];

// Request Limits
export const REQUEST_LIMITS = {
  JSON_BODY_SIZE: '1mb',
  MAX_PROMPT_LENGTH: 50000,
};

// Error Messages
export const ERROR_MESSAGES = {
  PROMPT_REQUIRED: 'Prompt não fornecido',
  PROMPT_TOO_LARGE: 'Dados muito grandes',
  API_KEY_NOT_CONFIGURED: 'API key não configurada. Configure GROQ_API_KEY, GOOGLE_API_KEY ou ANTHROPIC_API_KEY no servidor.',
  RATE_LIMIT_EXCEEDED: 'Muitas requisições. Aguarde um momento antes de tentar novamente.',
  CORS_NOT_ALLOWED: 'Origem não permitida',
  GENERIC_ERROR: 'Erro ao gerar cardápio. Tente novamente.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  MENU_GENERATED: 'Cardápio gerado com sucesso!',
  SERVER_RUNNING: 'Servidor funcionando',
};

// API Provider Priority
export const API_PROVIDER_PRIORITY = ['groq', 'google', 'anthropic'];
