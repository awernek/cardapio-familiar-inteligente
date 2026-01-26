import { User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { calculateBMI } from '../../utils/bmi';

/**
 * Componente de label com indicador de obrigatório/opcional
 */
const Label = ({ children, required = false, optional = false }) => (
  <label className="block text-sm font-medium text-gray-700 mb-2">
    {children}
    {required && <span className="text-red-500 ml-1">*</span>}
    {optional && <span className="text-gray-400 ml-1 font-normal">(opcional)</span>}
  </label>
);

/**
 * Componente de select com validação visual
 */
const SelectField = ({ 
  label, 
  required = false, 
  optional = false, 
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
      {label && <Label required={required} optional={optional}>{label}</Label>}
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
 * Componente de input com validação visual
 */
const InputField = ({ 
  label, 
  required = false, 
  optional = false, 
  value, 
  showValidation = false,
  ...props 
}) => {
  const hasValue = value !== '' && value !== undefined && value !== null;
  const showSuccess = showValidation && hasValue;
  
  return (
    <div>
      {label && <Label required={required} optional={optional}>{label}</Label>}
      <div className="relative">
        <input
          value={value}
          {...props}
          className={`w-full px-3 sm:px-4 py-2.5 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors
            ${showSuccess ? 'border-green-300 bg-green-50' : 'border-gray-300'}
          `}
        />
        {showSuccess && (
          <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" size={18} />
        )}
      </div>
    </div>
  );
};

/**
 * Componente da etapa de questionários individuais
 */
export const QuestionnaireStep = ({
  profiles,
  currentIndex,
  individualAnswers,
  onSaveAnswers,
  onNext,
  onPrev
}) => {
  const currentProfile = profiles[currentIndex];
  if (!currentProfile) return null;

  const currentAnswers = individualAnswers[currentProfile.id] || {};

  const handleAnswerChange = (field, value) => {
    onSaveAnswers(currentProfile.id, {
      ...currentAnswers,
      [field]: value
    });
  };

  // Campos obrigatórios
  const requiredFields = ['stress', 'sleep', 'energy', 'appetite'];
  const filledRequired = requiredFields.filter(f => currentAnswers[f] && currentAnswers[f] !== '').length;
  const totalRequired = requiredFields.length;
  const canContinue = filledRequired === totalRequired;
  const showValidation = filledRequired > 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            canContinue ? 'bg-green-500' : 'bg-blue-500'
          }`}>
            {canContinue ? (
              <CheckCircle2 className="text-white" size={20} />
            ) : (
              <User className="text-white" size={20} />
            )}
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              Como está {currentProfile.name}?
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Pessoa {currentIndex + 1} de {profiles.length}
            </p>
          </div>
        </div>
        <div className={`text-sm font-medium ${canContinue ? 'text-green-600' : 'text-gray-500'}`}>
          {canContinue ? (
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
      <p className="text-sm text-gray-500 mb-4">
        Responda sobre o estado atual desta semana. Campos com <span className="text-red-500">*</span> são obrigatórios.
      </p>

      {/* Perfil resumido */}
      <div className="bg-blue-50 border border-blue-100 p-3 sm:p-4 rounded-lg mb-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-xs sm:text-sm">
          <div>
            <p className="text-gray-600">Idade</p>
            <p className="font-semibold text-gray-800">{currentProfile.age} anos</p>
          </div>
          <div>
            <p className="text-gray-600">Peso/Altura</p>
            <p className="font-semibold text-gray-800">{currentProfile.weight}kg / {currentProfile.height}cm</p>
          </div>
          <div>
            <p className="text-gray-600">IMC</p>
            <p className="font-semibold text-gray-800">{calculateBMI(currentProfile.weight, currentProfile.height)}</p>
          </div>
          <div>
            <p className="text-gray-600">Biotipo</p>
            <p className="font-semibold text-gray-800 text-xs">
              {currentProfile.bodyType === 'naturalmente-magro' ? 'Magro natural' : 
               currentProfile.bodyType === 'peso-normal' ? 'Equilibrado' : 'Ganha peso fácil'}
            </p>
          </div>
        </div>
        {currentProfile.restrictions && (
          <p className="text-xs sm:text-sm text-gray-700 mt-2">
            <strong>Restrições:</strong> {currentProfile.restrictions}
          </p>
        )}
        {currentProfile.healthConditions && (
          <p className="text-xs sm:text-sm text-gray-700 mt-1">
            <strong>Condições:</strong> {currentProfile.healthConditions}
          </p>
        )}
      </div>

      {/* Seção: Estado Atual (Obrigatórios) */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-px flex-1 bg-gray-300"></div>
          <span className="text-xs font-semibold text-gray-500 uppercase">Estado Atual</span>
          <div className="h-px flex-1 bg-gray-300"></div>
        </div>

        <div className="space-y-4">
          {/* Estresse */}
          <SelectField
            label="Como está o nível de estresse esta semana?"
            required
            value={currentAnswers.stress || ''}
            onChange={(e) => handleAnswerChange('stress', e.target.value)}
            showValidation={showValidation}
          >
            <option value="">Selecione...</option>
            <option value="baixo">Baixo / tranquilo</option>
            <option value="normal">Normal / controlável</option>
            <option value="alto">Alto / tenso</option>
            <option value="muito-alto">Muito alto / exaustivo</option>
          </SelectField>

          {/* Quando o estresse piora */}
          {currentAnswers.stress && ['alto', 'muito-alto'].includes(currentAnswers.stress) && (
            <SelectField
              label="Quando o estresse piora mais?"
              optional
              value={currentAnswers.stressTime || ''}
              onChange={(e) => handleAnswerChange('stressTime', e.target.value)}
            >
              <option value="">Selecione...</option>
              <option value="manha">Manhã</option>
              <option value="tarde">Tarde</option>
              <option value="noite">Noite</option>
              <option value="dia-inteiro">O dia inteiro</option>
            </SelectField>
          )}

          {/* Sono */}
          <SelectField
            label="Como tem sido o sono?"
            required
            value={currentAnswers.sleep || ''}
            onChange={(e) => handleAnswerChange('sleep', e.target.value)}
            showValidation={showValidation}
          >
            <option value="">Selecione...</option>
            <option value="ótimo">Ótimo (dormindo bem)</option>
            <option value="bom">Bom (dormindo razoável)</option>
            <option value="ruim">Ruim (acordando cansado)</option>
            <option value="péssimo">Péssimo (insônia/sono fragmentado)</option>
          </SelectField>

          {/* Detalhes do sono */}
          {currentAnswers.sleep && ['ruim', 'péssimo'].includes(currentAnswers.sleep) && (
            <>
              <SelectField
                label="Quantas horas de sono, em média?"
                optional
                value={currentAnswers.sleepHours || ''}
                onChange={(e) => handleAnswerChange('sleepHours', e.target.value)}
              >
                <option value="">Selecione...</option>
                <option value="menos-4">Menos de 4h</option>
                <option value="4-6">4-6 horas</option>
                <option value="6-7">6-7 horas</option>
                <option value="7-mais">7 horas ou mais</option>
              </SelectField>
              <SelectField
                label="O problema é mais:"
                optional
                value={currentAnswers.sleepProblem || ''}
                onChange={(e) => handleAnswerChange('sleepProblem', e.target.value)}
              >
                <option value="">Selecione...</option>
                <option value="dificuldade-dormir">Dificuldade para dormir</option>
                <option value="acorda-muito">Acordar várias vezes</option>
                <option value="acorda-cansado">Acordar cansado</option>
                <option value="tudo">Um pouco de tudo</option>
              </SelectField>
            </>
          )}

          {/* Energia */}
          <SelectField
            label="Como está o nível de energia?"
            required
            value={currentAnswers.energy || ''}
            onChange={(e) => handleAnswerChange('energy', e.target.value)}
            showValidation={showValidation}
          >
            <option value="">Selecione...</option>
            <option value="alta">Alta (disposto)</option>
            <option value="normal">Normal</option>
            <option value="baixa">Baixa (cansado)</option>
            <option value="muito-baixa">Muito baixa (exausto)</option>
          </SelectField>

          {/* Apetite */}
          <SelectField
            label="Como está o apetite?"
            required
            value={currentAnswers.appetite || ''}
            onChange={(e) => handleAnswerChange('appetite', e.target.value)}
            showValidation={showValidation}
          >
            <option value="">Selecione...</option>
            <option value="normal">Normal</option>
            <option value="aumentado">Aumentado (muita fome)</option>
            <option value="diminuído">Diminuído (pouca fome)</option>
            <option value="sem-apetite">Sem apetite</option>
          </SelectField>

          {/* Quando a fome é menor */}
          {currentAnswers.appetite && ['diminuído', 'sem-apetite'].includes(currentAnswers.appetite) && (
            <SelectField
              label="Quando a fome é menor?"
              optional
              value={currentAnswers.appetiteTime || ''}
              onChange={(e) => handleAnswerChange('appetiteTime', e.target.value)}
            >
              <option value="">Selecione...</option>
              <option value="manha">Manhã</option>
              <option value="almoco">Almoço</option>
              <option value="noite">Noite</option>
              <option value="sempre">O tempo todo</option>
            </SelectField>
          )}
        </div>
      </div>

      {/* Seção: Informações Adicionais (Opcionais) */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-px flex-1 bg-gray-300"></div>
          <span className="text-xs font-semibold text-gray-500 uppercase">Informações Adicionais</span>
          <div className="h-px flex-1 bg-gray-300"></div>
        </div>

        <div className="space-y-4">
          {/* Sintomas */}
          <InputField
            label="Sintomas específicos esta semana?"
            optional
            type="text"
            value={currentAnswers.symptoms || ''}
            onChange={(e) => handleAnswerChange('symptoms', e.target.value)}
            placeholder="Ex: dor de cabeça, enjoo, TPM, ansiedade piorou"
          />

          {/* Preferências */}
          <InputField
            label="Preferências ou aversões alimentares?"
            optional
            type="text"
            value={currentAnswers.preferences || ''}
            onChange={(e) => handleAnswerChange('preferences', e.target.value)}
            placeholder="Ex: enjoou de frango, querendo comer doce"
          />
        </div>
      </div>

      {/* Seção: Feedback da Semana Passada */}
      <div className="bg-purple-50 border border-purple-100 p-4 rounded-lg mb-6">
        <p className="font-semibold text-purple-900 text-sm sm:text-base mb-4">Sobre a semana passada:</p>
        
        <div className="space-y-4">
          <SelectField
            label="Conseguiu seguir o plano alimentar?"
            optional
            value={currentAnswers.followedPlan || ''}
            onChange={(e) => handleAnswerChange('followedPlan', e.target.value)}
          >
            <option value="">Primeira vez / Não se aplica</option>
            <option value="sim">Sim</option>
            <option value="parcialmente">Parcialmente</option>
            <option value="nao">Não</option>
          </SelectField>

          {currentAnswers.followedPlan && ['parcialmente', 'nao'].includes(currentAnswers.followedPlan) && (
            <SelectField
              label="Principal motivo:"
              optional
              value={currentAnswers.notFollowedReason || ''}
              onChange={(e) => handleAnswerChange('notFollowedReason', e.target.value)}
            >
              <option value="">Selecione...</option>
              <option value="falta-tempo">Falta de tempo</option>
              <option value="falta-fome">Falta de fome/apetite</option>
              <option value="enjoou">Enjoou da comida</option>
              <option value="esqueceu">Esqueceu de seguir</option>
              <option value="nao-ajudou">Não ajudou no emocional</option>
              <option value="dificil-preparar">Difícil de preparar</option>
              <option value="outro">Outro motivo</option>
            </SelectField>
          )}
        </div>
      </div>

      {/* Mensagem de validação */}
      {showValidation && !canContinue && (
        <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg mb-4 text-sm">
          <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-amber-800 font-medium">Preencha os campos obrigatórios</p>
            <p className="text-amber-700">
              Faltam {totalRequired - filledRequired} campo(s): {
                requiredFields
                  .filter(f => !currentAnswers[f] || currentAnswers[f] === '')
                  .map(f => {
                    const labels = {
                      stress: 'Estresse',
                      sleep: 'Sono',
                      energy: 'Energia',
                      appetite: 'Apetite'
                    };
                    return labels[f];
                  })
                  .join(', ')
              }
            </p>
          </div>
        </div>
      )}

      {/* Botões */}
      <div className="flex gap-3 sm:gap-4">
        <button
          onClick={onPrev}
          className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors text-sm sm:text-base"
        >
          Voltar
        </button>
        <button
          onClick={onNext}
          disabled={!canContinue}
          className={`flex-1 py-3.5 rounded-xl font-semibold transition-colors text-sm sm:text-base flex items-center justify-center gap-2
            ${canContinue 
              ? 'bg-green-600 text-white hover:bg-green-700' 
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
        >
          {canContinue && <CheckCircle2 size={18} />}
          {currentIndex < profiles.length - 1 ? 'Próxima pessoa' : 'Finalizar'}
        </button>
      </div>

      {/* Indicador de progresso */}
      <div className="mt-4 flex gap-2 justify-center">
        {profiles.map((p, i) => {
          const pAnswers = individualAnswers[p.id] || {};
          const pComplete = requiredFields.every(f => pAnswers[f] && pAnswers[f] !== '');
          return (
            <div
              key={p.id}
              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-colors ${
                i === currentIndex
                  ? 'bg-blue-600 ring-2 ring-blue-200'
                  : pComplete
                  ? 'bg-green-500'
                  : pAnswers.stress
                  ? 'bg-yellow-400'
                  : 'bg-gray-300'
              }`}
              title={p.name}
            />
          );
        })}
      </div>
    </div>
  );
};
