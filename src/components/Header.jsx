import PropTypes from 'prop-types';
import { Sparkles, LogOut, User, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

/**
 * Componente de cabeçalho com indicador de progresso
 */
export const Header = ({ step, title = "Cardápio Familiar Inteligente", subtitle = "Alimentação personalizada para toda a família", onCreateAccount }) => {
  const { user, signOut, isGuest, exitGuestMode } = useAuth();
  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Visitante';

  return (
    <header className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6 print:hidden" role="banner">
      {/* Banner informativo modo gratuito */}
      {isGuest && (
        <div className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 mb-4 flex items-center justify-between gap-2" role="alert" aria-live="polite">
          <p className="text-xs sm:text-sm text-blue-700">
            Modo gratuito — seus dados são usados apenas para gerar o cardápio e não são salvos.
          </p>
          <button
            onClick={onCreateAccount}
            className="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 whitespace-nowrap"
            aria-label="Criar conta para salvar seus dados"
          >
            <UserPlus size={12} aria-hidden="true" />
            Criar conta
          </button>
        </div>
      )}

      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <Sparkles className="text-green-600 flex-shrink-0" size={28} />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{title}</h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600">{subtitle}</p>
        </div>
        
        {/* Usuário e logout */}
        <div className="flex items-center gap-2">
          {!isGuest && (
            <>
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
                <User size={16} />
                <span>{userName}</span>
              </div>
              <button
                onClick={signOut}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                aria-label="Sair da conta"
                title="Sair"
              >
                <LogOut size={20} aria-hidden="true" />
              </button>
            </>
          )}
          {isGuest && (
            <button
              onClick={exitGuestMode}
              className="text-sm text-gray-500 hover:text-gray-700"
              aria-label="Sair do modo gratuito"
            >
              Sair
            </button>
          )}
        </div>
      </div>
      
      {/* Progress indicator */}
      {step !== 'menu' && step !== 'report' && (
        <nav className="mt-4" aria-label="Progresso do cadastro">
          <ol className="flex items-center gap-1 sm:gap-2" role="list">
            <li className={`flex items-center gap-1 sm:gap-2 ${step === 'profiles' ? 'text-green-600 font-semibold' : 'text-gray-400'}`}>
              <div 
                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm ${step === 'profiles' ? 'bg-green-600 text-white' : 'bg-gray-300'}`}
                aria-current={step === 'profiles' ? 'step' : undefined}
              >
                1
              </div>
              <span className="hidden sm:inline text-xs sm:text-sm">Perfis</span>
            </li>
            <li className="flex-1 h-1 bg-gray-300 rounded" aria-hidden="true"></li>
            <li className={`flex items-center gap-1 sm:gap-2 ${step === 'questionnaire' ? 'text-green-600 font-semibold' : 'text-gray-400'}`}>
              <div 
                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm ${step === 'questionnaire' ? 'bg-green-600 text-white' : 'bg-gray-300'}`}
                aria-current={step === 'questionnaire' ? 'step' : undefined}
              >
                2
              </div>
              <span className="hidden sm:inline text-xs sm:text-sm">Questionários</span>
            </li>
            <li className="flex-1 h-1 bg-gray-300 rounded" aria-hidden="true"></li>
            <li className={`flex items-center gap-1 sm:gap-2 ${step === 'weekly-context' ? 'text-green-600 font-semibold' : 'text-gray-400'}`}>
              <div 
                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm ${step === 'weekly-context' ? 'bg-green-600 text-white' : 'bg-gray-300'}`}
                aria-current={step === 'weekly-context' ? 'step' : undefined}
              >
                3
              </div>
              <span className="hidden sm:inline text-xs sm:text-sm">Contexto</span>
            </li>
          </ol>
        </nav>
      )}
    </header>
  );
};

Header.propTypes = {
  step: PropTypes.string.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  onCreateAccount: PropTypes.func,
};
