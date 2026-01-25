import { Sparkles, LogOut, User, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

/**
 * Componente de cabeçalho com indicador de progresso
 */
export const Header = ({ step, title = "Cardápio Familiar Inteligente", subtitle = "Alimentação personalizada para cada membro da família", onCreateAccount }) => {
  const { user, signOut, isGuest, exitGuestMode } = useAuth();
  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Visitante';

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6 print:hidden">
      {/* Banner de modo demonstração */}
      {isGuest && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="text-sm text-amber-800">
            <span className="font-semibold">Modo Demonstração</span> — Seus dados não serão salvos. 
          </p>
          <button
            onClick={onCreateAccount}
            className="inline-flex items-center gap-1 text-sm font-medium text-amber-700 hover:text-amber-900 bg-amber-100 hover:bg-amber-200 px-3 py-1 rounded-lg transition-colors"
          >
            <UserPlus size={14} />
            Criar conta grátis
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
                title="Sair"
              >
                <LogOut size={20} />
              </button>
            </>
          )}
          {isGuest && (
            <button
              onClick={exitGuestMode}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Sair
            </button>
          )}
        </div>
      </div>
      
      {/* Progress indicator */}
      {step !== 'menu' && step !== 'report' && (
        <div className="mt-4 flex items-center gap-1 sm:gap-2">
          <div className={`flex items-center gap-1 sm:gap-2 ${step === 'profiles' ? 'text-green-600 font-semibold' : 'text-gray-400'}`}>
            <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm ${step === 'profiles' ? 'bg-green-600 text-white' : 'bg-gray-300'}`}>1</div>
            <span className="hidden sm:inline text-xs sm:text-sm">Perfis</span>
          </div>
          <div className="flex-1 h-1 bg-gray-300 rounded"></div>
          <div className={`flex items-center gap-1 sm:gap-2 ${step === 'questionnaire' ? 'text-green-600 font-semibold' : 'text-gray-400'}`}>
            <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm ${step === 'questionnaire' ? 'bg-green-600 text-white' : 'bg-gray-300'}`}>2</div>
            <span className="hidden sm:inline text-xs sm:text-sm">Questionários</span>
          </div>
          <div className="flex-1 h-1 bg-gray-300 rounded"></div>
          <div className={`flex items-center gap-1 sm:gap-2 ${step === 'weekly-context' ? 'text-green-600 font-semibold' : 'text-gray-400'}`}>
            <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm ${step === 'weekly-context' ? 'bg-green-600 text-white' : 'bg-gray-300'}`}>3</div>
            <span className="hidden sm:inline text-xs sm:text-sm">Contexto</span>
          </div>
        </div>
      )}
    </div>
  );
};
