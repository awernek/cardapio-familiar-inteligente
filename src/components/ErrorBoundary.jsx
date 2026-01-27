import { Component } from 'react';
import PropTypes from 'prop-types';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { logger } from '../utils/logger';
import { errorHandler } from '../utils/errorHandler';

/**
 * Error Boundary para capturar erros de renderização
 * e exibir uma UI amigável ao usuário
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Atualiza o state para exibir a UI de erro
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log do erro para debugging
    logger.error('🚨 Error Boundary capturou um erro:', error);
    logger.error('📋 Error Info:', errorInfo);

    // Trata o erro usando o errorHandler
    errorHandler.handleError(error, {
      context: 'ErrorBoundary',
      errorInfo,
      componentStack: errorInfo.componentStack,
    });

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      const isDevelopment = import.meta.env.DEV;
      const errorMessage = errorHandler.getUserFriendlyMessage(this.state.error);

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="text-red-600" size={40} />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Ops! Algo deu errado
            </h1>

            <p className="text-lg text-gray-600 mb-6">
              {errorMessage}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button
                onClick={this.handleReset}
                className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
              >
                <RefreshCw size={20} />
                Tentar Novamente
              </button>

              <button
                onClick={this.handleGoHome}
                className="inline-flex items-center justify-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-700 transition-colors"
              >
                <Home size={20} />
                Voltar ao Início
              </button>
            </div>

            {isDevelopment && this.state.error && (
              <details className="mt-8 text-left bg-gray-50 rounded-lg p-4 border border-gray-200">
                <summary className="cursor-pointer font-semibold text-gray-700 mb-2">
                  Detalhes do Erro (Apenas em Desenvolvimento)
                </summary>
                <div className="mt-2 space-y-2 text-sm">
                  <div>
                    <strong className="text-gray-900">Erro:</strong>
                    <pre className="mt-1 p-2 bg-white rounded border border-gray-300 overflow-auto text-xs text-red-600">
                      {this.state.error.toString()}
                    </pre>
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <strong className="text-gray-900">Stack Trace:</strong>
                      <pre className="mt-1 p-2 bg-white rounded border border-gray-300 overflow-auto text-xs text-gray-600 max-h-40">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Se o problema persistir, entre em contato conosco em{' '}
                <a
                  href="mailto:wernekdev@gmail.com"
                  className="text-green-600 hover:underline"
                >
                  wernekdev@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};
