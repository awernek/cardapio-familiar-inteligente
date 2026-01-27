import PropTypes from 'prop-types';
import { User, AlertCircle, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';
import { calculateBMI } from '../../utils/bmi';
import { ProfileShape, IndividualAnswersShape } from '../../types';

/**
 * Componente de pergunta com opções em botão
 */
const QuestionButtons = ({ 
  question, 
  hint,
  value, 
  onChange, 
  options,
  columns = 2,
  questionId
}) => {
  const gridClass = columns === 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2';
  const hintId = hint ? `${questionId}-hint` : undefined;
  
  return (
    <fieldset className="mb-4">
      <legend className="font-medium text-gray-800 mb-1">{question}</legend>
      {hint && (
        <p id={hintId} className="text-xs text-gray-500 mb-2" role="note">
          {hint}
        </p>
      )}
      <div className={`grid ${gridClass} gap-2`} role="radiogroup" aria-labelledby={questionId} aria-describedby={hintId}>
        {options.map(option => (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={value === option.value}
            onClick={() => onChange(option.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onChange(option.value);
              }
            }}
            className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
              value === option.value
                ? 'bg-green-600 text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-700 hover:border-green-300 hover:bg-green-50'
            }`}
            aria-label={option.label}
          >
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
};

/**
 * Componente de input opcional
 */
const OptionalInput = ({ 
  label, 
  placeholder,
  value, 
  onChange,
  inputId
}) => {
  const labelId = `${inputId}-label`;
  
  return (
    <div className="mb-4">
      <label id={labelId} htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
        {label} <span className="text-gray-400 font-normal">(opcional)</span>
      </label>
      <input
        id={inputId}
        type="text"
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        aria-labelledby={labelId}
        aria-required="false"
      />
    </div>
  );
};

/**
 * Componente da etapa de questionários individuais - versão conversacional
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

  // Opções para as perguntas
  const stressOptions = [
    { value: 'baixo', label: 'Tranquilo' },
    { value: 'normal', label: 'Normal' },
    { value: 'alto', label: 'Alto' },
    { value: 'muito-alto', label: 'Muito alto' }
  ];

  const sleepOptions = [
    { value: 'ótimo', label: 'Ótimo' },
    { value: 'bom', label: 'Bom' },
    { value: 'ruim', label: 'Ruim' },
    { value: 'péssimo', label: 'Péssimo' }
  ];

  const energyOptions = [
    { value: 'alta', label: 'Alta' },
    { value: 'normal', label: 'Normal' },
    { value: 'baixa', label: 'Baixa' },
    { value: 'muito-baixa', label: 'Exausto' }
  ];

  const appetiteOptions = [
    { value: 'normal', label: 'Normal' },
    { value: 'aumentado', label: 'Muita fome' },
    { value: 'diminuído', label: 'Pouca fome' },
    { value: 'sem-apetite', label: 'Sem apetite' }
  ];

  const followedPlanOptions = [
    { value: 'sim', label: 'Sim' },
    { value: 'parcialmente', label: 'Em parte' },
    { value: 'nao', label: 'Não' }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
      {/* Cabeçalho conversacional */}
      <div className="flex items-start gap-3 mb-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
          canContinue ? 'bg-green-100' : 'bg-blue-100'
        }`}>
          {canContinue ? '✅' : '💭'}
        </div>
        <div className="flex-1">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Como está {currentProfile.name} essa semana?
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Isso ajuda a personalizar as refeições para o momento de cada pessoa.
          </p>
        </div>
        <div className={`text-sm font-medium px-2 py-1 rounded-full ${
          canContinue ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
        }`}>
          {currentIndex + 1}/{profiles.length}
        </div>
      </div>

      {/* Resumo do perfil - mais compacto */}
      <div className="bg-gray-50 border border-gray-100 p-3 rounded-lg mb-5 flex flex-wrap gap-3 text-sm">
        <span className="text-gray-600">{currentProfile.age} anos</span>
        <span className="text-gray-300">•</span>
        <span className="text-gray-600">{currentProfile.weight}kg</span>
        <span className="text-gray-300">•</span>
        <span className="text-gray-600">IMC {calculateBMI(currentProfile.weight, currentProfile.height)}</span>
        {currentProfile.restrictions && (
          <>
            <span className="text-gray-300">•</span>
            <span className="text-amber-600">{currentProfile.restrictions}</span>
          </>
        )}
      </div>

      {/* Perguntas principais */}
      <div className="space-y-5" role="group" aria-labelledby="questions-heading">
        <h3 id="questions-heading" className="sr-only">Perguntas sobre a semana</h3>
        <QuestionButtons
          question="Como está o estresse essa semana?"
          hint="Isso influencia no tipo de comida que vou sugerir"
          value={currentAnswers.stress}
          onChange={(val) => handleAnswerChange('stress', val)}
          options={stressOptions}
          columns={4}
          questionId="stress-question"
        />

        <QuestionButtons
          question="E o sono, como tem sido?"
          hint="O descanso afeta o metabolismo e as preferências alimentares"
          value={currentAnswers.sleep}
          onChange={(val) => handleAnswerChange('sleep', val)}
          options={sleepOptions}
          columns={4}
          questionId="sleep-question"
        />

        <QuestionButtons
          question="Como está a energia?"
          value={currentAnswers.energy}
          onChange={(val) => handleAnswerChange('energy', val)}
          options={energyOptions}
          columns={4}
          questionId="energy-question"
        />

        <QuestionButtons
          question="E o apetite?"
          hint="Ajuda a ajustar porções e frequência das refeições"
          value={currentAnswers.appetite}
          onChange={(val) => handleAnswerChange('appetite', val)}
          options={appetiteOptions}
          columns={4}
          questionId="appetite-question"
        />
      </div>

      {/* Seção opcional - mais discreta */}
      <div className="mt-6 pt-5 border-t border-gray-100">
        <p className="text-sm font-medium text-gray-500 mb-3">Quer contar mais? (opcional)</p>
        
        <OptionalInput
          label="Algum sintoma específico essa semana?"
          placeholder="Ex: dor de cabeça, enjoo, ansiedade..."
          value={currentAnswers.symptoms}
          onChange={(e) => handleAnswerChange('symptoms', e.target.value)}
          inputId="symptoms-input"
        />

        <OptionalInput
          label="Preferências ou aversões no momento?"
          placeholder="Ex: enjoou de frango, querendo comer doce..."
          value={currentAnswers.preferences}
          onChange={(e) => handleAnswerChange('preferences', e.target.value)}
          inputId="preferences-input"
        />

        {/* Feedback da semana passada - simplificado */}
        <div className="bg-purple-50 border border-purple-100 p-4 rounded-lg" role="region" aria-labelledby="feedback-heading">
          <h3 id="feedback-heading" className="sr-only">Feedback sobre semana anterior</h3>
          <QuestionButtons
            question="Conseguiu seguir o plano da semana passada?"
            value={currentAnswers.followedPlan}
            onChange={(val) => handleAnswerChange('followedPlan', val)}
            options={[
              { value: '', label: 'Primeira vez' },
              ...followedPlanOptions
            ]}
            columns={4}
            questionId="followed-plan-question"
          />
        </div>
      </div>

      {/* Mensagem de validação */}
      {filledRequired > 0 && !canContinue && (
        <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg mt-4 text-sm">
          <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={18} />
          <p className="text-amber-800">
            Falta responder: {
              requiredFields
                .filter(f => !currentAnswers[f] || currentAnswers[f] === '')
                .map(f => ({ stress: 'estresse', sleep: 'sono', energy: 'energia', appetite: 'apetite' }[f]))
                .join(', ')
            }
          </p>
        </div>
      )}

      {/* Botões */}
      <nav className="flex gap-3 sm:gap-4 mt-6" aria-label="Navegação do questionário">
        <button
          onClick={onPrev}
          className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors text-sm sm:text-base flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          aria-label="Voltar para pessoa anterior"
        >
          <ChevronLeft size={18} aria-hidden="true" />
          Voltar
        </button>
        <button
          onClick={onNext}
          disabled={!canContinue}
          className={`flex-1 py-3.5 rounded-xl font-semibold transition-colors text-sm sm:text-base flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
            ${canContinue 
              ? 'bg-green-600 text-white hover:bg-green-700' 
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          aria-label={canContinue 
            ? (currentIndex < profiles.length - 1 ? "Avançar para próxima pessoa" : "Continuar para contexto semanal")
            : "Complete as perguntas obrigatórias para continuar"
          }
          aria-disabled={!canContinue}
        >
          {currentIndex < profiles.length - 1 ? 'Próxima pessoa' : 'Continuar'}
          <ChevronRight size={18} aria-hidden="true" />
        </button>
      </nav>

      {/* Indicador de progresso */}
      <div className="mt-4 flex gap-2 justify-center" role="progressbar" aria-label="Progresso dos questionários" aria-valuenow={currentIndex + 1} aria-valuemin={1} aria-valuemax={profiles.length}>
        {profiles.map((p, i) => {
          const pAnswers = individualAnswers[p.id] || {};
          const pComplete = requiredFields.every(f => pAnswers[f] && pAnswers[f] !== '');
          return (
            <div
              key={p.id}
              className={`h-1.5 rounded-full transition-all ${
                i === currentIndex
                  ? 'w-8 bg-blue-600'
                  : pComplete
                  ? 'w-4 bg-green-500'
                  : 'w-4 bg-gray-300'
              }`}
              title={p.name}
              aria-label={`${p.name}: ${pComplete ? 'completo' : 'incompleto'}`}
              role="img"
            />
          );
        })}
      </div>
    </div>
  );
};

QuestionnaireStep.propTypes = {
  profiles: PropTypes.arrayOf(ProfileShape).isRequired,
  currentIndex: PropTypes.number.isRequired,
  individualAnswers: IndividualAnswersShape.isRequired,
  onSaveAnswers: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onPrev: PropTypes.func.isRequired,
};
