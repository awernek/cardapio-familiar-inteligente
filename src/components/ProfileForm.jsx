import { Trash2, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { calculateBMI, getBMICategory } from '../utils/bmi';

/**
 * Componente de input simples
 */
const SimpleInput = ({ 
  label, 
  placeholder,
  value, 
  onChange,
  type = 'text',
  ...props 
}) => {
  const hasValue = value !== '' && value !== undefined && value !== null;
  
  return (
    <div>
      <label className="block text-sm text-gray-600 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors
          ${hasValue ? 'border-green-300 bg-green-50/50' : 'border-gray-300'}
        `}
        {...props}
      />
    </div>
  );
};

/**
 * Componente de select simples
 */
const SimpleSelect = ({ 
  label, 
  value, 
  onChange,
  children,
  ...props 
}) => {
  const hasValue = value !== '' && value !== undefined && value !== null;
  
  return (
    <div>
      <label className="block text-sm text-gray-600 mb-1">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors appearance-none bg-white
          ${hasValue ? 'border-green-300 bg-green-50/50' : 'border-gray-300'}
        `}
        {...props}
      >
        {children}
      </select>
    </div>
  );
};

/**
 * Componente para formulário de perfil individual - versão conversacional
 */
export const ProfileForm = ({ profile, index, onUpdate, onRemove, onToggleAdvanced }) => {
  const bmi = calculateBMI(profile.weight, profile.height);
  const bmiCategory = getBMICategory(bmi);
  
  // Verificar campos obrigatórios preenchidos
  const requiredFields = ['name', 'age', 'sex', 'weight', 'height', 'bodyType', 'goals'];
  const filledRequired = requiredFields.filter(f => profile[f] && profile[f] !== '').length;
  const totalRequired = requiredFields.length;
  const isComplete = filledRequired === totalRequired;

  return (
    <div className={`rounded-xl p-4 sm:p-5 mb-4 border-2 transition-colors ${
      isComplete ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
    }`}>
      {/* Cabeçalho compacto */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
            isComplete ? 'bg-green-100' : 'bg-gray-200'
          }`}>
            {isComplete ? '✅' : '👤'}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">
              {profile.name || `Pessoa ${index + 1}`}
            </h3>
            {!isComplete && (
              <p className="text-xs text-gray-500">
                {filledRequired}/{totalRequired} preenchidos
              </p>
            )}
          </div>
        </div>
        <button 
          onClick={() => onRemove(profile.id)} 
          className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
          aria-label="Remover pessoa"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Dados básicos - layout conversacional */}
      <div className="space-y-4">
        {/* Nome e idade na mesma linha */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <SimpleInput
            label="Como podemos chamar?"
            placeholder="Nome"
            value={profile.name}
            onChange={(e) => onUpdate(profile.id, 'name', e.target.value)}
          />
          <SimpleInput
            label="Quantos anos?"
            placeholder="Idade"
            type="number"
            value={profile.age}
            onChange={(e) => onUpdate(profile.id, 'age', e.target.value)}
          />
          <SimpleSelect
            label="Sexo"
            value={profile.sex || ''}
            onChange={(e) => onUpdate(profile.id, 'sex', e.target.value)}
          >
            <option value="">Selecione</option>
            <option value="masculino">Masculino</option>
            <option value="feminino">Feminino</option>
            <option value="outro">Outro</option>
          </SimpleSelect>
        </div>

        {/* Peso, altura e IMC */}
        <div className="grid grid-cols-3 gap-3">
          <SimpleInput
            label="Peso (kg)"
            placeholder="Ex: 70"
            type="number"
            value={profile.weight}
            onChange={(e) => onUpdate(profile.id, 'weight', e.target.value)}
          />
          <SimpleInput
            label="Altura (cm)"
            placeholder="Ex: 165"
            type="number"
            value={profile.height}
            onChange={(e) => onUpdate(profile.id, 'height', e.target.value)}
          />
          <div>
            <label className="block text-sm text-gray-600 mb-1">IMC</label>
            {profile.weight && profile.height ? (
              <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-center">
                <p className="font-bold text-blue-900 text-sm">{bmi}</p>
                <p className="text-xs text-gray-600">{bmiCategory}</p>
              </div>
            ) : (
              <div className="px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-center text-gray-400 text-xs">
                Calculado auto
              </div>
            )}
          </div>
        </div>

        {/* Biotipo - com explicação */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Qual o biotipo natural?
          </label>
          <p className="text-xs text-gray-400 mb-2">Ajuda a calcular as porções ideais</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { value: 'naturalmente-magro', label: 'Magro', desc: 'Difícil ganhar peso' },
              { value: 'peso-normal', label: 'Equilibrado', desc: 'Mantém peso fácil' },
              { value: 'tendencia-ganhar', label: 'Ganha fácil', desc: 'Engorda rápido' }
            ].map(option => (
              <button
                key={option.value}
                onClick={() => onUpdate(profile.id, 'bodyType', option.value)}
                className={`p-3 rounded-lg text-left transition-all ${
                  profile.bodyType === option.value
                    ? 'bg-green-600 text-white'
                    : 'bg-white border border-gray-200 hover:border-green-300'
                }`}
              >
                <span className="font-medium text-sm">{option.label}</span>
                <p className={`text-xs mt-0.5 ${
                  profile.bodyType === option.value ? 'text-green-100' : 'text-gray-400'
                }`}>
                  {option.desc}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Objetivos */}
        <SimpleInput
          label="Quais são os objetivos?"
          placeholder="Ex: Perder peso, ter mais energia, comer melhor..."
          value={profile.goals}
          onChange={(e) => onUpdate(profile.id, 'goals', e.target.value)}
        />

        {/* Restrições - sempre visível mas opcional */}
        <SimpleInput
          label="Alguma restrição alimentar? (opcional)"
          placeholder="Ex: Intolerância à lactose, vegetariano, alergia..."
          value={profile.restrictions}
          onChange={(e) => onUpdate(profile.id, 'restrictions', e.target.value)}
        />

        {/* Toggle de detalhes extras */}
        <button
          type="button"
          onClick={() => onToggleAdvanced(profile.id)}
          className="w-full py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium flex items-center justify-center gap-2 text-sm rounded-lg transition-colors"
        >
          {profile.showAdvanced ? (
            <>
              <ChevronUp size={16} />
              Ocultar detalhes extras
            </>
          ) : (
            <>
              <ChevronDown size={16} />
              Adicionar mais detalhes (opcional)
            </>
          )}
        </button>

        {/* Campos avançados */}
        {profile.showAdvanced && (
          <div className="space-y-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Quanto mais você contar, melhor a IA personaliza o cardápio.
            </p>
            
            <SimpleInput
              label="Condições de saúde"
              placeholder="Ex: Ansiedade, diabetes, hipertensão..."
              value={profile.healthConditions}
              onChange={(e) => onUpdate(profile.id, 'healthConditions', e.target.value)}
            />

            <SimpleInput
              label="Medicamentos de uso contínuo"
              placeholder="Ex: Antidepressivos, anti-hipertensivos..."
              value={profile.medications}
              onChange={(e) => onUpdate(profile.id, 'medications', e.target.value)}
            />

            <SimpleSelect
              label="Nível de atividade física"
              value={profile.activityLevel || ''}
              onChange={(e) => onUpdate(profile.id, 'activityLevel', e.target.value)}
            >
              <option value="">Selecione...</option>
              <option value="sedentario">Sedentário</option>
              <option value="leve">Leve (1-3x semana)</option>
              <option value="moderado">Moderado (3-5x semana)</option>
              <option value="muito-ativo">Muito ativo (diário)</option>
            </SimpleSelect>

            <SimpleInput
              label="Rotina diária"
              placeholder="Ex: Home office, estuda à noite..."
              value={profile.routine}
              onChange={(e) => onUpdate(profile.id, 'routine', e.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  );
};
