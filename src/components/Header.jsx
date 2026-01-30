import PropTypes from 'prop-types';
import { useState } from 'react';
import { Sparkles, LogOut, User, UserPlus, History, Settings, ChevronDown, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

/**
 * Componente de cabeçalho com indicador de progresso e navegação
 */
export const Header = ({ 
  step, 
  title = "NURI", 
  subtitle = "Nutrição Inteligente", 
  onCreateAccount,
  onViewHistory,
  onViewAccount 
}) => {
  const { user, signOut, isGuest, exitGuestMode } = useAuth();
  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Usuário';
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6 print:hidden" role="banner">
      {/* Banner informativo modo gratuito */}
      {isGuest && (
        <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-100 rounded-lg px-3 py-2 mb-4 flex items-center justify-between gap-2" role="alert" aria-live="polite">
          <p className="text-xs sm:text-sm text-blue-700">
            Modo gratuito — seus dados não são salvos.
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={onCreateAccount}
              className="inline-flex items-center gap-1 text-xs font-medium bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
              aria-label="Criar conta para salvar seus dados"
            >
              <UserPlus size={14} aria-hidden="true" />
              <span className="hidden sm:inline">Criar conta</span>
              <span className="sm:hidden">Cadastrar</span>
            </button>
            <button
              onClick={onCreateAccount}
              className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-gray-800 whitespace-nowrap"
              aria-label="Entrar na conta"
            >
              <LogIn size={14} aria-hidden="true" />
              <span className="hidden sm:inline">Entrar</span>
            </button>
          </div>
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
        
        {/* Menu do usuário logado */}
        {!isGuest && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-expanded={showMenu}
              aria-haspopup="true"
            >
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <User size={18} className="text-green-600" />
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[120px] truncate">
                {userName}
              </span>
              <ChevronDown size={16} className={`text-gray-500 transition-transform ${showMenu ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Dropdown menu */}
            {showMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowMenu(false)}
                  aria-hidden="true"
                />
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-800 truncate">{userName}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                  
                  <button
                    onClick={() => { setShowMenu(false); onViewHistory?.(); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <History size={18} className="text-gray-400" />
                    Meus Cardápios
                  </button>
                  
                  <button
                    onClick={() => { setShowMenu(false); onViewAccount?.(); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Settings size={18} className="text-gray-400" />
                    Minha Conta
                  </button>
                  
                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <button
                      onClick={() => { setShowMenu(false); signOut(); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={18} />
                      Sair
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
        
        {/* Botão sair para guest */}
        {isGuest && (
          <button
            onClick={exitGuestMode}
            className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1"
            aria-label="Sair do modo gratuito"
          >
            Sair
          </button>
        )}
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
  onViewHistory: PropTypes.func,
  onViewAccount: PropTypes.func,
};
