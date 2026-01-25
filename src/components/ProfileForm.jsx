import { User, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { calculateBMI, getBMICategory } from '../utils/bmi';

/**
 * Componente para formulário de perfil individual
 */
export const ProfileForm = ({ profile, index, onUpdate, onRemove, onToggleAdvanced }) => {
  const bmi = calculateBMI(profile.weight, profile.height);
  const bmiCategory = getBMICategory(bmi);

  return (
    <div className="bg-gray-50 rounded-xl p-3 sm:p-4 mb-4">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold text-gray-700 text-sm sm:text-base">Pessoa {index + 1}</h3>
        <button 
          onClick={() => onRemove(profile.id)} 
          className="text-red-500 hover:text-red-700 p-1"
          aria-label="Remover pessoa"
        >
          <Trash2 size={18} />
        </button>
      </div>
      
      {/* Campos básicos */}
      <div className="space-y-3 sm:space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <input
            type="text"
            placeholder="Nome *"
            value={profile.name}
            onChange={(e) => onUpdate(profile.id, 'name', e.target.value)}
            className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <input
            type="number"
            placeholder="Idade *"
            value={profile.age}
            onChange={(e) => onUpdate(profile.id, 'age', e.target.value)}
            className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <select
            value={profile.sex || ''}
            onChange={(e) => onUpdate(profile.id, 'sex', e.target.value)}
            className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Sexo *</option>
            <option value="masculino">Masculino</option>
            <option value="feminino">Feminino</option>
            <option value="outro">Outro</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div>
            <input
              type="number"
              placeholder="Peso (kg) *"
              value={profile.weight}
              onChange={(e) => onUpdate(profile.id, 'weight', e.target.value)}
              className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <input
              type="number"
              placeholder="Altura (cm) *"
              value={profile.height}
              onChange={(e) => onUpdate(profile.id, 'height', e.target.value)}
              className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            {profile.weight && profile.height && (
              <div className="px-3 sm:px-4 py-2 bg-blue-50 rounded-lg text-center">
                <p className="text-xs text-gray-600">IMC</p>
                <p className="font-bold text-blue-900 text-sm sm:text-base">{bmi}</p>
                <p className="text-xs text-gray-600">{bmiCategory}</p>
              </div>
            )}
          </div>
        </div>

        <select
          value={profile.bodyType || ''}
          onChange={(e) => onUpdate(profile.id, 'bodyType', e.target.value)}
          className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="">Como é seu corpo naturalmente? *</option>
          <option value="naturalmente-magro">Naturalmente magro (dificuldade para ganhar peso)</option>
          <option value="peso-normal">Peso equilibrado (mantém peso facilmente)</option>
          <option value="tendencia-ganhar">Tendência a ganhar peso (facilidade para engordar)</option>
        </select>

        <input
          type="text"
          placeholder="Alergias ou restrições alimentares (ex: lactose, glúten, frutos do mar)"
          value={profile.restrictions}
          onChange={(e) => onUpdate(profile.id, 'restrictions', e.target.value)}
          className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />

        <input
          type="text"
          placeholder="Objetivos principais *"
          value={profile.goals}
          onChange={(e) => onUpdate(profile.id, 'goals', e.target.value)}
          className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />

        {/* Toggle avançado */}
        <button
          type="button"
          onClick={() => onToggleAdvanced(profile.id)}
          className="w-full py-2 text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          {profile.showAdvanced ? (
            <>
              <ChevronUp size={18} />
              Ocultar detalhes avançados
            </>
          ) : (
            <>
              <ChevronDown size={18} />
              ➕ Adicionar detalhes avançados (opcional)
            </>
          )}
        </button>

        {/* Campos avançados */}
        {profile.showAdvanced && (
          <div className="space-y-3 sm:space-y-4 pt-3 sm:pt-4 border-t border-gray-200">
            <p className="text-xs sm:text-sm font-semibold text-gray-600">📋 Detalhes Avançados</p>
            
            <input
              type="text"
              placeholder="Condições de saúde (ex: ansiedade, diabetes, hipertensão)"
              value={profile.healthConditions}
              onChange={(e) => onUpdate(profile.id, 'healthConditions', e.target.value)}
              className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />

            <input
              type="text"
              placeholder="Medicamentos de uso contínuo"
              value={profile.medications}
              onChange={(e) => onUpdate(profile.id, 'medications', e.target.value)}
              className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />

            <select
              value={profile.activityLevel || ''}
              onChange={(e) => onUpdate(profile.id, 'activityLevel', e.target.value)}
              className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Nível de atividade física</option>
              <option value="sedentario">Sedentário (sem exercícios)</option>
              <option value="leve">Levemente ativo (1-3x semana)</option>
              <option value="moderado">Moderadamente ativo (3-5x semana)</option>
              <option value="muito-ativo">Muito ativo (exercício intenso diário)</option>
            </select>

            <input
              type="text"
              placeholder="Rotina diária (ex: home office, trabalho fora, estudo integral)"
              value={profile.routine}
              onChange={(e) => onUpdate(profile.id, 'routine', e.target.value)}
              className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />

            <input
              type="text"
              placeholder="Horários das refeições (ex: café 7h, almoço 12h, jantar 20h)"
              value={profile.mealTimes}
              onChange={(e) => onUpdate(profile.id, 'mealTimes', e.target.value)}
              className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />

            <select
              value={profile.cookingSkill || ''}
              onChange={(e) => onUpdate(profile.id, 'cookingSkill', e.target.value)}
              className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Habilidade na cozinha</option>
              <option value="iniciante">Iniciante (só o básico)</option>
              <option value="intermediario">Intermediário (receitas simples)</option>
              <option value="avancado">Avançado (domina técnicas)</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
};
