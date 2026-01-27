import { logger } from './logger';

/**
 * Valida variáveis de ambiente necessárias
 * Apenas valida em desenvolvimento para não quebrar produção
 */
export const validateEnvVars = () => {
  const isDevelopment = import.meta.env.DEV;
  
  if (!isDevelopment) {
    // Em produção, não valida (pode ter valores diferentes)
    return;
  }

  const requiredVars = {
    // Variáveis opcionais (com fallback)
    'VITE_API_URL': {
      required: false,
      description: 'URL do servidor backend (padrão: http://localhost:3001)'
    },
    'VITE_WEB3FORMS_ACCESS_KEY': {
      required: false,
      description: 'Chave de acesso do Web3Forms para formulário de contato'
    },
    'VITE_SUPABASE_URL': {
      required: false,
      description: 'URL do projeto Supabase'
    },
    'VITE_SUPABASE_ANON_KEY': {
      required: false,
      description: 'Chave anon do Supabase'
    }
  };

  const missing = [];
  const warnings = [];

  Object.entries(requiredVars).forEach(([key, config]) => {
    const value = import.meta.env[key];
    
    if (config.required && !value) {
      missing.push({ key, description: config.description });
    } else if (!config.required && !value) {
      warnings.push({ key, description: config.description });
    }
  });

  if (missing.length > 0) {
    logger.error('❌ Variáveis de ambiente obrigatórias ausentes:');
    missing.forEach(({ key, description }) => {
      logger.error(`   - ${key}: ${description}`);
    });
    logger.error('\n💡 Crie um arquivo .env na raiz do projeto com essas variáveis.');
    logger.error('   Veja .env.example para referência.\n');
  }

  if (warnings.length > 0) {
    logger.warn('⚠️ Variáveis de ambiente opcionais ausentes:');
    warnings.forEach(({ key, description }) => {
      logger.warn(`   - ${key}: ${description}`);
    });
    logger.warn('\n💡 Algumas funcionalidades podem não funcionar sem essas variáveis.\n');
  }

  if (missing.length === 0 && warnings.length === 0) {
    logger.log('✅ Todas as variáveis de ambiente estão configuradas.');
  }
};
