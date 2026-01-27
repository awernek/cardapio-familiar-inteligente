import { Calendar, CheckCircle, Sparkles, AlertCircle, CheckCircle2, Clock, ShoppingCart, ChefHat, Wallet } from 'lucide-react';
import { useMenuGeneration } from '../../hooks/useMenuGeneration';

/**
 * Componente de pergunta conversacional
 */
const QuestionCard = ({ 
  icon: Icon, 
  iconBg = 'bg-blue-100',
  iconColor = 'text-blue-600',
  question, 
  hint,
  value, 
  onChange, 
  options,
  isComplete 
}) => {
  return (
    <div className={`p-4 rounded-xl border-2 transition-all ${
      isComplete ? 'border-green-200 bg-green-50/50' : 'border-gray-100 bg-gray-50'
    }`}>
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-8 h-8 ${iconBg} rounded-full flex items-center justify-center flex-shrink-0`}>
          <Icon className={iconColor} size={16} />
        </div>
        <div className="flex-1">
          <p className="font-medium text-gray-800">{question}</p>
          {hint && <p className="text-xs text-gray-500 mt-0.5">{hint}</p>}
        </div>
        {isComplete && <CheckCircle2 className="text-green-500 flex-shrink-0" size={18} />}
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {options.map(option => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              value === option.value
                ? 'bg-green-600 text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-700 hover:border-green-300 hover:bg-green-50'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

/**
 * Componente da etapa de contexto semanal - versão conversacional
 */
export const WeeklyContextStep = ({
  profiles,
  individualAnswers,
  weeklyContext,
  familyLocation,
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
    console.log('Family Location:', familyLocation);
    
    try {
      // Passa a localização junto com o contexto semanal
      const contextWithLocation = {
        ...weeklyContext,
        location: familyLocation
      };
      const menuData = await generateMenu(profiles, individualAnswers, contextWithLocation);
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

  // Campos obrigatórios
  const requiredFields = ['busy', 'budget', 'cookingTime', 'groceryTrips', 'cookingReality'];
  const filledRequired = requiredFields.filter(f => weeklyContext[f] && weeklyContext[f] !== '').length;
  const totalRequired = requiredFields.length;
  const canGenerate = filledRequired === totalRequired;

  // Opções para cada pergunta
  const busyOptions = [
    { value: 'tranquila', label: 'Tranquila' },
    { value: 'normal', label: 'Normal' },
    { value: 'corrida', label: 'Corrida' },
    { value: 'caótica', label: 'Caótica' }
  ];

  const budgetOptions = [
    { value: 'bem_apertado', label: 'Bem apertado' },
    { value: 'controlado', label: 'Controlado' },
    { value: 'confortavel', label: 'Confortável' },
    { value: 'livre', label: 'Livre' }
  ];

  const groceryOptions = [
    { value: '1', label: '1 vez' },
    { value: '2', label: '2 vezes' },
    { value: '3-mais', label: '3 ou mais' }
  ];

  const cookingTimeOptions = [
    { value: 'mínimo', label: 'Até 15min' },
    { value: 'pouco-tempo', label: '15-30min' },
    { value: 'tempo-normal', label: '30min-1h' },
    { value: 'muito-tempo', label: 'Mais de 1h' }
  ];

  const cookingRealityOptions = [
    { value: 'consegue-cozinhar', label: 'Normal' },
    { value: 'prefere-pratico', label: 'Prático' },
    { value: 'improviso', label: 'Improviso' }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
      {/* Cabeçalho */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-xl">📅</span>
        </div>
        <div className="flex-1">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Como será essa semana?
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Essas informações ajudam a criar um cardápio que realmente funcione na correria do dia a dia.
          </p>
        </div>
        <div className={`text-sm font-medium px-2 py-1 rounded-full ${
          canGenerate ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
        }`}>
          {filledRequired}/{totalRequired}
        </div>
      </div>

      {/* Resumo das pessoas */}
      <div className="bg-green-50 border border-green-100 p-3 rounded-lg mb-5">
        <p className="text-xs font-semibold text-green-800 mb-2">Cardápio para:</p>
        <div className="flex flex-wrap gap-2">
          {profiles.map(p => (
            <span key={p.id} className="bg-white px-2 py-1 rounded-full text-xs text-gray-700 flex items-center gap-1 border border-green-200">
              <CheckCircle size={12} className="text-green-600" />
              {p.name}
            </span>
          ))}
        </div>
      </div>

      {/* Perguntas conversacionais */}
      <div className="space-y-4">
        <QuestionCard
          icon={Clock}
          iconBg="bg-orange-100"
          iconColor="text-orange-600"
          question="Como está a correria essa semana?"
          hint="Isso ajuda a definir a complexidade das receitas"
          value={weeklyContext.busy}
          onChange={(val) => onUpdateContext({...weeklyContext, busy: val})}
          options={busyOptions}
          isComplete={!!weeklyContext.busy}
        />

        <QuestionCard
          icon={Wallet}
          iconBg="bg-green-100"
          iconColor="text-green-600"
          question="E o orçamento para comida essa semana?"
          hint="Vou sugerir ingredientes que cabem no bolso"
          value={weeklyContext.budget}
          onChange={(val) => onUpdateContext({...weeklyContext, budget: val})}
          options={budgetOptions}
          isComplete={!!weeklyContext.budget}
        />

        <QuestionCard
          icon={ShoppingCart}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          question="Quantas vezes vai ao mercado?"
          hint="Ajuda a planejar ingredientes frescos vs. duráveis"
          value={weeklyContext.groceryTrips}
          onChange={(val) => onUpdateContext({...weeklyContext, groceryTrips: val})}
          options={groceryOptions}
          isComplete={!!weeklyContext.groceryTrips}
        />

        <QuestionCard
          icon={ChefHat}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
          question="Quanto tempo para cozinhar por dia?"
          value={weeklyContext.cookingTime}
          onChange={(val) => onUpdateContext({...weeklyContext, cookingTime: val})}
          options={cookingTimeOptions}
          isComplete={!!weeklyContext.cookingTime}
        />

        <QuestionCard
          icon={ChefHat}
          iconBg="bg-amber-100"
          iconColor="text-amber-600"
          question="Como vai ser na cozinha?"
          hint="Cozinhar do zero, usar práticos ou improvisar?"
          value={weeklyContext.cookingReality}
          onChange={(val) => onUpdateContext({...weeklyContext, cookingReality: val})}
          options={cookingRealityOptions}
          isComplete={!!weeklyContext.cookingReality}
        />
      </div>

      {/* Botão Gerar Relatório */}
      <button
        onClick={onViewReport}
        className="w-full mt-5 py-3 border-2 border-blue-500 text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
      >
        <Calendar size={18} />
        Ver Relatório Completo
      </button>

      {/* Erro da API */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-start gap-2">
          <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Mensagem de validação */}
      {!canGenerate && filledRequired > 0 && (
        <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg mt-4 text-sm">
          <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={18} />
          <p className="text-amber-800">
            Responda todas as perguntas para gerar o cardápio ({totalRequired - filledRequired} restante{totalRequired - filledRequired > 1 ? 's' : ''})
          </p>
        </div>
      )}

      {/* Botões */}
      <div className="flex gap-3 sm:gap-4 mt-6">
        <button
          onClick={onBack}
          className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors text-sm sm:text-base"
        >
          Voltar
        </button>
        <button
          onClick={() => {
            console.log('🔘 Botão clicado!');
            console.log('canGenerate:', canGenerate);
            console.log('loading:', loading);
            handleGenerate();
          }}
          disabled={!canGenerate || loading}
          className={`flex-1 py-3.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 text-sm sm:text-base
            ${canGenerate && !loading 
              ? 'bg-green-600 text-white hover:bg-green-700' 
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-current"></div>
              <span className="hidden sm:inline">Gerando cardápio...</span>
              <span className="sm:hidden">Gerando...</span>
            </>
          ) : (
            <>
              {canGenerate && <Sparkles size={18} />}
              Gerar Cardápio
            </>
          )}
        </button>
      </div>
    </div>
  );
};
