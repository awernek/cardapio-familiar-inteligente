import { Calendar, CheckCircle, Sparkles } from 'lucide-react';
import { useMenuGeneration } from '../../hooks/useMenuGeneration';

/**
 * Componente da etapa de contexto semanal
 */
export const WeeklyContextStep = ({
  profiles,
  individualAnswers,
  weeklyContext,
  onUpdateContext,
  onGenerateMenu,
  onBack,
  onViewReport
}) => {
  const { generateMenu, loading, error } = useMenuGeneration();

  const handleGenerate = async () => {
    console.log('🚀 Iniciando geração do cardápio...');
    console.log('Profiles:', profiles);
    console.log('Individual Answers:', individualAnswers);
    console.log('Weekly Context:', weeklyContext);
    
    try {
      const menuData = await generateMenu(profiles, individualAnswers, weeklyContext);
      console.log('✅ Cardápio gerado com sucesso:', menuData);
      
      if (menuData) {
        onGenerateMenu(menuData);
      } else {
        throw new Error('Cardápio retornado está vazio');
      }
    } catch (err) {
      console.error('❌ Erro ao gerar cardápio:', err);
      alert(`Erro ao gerar cardápio: ${err.message || 'Erro desconhecido'}. Verifique se o servidor está rodando.`);
    }
  };

  const canGenerate = weeklyContext.busy && 
    weeklyContext.budget && 
    weeklyContext.cookingTime && 
    weeklyContext.groceryTrips && 
    weeklyContext.cookingReality;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <Calendar className="text-blue-600 flex-shrink-0" size={24} />
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Contexto Geral da Semana</h2>
      </div>

      {/* Resumo das pessoas */}
      <div className="bg-green-50 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
        <p className="text-xs sm:text-sm font-semibold text-green-900 mb-2">✅ Questionários individuais completos:</p>
        <div className="flex flex-wrap gap-2">
          {profiles.map(p => (
            <span key={p.id} className="bg-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm text-gray-700 flex items-center gap-1">
              <CheckCircle size={14} className="text-green-600 flex-shrink-0" />
              {p.name}
            </span>
          ))}
        </div>
      </div>

      {/* Botão Gerar Relatório */}
      <button
        onClick={onViewReport}
        className="w-full mb-4 sm:mb-6 py-3 border-2 border-blue-500 text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
      >
        <Calendar size={18} />
        Ver Relatório Completo
      </button>

      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
            Nível de correria da família esta semana?
          </label>
          <select
            value={weeklyContext.busy || ''}
            onChange={(e) => onUpdateContext({...weeklyContext, busy: e.target.value})}
            className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="">Selecione...</option>
            <option value="tranquila">Tranquila</option>
            <option value="normal">Normal</option>
            <option value="corrida">Corrida</option>
            <option value="caótica">Caótica</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
            Orçamento para compras esta semana?
          </label>
          <select
            value={weeklyContext.budget || ''}
            onChange={(e) => onUpdateContext({...weeklyContext, budget: e.target.value})}
            className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="">Selecione...</option>
            <option value="flexível">Flexível</option>
            <option value="normal">Normal</option>
            <option value="apertado">Apertado</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
            Vai fazer mercado quantas vezes esta semana?
          </label>
          <select
            value={weeklyContext.groceryTrips || ''}
            onChange={(e) => onUpdateContext({...weeklyContext, groceryTrips: e.target.value})}
            className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="">Selecione...</option>
            <option value="1">1 vez (compra grande)</option>
            <option value="2">2 vezes</option>
            <option value="3-mais">3 ou mais vezes</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
            Quanto tempo disponível para cozinhar por dia?
          </label>
          <select
            value={weeklyContext.cookingTime || ''}
            onChange={(e) => onUpdateContext({...weeklyContext, cookingTime: e.target.value})}
            className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="">Selecione...</option>
            <option value="muito-tempo">Mais de 1h (tempo para cozinhar)</option>
            <option value="tempo-normal">30min - 1h (tempo razoável)</option>
            <option value="pouco-tempo">15-30min (corrido)</option>
            <option value="mínimo">Menos de 15min (só o básico)</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
            Nesta semana, você:
          </label>
          <select
            value={weeklyContext.cookingReality || ''}
            onChange={(e) => onUpdateContext({...weeklyContext, cookingReality: e.target.value})}
            className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="">Selecione...</option>
            <option value="consegue-cozinhar">Consegue cozinhar normalmente</option>
            <option value="prefere-pratico">Prefere opções práticas/semi-prontas</option>
            <option value="improviso">Vai se virar no improviso</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-3 sm:gap-4 mt-6">
        <button
          onClick={onBack}
          className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors text-sm sm:text-base"
        >
          ← Voltar
        </button>
        <button
          onClick={() => {
            console.log('🔘 Botão clicado!');
            console.log('canGenerate:', canGenerate);
            console.log('loading:', loading);
            handleGenerate();
          }}
          disabled={!canGenerate || loading}
          className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
              <span className="hidden sm:inline">Gerando cardápio personalizado...</span>
              <span className="sm:hidden">Gerando...</span>
            </>
          ) : (
            <>
              <Sparkles size={18} />
              Gerar Cardápio Semanal
            </>
          )}
        </button>
      </div>
    </div>
  );
};
