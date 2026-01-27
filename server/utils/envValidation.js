/**
 * Valida variáveis de ambiente necessárias no servidor
 */

import { logger } from './logger.js';

/**
 * Valida variáveis de ambiente no startup
 * Verifica API keys obrigatórias e mostra warnings para opcionais
 */
export function validateEnvVars() {
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  // Variáveis obrigatórias (pelo menos uma API key)
  const apiKeys = {
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  };

  // Variáveis opcionais
  const optionalVars = {
    PORT: {
      value: process.env.PORT,
      description: 'Porta do servidor (padrão: 3001)',
    },
  };

  const missing = [];
  const warnings = [];

  // Verificar se pelo menos uma API key está configurada
  const hasApiKey = Object.values(apiKeys).some(key => key);
  
  if (!hasApiKey) {
    missing.push({
      key: 'GROQ_API_KEY, GOOGLE_API_KEY ou ANTHROPIC_API_KEY',
      description: 'Pelo menos uma chave de API é obrigatória para gerar cardápios',
    });
  }

  // Verificar variáveis opcionais
  Object.entries(optionalVars).forEach(([key, config]) => {
    if (!config.value) {
      warnings.push({
        key,
        description: config.description,
      });
    }
  });

  // Log de erros (obrigatórias)
  if (missing.length > 0) {
    logger.error('❌ Variáveis de ambiente obrigatórias ausentes:');
    missing.forEach(({ key, description }) => {
      logger.error(`   - ${key}: ${description}`);
    });
    logger.error('\n💡 Configure pelo menos uma API key no arquivo server/.env');
    logger.error('   Veja server/.env.example para referência.\n');
  }

  // Log de warnings (opcionais)
  if (warnings.length > 0 && isDevelopment) {
    logger.warn('⚠️ Variáveis de ambiente opcionais ausentes:');
    warnings.forEach(({ key, description }) => {
      logger.warn(`   - ${key}: ${description}`);
    });
    logger.warn('\n💡 Algumas funcionalidades podem usar valores padrão.\n');
  }

  // Log de sucesso
  if (missing.length === 0) {
    const configuredKeys = Object.entries(apiKeys)
      .filter(([_, value]) => value)
      .map(([key]) => key);
    
    logger.log('✅ Variáveis de ambiente validadas:');
    logger.log(`   - API Keys configuradas: ${configuredKeys.join(', ')}`);
    
    if (warnings.length === 0) {
      logger.log('   - Todas as variáveis opcionais configuradas\n');
    }
  }

  return {
    isValid: missing.length === 0,
    missing,
    warnings,
  };
}
