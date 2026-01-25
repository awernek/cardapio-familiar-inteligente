import { User } from 'lucide-react';
import { calculateBMI } from '../../utils/bmi';

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

  const canContinue = currentAnswers.stress && 
    currentAnswers.sleep && 
    currentAnswers.energy && 
    currentAnswers.appetite;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <User className="text-blue-600 flex-shrink-0" size={24} />
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Como está {currentProfile.name}?
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Pessoa {currentIndex + 1} de {profiles.length}
          </p>
        </div>
      </div>

      {/* Perfil resumido */}
      <div className="bg-blue-50 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
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

      <div className="space-y-4">
        {/* Estresse */}
        <div>
          <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
            Como está o nível de estresse esta semana?
          </label>
          <select
            value={currentAnswers.stress || ''}
            onChange={(e) => handleAnswerChange('stress', e.target.value)}
            className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="">Selecione...</option>
            <option value="baixo">Baixo / tranquilo</option>
            <option value="normal">Normal / controlável</option>
            <option value="alto">Alto / tenso</option>
            <option value="muito-alto">Muito alto / exaustivo</option>
          </select>
        </div>

        {/* Quando o estresse piora */}
        {currentAnswers.stress && ['alto', 'muito-alto'].includes(currentAnswers.stress) && (
          <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
              Quando o estresse piora mais?
            </label>
            <select
              value={currentAnswers.stressTime || ''}
              onChange={(e) => handleAnswerChange('stressTime', e.target.value)}
              className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="">Selecione...</option>
              <option value="manha">Manhã</option>
              <option value="tarde">Tarde</option>
              <option value="noite">Noite</option>
              <option value="dia-inteiro">O dia inteiro</option>
            </select>
          </div>
        )}

        {/* Sono */}
        <div>
          <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
            Como tem sido o sono?
          </label>
          <select
            value={currentAnswers.sleep || ''}
            onChange={(e) => handleAnswerChange('sleep', e.target.value)}
            className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="">Selecione...</option>
            <option value="ótimo">Ótimo (dormindo bem)</option>
            <option value="bom">Bom (dormindo razoável)</option>
            <option value="ruim">Ruim (acordando cansado)</option>
            <option value="péssimo">Péssimo (insônia/sono fragmentado)</option>
          </select>
        </div>

        {/* Detalhes do sono */}
        {currentAnswers.sleep && ['ruim', 'péssimo'].includes(currentAnswers.sleep) && (
          <>
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                Quantas horas de sono, em média?
              </label>
              <select
                value={currentAnswers.sleepHours || ''}
                onChange={(e) => handleAnswerChange('sleepHours', e.target.value)}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="">Selecione...</option>
                <option value="menos-4">Menos de 4h</option>
                <option value="4-6">4-6 horas</option>
                <option value="6-7">6-7 horas</option>
                <option value="7-mais">7 horas ou mais</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                O problema é mais:
              </label>
              <select
                value={currentAnswers.sleepProblem || ''}
                onChange={(e) => handleAnswerChange('sleepProblem', e.target.value)}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="">Selecione...</option>
                <option value="dificuldade-dormir">Dificuldade para dormir</option>
                <option value="acorda-muito">Acordar várias vezes</option>
                <option value="acorda-cansado">Acordar cansado</option>
                <option value="tudo">Um pouco de tudo</option>
              </select>
            </div>
          </>
        )}

        {/* Energia */}
        <div>
          <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
            Como está o nível de energia?
          </label>
          <select
            value={currentAnswers.energy || ''}
            onChange={(e) => handleAnswerChange('energy', e.target.value)}
            className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="">Selecione...</option>
            <option value="alta">Alta (disposto)</option>
            <option value="normal">Normal</option>
            <option value="baixa">Baixa (cansado)</option>
            <option value="muito-baixa">Muito baixa (exausto)</option>
          </select>
        </div>

        {/* Apetite */}
        <div>
          <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
            Como está o apetite?
          </label>
          <select
            value={currentAnswers.appetite || ''}
            onChange={(e) => handleAnswerChange('appetite', e.target.value)}
            className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="">Selecione...</option>
            <option value="normal">Normal</option>
            <option value="aumentado">Aumentado (muita fome)</option>
            <option value="diminuído">Diminuído (pouca fome)</option>
            <option value="sem-apetite">Sem apetite</option>
          </select>
        </div>

        {/* Quando a fome é menor */}
        {currentAnswers.appetite && ['diminuído', 'sem-apetite'].includes(currentAnswers.appetite) && (
          <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
              Quando a fome é menor?
            </label>
            <select
              value={currentAnswers.appetiteTime || ''}
              onChange={(e) => handleAnswerChange('appetiteTime', e.target.value)}
              className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="">Selecione...</option>
              <option value="manha">Manhã</option>
              <option value="almoco">Almoço</option>
              <option value="noite">Noite</option>
              <option value="sempre">O tempo todo</option>
            </select>
          </div>
        )}

        {/* Sintomas */}
        <div>
          <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
            Sintomas específicos esta semana? (opcional)
          </label>
          <input
            type="text"
            value={currentAnswers.symptoms || ''}
            onChange={(e) => handleAnswerChange('symptoms', e.target.value)}
            placeholder="Ex: dor de cabeça, enjoo, TPM, ansiedade piorou"
            className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Preferências */}
        <div>
          <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
            Preferências ou aversões alimentares? (opcional)
          </label>
          <input
            type="text"
            value={currentAnswers.preferences || ''}
            onChange={(e) => handleAnswerChange('preferences', e.target.value)}
            placeholder="Ex: enjoou de frango, querendo comer doce, evitando lactose"
            className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Feedback semana passada */}
        <div className="bg-purple-50 p-3 sm:p-4 rounded-lg space-y-4">
          <p className="font-semibold text-purple-900 text-sm sm:text-base">📊 Sobre a semana passada:</p>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
              Conseguiu seguir o plano alimentar?
            </label>
            <select
              value={currentAnswers.followedPlan || ''}
              onChange={(e) => handleAnswerChange('followedPlan', e.target.value)}
              className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="">Primeira vez / Não se aplica</option>
              <option value="sim">Sim</option>
              <option value="parcialmente">Parcialmente</option>
              <option value="nao">Não</option>
            </select>
          </div>

          {currentAnswers.followedPlan && ['parcialmente', 'nao'].includes(currentAnswers.followedPlan) && (
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                Principal motivo:
              </label>
              <select
                value={currentAnswers.notFollowedReason || ''}
                onChange={(e) => handleAnswerChange('notFollowedReason', e.target.value)}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="">Selecione...</option>
                <option value="falta-tempo">Falta de tempo</option>
                <option value="falta-fome">Falta de fome/apetite</option>
                <option value="enjoou">Enjoou da comida</option>
                <option value="esqueceu">Esqueceu de seguir</option>
                <option value="nao-ajudou">Não ajudou no emocional</option>
                <option value="dificil-preparar">Difícil de preparar</option>
                <option value="outro">Outro motivo</option>
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3 sm:gap-4 mt-6">
        <button
          onClick={onPrev}
          className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors text-sm sm:text-base"
        >
          ← Voltar
        </button>
        <button
          onClick={onNext}
          disabled={!canContinue}
          className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
        >
          {currentIndex < profiles.length - 1 ? 'Próxima pessoa →' : 'Finalizar questionários →'}
        </button>
      </div>

      {/* Indicador de progresso */}
      <div className="mt-4 flex gap-2 justify-center">
        {profiles.map((p, i) => (
          <div
            key={p.id}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${
              i === currentIndex
                ? 'bg-green-600'
                : individualAnswers[p.id]?.stress
                ? 'bg-green-300'
                : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
