import { logger } from './logger';

/**
 * Utilitário para tratamento padronizado de erros
 */
class ErrorHandler {
  /**
   * Tipos de erro conhecidos e suas mensagens amigáveis
   */
  errorMessages = {
    // Erros de rede
    'NetworkError': 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.',
    'Failed to fetch': 'Erro ao comunicar com o servidor. Tente novamente em alguns instantes.',
    'timeout': 'A requisição demorou muito para responder. Tente novamente.',
    
    // Erros de autenticação
    'Unauthorized': 'Você precisa fazer login para acessar esta funcionalidade.',
    'Forbidden': 'Você não tem permissão para realizar esta ação.',
    
    // Erros de validação
    'ValidationError': 'Os dados informados são inválidos. Verifique e tente novamente.',
    'InvalidInput': 'Algum campo foi preenchido incorretamente. Verifique os dados.',
    
    // Erros de API
    'APIError': 'Erro ao processar sua solicitação. Tente novamente mais tarde.',
    'ServerError': 'O servidor está temporariamente indisponível. Tente novamente em alguns minutos.',
    
    // Erros genéricos
    'UnknownError': 'Ocorreu um erro inesperado. Tente recarregar a página.',
    'Default': 'Algo deu errado. Por favor, tente novamente ou recarregue a página.',
  };

  /**
   * Extrai uma mensagem amigável do erro
   * @param {Error|string|object} error - O erro ocorrido
   * @returns {string} Mensagem amigável para o usuário
   */
  getUserFriendlyMessage(error) {
    if (!error) {
      return this.errorMessages.Default;
    }

    // Se for string, tenta encontrar correspondência
    if (typeof error === 'string') {
      const errorLower = error.toLowerCase();
      for (const [key, message] of Object.entries(this.errorMessages)) {
        if (errorLower.includes(key.toLowerCase())) {
          return message;
        }
      }
      return error; // Retorna a string original se não encontrar correspondência
    }

    // Se for objeto Error
    if (error instanceof Error) {
      const errorName = error.name;
      const errorMessage = error.message;

      // Verifica pelo nome do erro
      if (this.errorMessages[errorName]) {
        return this.errorMessages[errorName];
      }

      // Verifica pela mensagem
      const errorMessageLower = errorMessage.toLowerCase();
      for (const [key, message] of Object.entries(this.errorMessages)) {
        if (errorMessageLower.includes(key.toLowerCase())) {
          return message;
        }
      }

      // Se tiver uma mensagem customizada, usa ela
      if (errorMessage && errorMessage !== errorName) {
        return errorMessage;
      }
    }

    // Se for objeto com propriedade message
    if (error && typeof error === 'object' && error.message) {
      return this.getUserFriendlyMessage(error.message);
    }

    // Fallback
    return this.errorMessages.Default;
  }

  /**
   * Trata um erro, logando e retornando informações úteis
   * @param {Error|string|object} error - O erro ocorrido
   * @param {object} context - Contexto adicional (opcional)
   * @returns {object} Informações sobre o erro tratado
   */
  handleError(error, context = {}) {
    const errorInfo = {
      message: this.getUserFriendlyMessage(error),
      originalError: error,
      context,
      timestamp: new Date().toISOString(),
    };

    // Log do erro
    logger.error('❌ Erro tratado:', {
      message: errorInfo.message,
      context: context.context || 'Unknown',
      error: error instanceof Error ? error.toString() : error,
      stack: error instanceof Error ? error.stack : undefined,
      ...context,
    });

    return errorInfo;
  }

  /**
   * Trata erros de API (fetch)
   * @param {Response} response - Resposta da API
   * @param {object} context - Contexto adicional
   * @returns {Promise<Error>} Erro tratado
   */
  async handleApiError(response, context = {}) {
    let errorMessage = 'Erro ao comunicar com o servidor';
    let errorData = null;

    try {
      errorData = await response.json().catch(() => ({}));
      errorMessage = errorData.error || errorData.message || errorMessage;
    } catch {
      // Se não conseguir parsear JSON, usa status
      errorMessage = `Erro ${response.status}: ${response.statusText}`;
    }

    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = errorData;

    return this.handleError(error, {
      ...context,
      apiError: true,
      status: response.status,
      statusText: response.statusText,
    });
  }

  /**
   * Cria um erro padronizado
   * @param {string} type - Tipo do erro
   * @param {string} message - Mensagem do erro
   * @param {object} details - Detalhes adicionais
   * @returns {Error} Erro criado
   */
  createError(type, message, details = {}) {
    const error = new Error(message);
    error.name = type;
    error.details = details;
    return error;
  }

  /**
   * Verifica se um erro é recuperável
   * @param {Error} error - O erro a verificar
   * @returns {boolean} Se o erro é recuperável
   */
  isRecoverable(error) {
    if (!error) return false;

    // Erros de rede geralmente são recuperáveis
    if (error.message && (
      error.message.includes('fetch') ||
      error.message.includes('network') ||
      error.message.includes('timeout')
    )) {
      return true;
    }

    // Erros 5xx são geralmente temporários
    if (error.status >= 500 && error.status < 600) {
      return true;
    }

    // Erros 429 (rate limit) são temporários
    if (error.status === 429) {
      return true;
    }

    return false;
  }
}

// Exporta instância singleton
export const errorHandler = new ErrorHandler();

// Exporta a classe também para casos especiais
export { ErrorHandler };
