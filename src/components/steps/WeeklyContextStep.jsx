import { Calendar, CheckCircle, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useMenuGeneration } from '../../hooks/useMenuGeneration';

/**
 * Componente de label com indicador de obrigatório/opcional
 */
const Label = ({ children, required = false }) => (
  <label className="block text-sm font-medium text-gray-700 mb-2">
    {children}
    {required && <span className="text-red-500 ml-1">*</span>}
  </label>
);

/**
 * Componente de select com validação visual
 */
const SelectField = ({ 
  label, 
  required = false, 
  value, 
  children,
  showValidation = false,
  ...props 
}) => {
  const hasValue = value !== '' && value !== undefined && value !== null;
  const showSuccess = showValidation && hasValue;
  const showError = showValidation && required && !hasValue;
  
  return (
    <div>
      {label && <Label required={required}>{label}</Label>}
      <div className="relative">
        <select
          value={value}
          {...props}
          className={`w-full px-3 sm:px-4 py-2.5 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors appearance-none bg-white
            ${showError ? 'border-red-300 bg-red-50' : ''}
            ${showSuccess ? 'border-green-300 bg-green-50' : ''}
            ${!showError && !showSuccess ? 'border-gray-300' : ''}
          `}
        >
          {children}
        </select>
        {showSuccess && (
          <CheckCircle2 className="absolute right-8 top-1/2 -translate-y-1/2 text-green-500" size={18} />
        )}
      </div>
    </div>
  );
};

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

  // Campos obrigatórios
  const requiredFields = ['busy', 'budget', 'cookingTime', 'groceryTrips', 'cookingReality'];
  const filledRequired = requiredFields.filter(f => weeklyContext[f] && weeklyContext[f] !== '').length;
  const totalRequired = requiredFields.length;
  const canGenerate = filledRequired === totalRequired;
  const showValidation = filledRequired > 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Calendar className="text-blue-600 flex-shrink-0" size={24} />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Contexto da Semana</h2>
        </div>
        <div className={`text-sm font-medium ${canGenerate ? 'text-green-600' : 'text-gray-500'}`}>
          {canGenerate ? (
            <span className="flex items-center gap-1">
              <CheckCircle2 size={16} />
              Pronto!
            </span>
          ) : (
            `${filledRequired}/${totalRequired}`
          )}
        </div>
      </div>
      
      {/* Instrução */}
      <p className="text-sm text-gray-500 mb-4 sm:mb-5">
        Conte como será sua semana. Campos com <span className="text-red-500">*</span> são obrigatórios.
      </p>

      {/* Resumo das pessoas */}
      <div className="bg-green-50 border border-green-100 p-3 sm:p-4 rounded-lg mb-5">
        <p className="text-xs sm:text-sm font-semibold text-green-900 mb-2">Questionários concluídos:</p>
        <div className="flex flex-wrap gap-2">
          {profiles.map(p => (
            <span key={p.id} className="bg-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm text-gray-700 flex items-center gap-1 border border-green-200">
              <CheckCircle size={14} className="text-green-600 flex-shrink-0" />
              {p.name}
            </span>
          ))}
        </div>
      </div>

      {/* Botão Gerar Relatório */}
      <button
        onClick={onViewReport}
        className="w-full mb-5 py-3 border-2 border-blue-500 text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
      >
        <Calendar size={18} />
        Ver Relatório Completo
      </button>

      {/* Formulário */}
      <div className="space-y-4">
        <SelectField
          label="Nível de correria da família esta semana"
          required
          value={weeklyContext.busy || ''}
          onChange={(e) => onUpdateContext({...weeklyContext, busy: e.target.value})}
          showValidation={showValidation}
        >
          <option value="">Selecione...</option>
          <option value="tranquila">Tranquila</option>
          <option value="normal">Normal</option>
          <option value="corrida">Corrida</option>
          <option value="caótica">Caótica</option>
        </SelectField>

        <SelectField
          label="Orçamento para compras esta semana"
          required
          value={weeklyContext.budget || ''}
          onChange={(e) => onUpdateContext({...weeklyContext, budget: e.target.value})}
          showValidation={showValidation}
        >
          <option value="">Selecione...</option>
          <option value="flexível">Flexível</option>
          <option value="normal">Normal</option>
          <option value="apertado">Apertado</option>
        </SelectField>

        <SelectField
          label="Quantas vezes vai ao mercado esta semana"
          required
          value={weeklyContext.groceryTrips || ''}
          onChange={(e) => onUpdateContext({...weeklyContext, groceryTrips: e.target.value})}
          showValidation={showValidation}
        >
          <option value="">Selecione...</option>
          <option value="1">1 vez (compra grande)</option>
          <option value="2">2 vezes</option>
          <option value="3-mais">3 ou mais vezes</option>
        </SelectField>

        <SelectField
          label="Tempo disponível para cozinhar por dia"
          required
          value={weeklyContext.cookingTime || ''}
          onChange={(e) => onUpdateContext({...weeklyContext, cookingTime: e.target.value})}
          showValidation={showValidation}
        >
          <option value="">Selecione...</option>
          <option value="muito-tempo">Mais de 1h (tempo para cozinhar)</option>
          <option value="tempo-normal">30min - 1h (tempo razoável)</option>
          <option value="pouco-tempo">15-30min (corrido)</option>
          <option value="mínimo">Menos de 15min (só o básico)</option>
        </SelectField>

        <SelectField
          label="Realidade da cozinha nesta semana"
          required
          value={weeklyContext.cookingReality || ''}
          onChange={(e) => onUpdateContext({...weeklyContext, cookingReality: e.target.value})}
          showValidation={showValidation}
        >
          <option value="">Selecione...</option>
          <option value="consegue-cozinhar">Consigo cozinhar normalmente</option>
          <option value="prefere-pratico">Prefiro opções práticas/semi-prontas</option>
          <option value="improviso">Vou me virar no improviso</option>
        </SelectField>
      </div>

      {/* Erro da API */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-start gap-2">
          <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Mensagem de validação */}
      {showValidation && !canGenerate && (
        <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg mt-4 text-sm">
          <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-amber-800 font-medium">Preencha todos os campos</p>
            <p className="text-amber-700">
              Faltam {totalRequired - filledRequired} campo(s) para gerar o cardápio
            </p>
          </div>
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
