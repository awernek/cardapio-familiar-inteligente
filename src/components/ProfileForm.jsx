import { User, Trash2, ChevronDown, ChevronUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { calculateBMI, getBMICategory } from '../utils/bmi';

/**
 * Componente de label com indicador de obrigatório/opcional
 */
const Label = ({ children, required = false, optional = false }) => (
  <label className="block text-sm font-medium text-gray-700 mb-1">
    {children}
    {required && <span className="text-red-500 ml-1">*</span>}
    {optional && <span className="text-gray-400 ml-1 font-normal">(opcional)</span>}
  </label>
);

/**
 * Componente de input com validação visual
 */
const InputField = ({ 
  label, 
  required = false, 
  optional = false, 
  value, 
  isValid,
  showValidation = false,
  ...props 
}) => {
  const hasValue = value !== '' && value !== undefined && value !== null;
  const showSuccess = showValidation && hasValue && isValid !== false;
  const showError = showValidation && required && !hasValue;
  
  return (
    <div>
      {label && <Label required={required} optional={optional}>{label}</Label>}
      <div className="relative">
        <input
          value={value}
          {...props}
          className={`w-full px-3 sm:px-4 py-2.5 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors
            ${showError ? 'border-red-300 bg-red-50' : ''}
            ${showSuccess ? 'border-green-300 bg-green-50' : ''}
            ${!showError && !showSuccess ? 'border-gray-300' : ''}
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
 * Componente para formulário de perfil individual
 */
export const ProfileForm = ({ profile, index, onUpdate, onRemove, onToggleAdvanced }) => {
  const bmi = calculateBMI(profile.weight, profile.height);
  const bmiCategory = getBMICategory(bmi);
  
  // Verificar campos obrigatórios preenchidos
  const requiredFields = ['name', 'age', 'sex', 'weight', 'height', 'bodyType', 'goals'];
  const filledRequired = requiredFields.filter(f => profile[f] && profile[f] !== '').length;
  const totalRequired = requiredFields.length;
  const isComplete = filledRequired === totalRequired;
  const showValidation = filledRequired > 0; // Só mostra validação depois que começou a preencher

  return (
    <div className={`rounded-xl p-4 sm:p-5 mb-4 border-2 transition-colors ${
      isComplete ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
    }`}>
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isComplete ? 'bg-green-500' : 'bg-gray-300'
          }`}>
            {isComplete ? (
              <CheckCircle2 className="text-white" size={20} />
            ) : (
              <User className="text-white" size={20} />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">
              {profile.name || `Pessoa ${index + 1}`}
            </h3>
            <p className="text-xs text-gray-500">
              {isComplete ? (
                <span className="text-green-600">Perfil completo</span>
              ) : (
                <span>{filledRequired}/{totalRequired} campos obrigatórios</span>
              )}
            </p>
          </div>
        </div>
        <button 
          onClick={() => onRemove(profile.id)} 
          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
          aria-label="Remover pessoa"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Seção: Dados Básicos (Obrigatórios) */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-px flex-1 bg-gray-300"></div>
          <span className="text-xs font-semibold text-gray-500 uppercase">Dados Básicos</span>
          <div className="h-px flex-1 bg-gray-300"></div>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <InputField
              label="Nome"
              required
              type="text"
              placeholder="Ex: Maria"
              value={profile.name}
              onChange={(e) => onUpdate(profile.id, 'name', e.target.value)}
              showValidation={showValidation}
            />
            <InputField
              label="Idade"
              required
              type="number"
              placeholder="Ex: 35"
              value={profile.age}
              onChange={(e) => onUpdate(profile.id, 'age', e.target.value)}
              showValidation={showValidation}
            />
            <SelectField
              label="Sexo"
              required
              value={profile.sex || ''}
              onChange={(e) => onUpdate(profile.id, 'sex', e.target.value)}
              showValidation={showValidation}
            >
              <option value="">Selecione...</option>
              <option value="masculino">Masculino</option>
              <option value="feminino">Feminino</option>
              <option value="outro">Outro</option>
            </SelectField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <InputField
              label="Peso"
              required
              type="number"
              placeholder="Ex: 70"
              value={profile.weight}
              onChange={(e) => onUpdate(profile.id, 'weight', e.target.value)}
              showValidation={showValidation}
            />
            <InputField
              label="Altura (cm)"
              required
              type="number"
              placeholder="Ex: 165"
              value={profile.height}
              onChange={(e) => onUpdate(profile.id, 'height', e.target.value)}
              showValidation={showValidation}
            />
            <div>
              <Label>IMC</Label>
              {profile.weight && profile.height ? (
                <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-center">
                  <p className="font-bold text-blue-900">{bmi}</p>
                  <p className="text-xs text-gray-600">{bmiCategory}</p>
                </div>
              ) : (
                <div className="px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-center text-gray-400 text-sm">
                  Preencha peso e altura
                </div>
              )}
            </div>
          </div>

          <SelectField
            label="Biotipo"
            required
            value={profile.bodyType || ''}
            onChange={(e) => onUpdate(profile.id, 'bodyType', e.target.value)}
            showValidation={showValidation}
          >
            <option value="">Como é seu corpo naturalmente?</option>
            <option value="naturalmente-magro">Naturalmente magro (dificuldade para ganhar peso)</option>
            <option value="peso-normal">Peso equilibrado (mantém peso facilmente)</option>
            <option value="tendencia-ganhar">Tendência a ganhar peso (facilidade para engordar)</option>
          </SelectField>

          <InputField
            label="Objetivos"
            required
            type="text"
            placeholder="Ex: Perder peso, ter mais energia, comer melhor"
            value={profile.goals}
            onChange={(e) => onUpdate(profile.id, 'goals', e.target.value)}
            showValidation={showValidation}
          />
        </div>
      </div>

      {/* Seção: Informações Adicionais (Opcionais) */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="h-px flex-1 bg-gray-300"></div>
          <span className="text-xs font-semibold text-gray-500 uppercase">Informações Adicionais</span>
          <div className="h-px flex-1 bg-gray-300"></div>
        </div>

        <InputField
          label="Restrições alimentares"
          optional
          type="text"
          placeholder="Ex: Intolerância à lactose, alergia a frutos do mar"
          value={profile.restrictions}
          onChange={(e) => onUpdate(profile.id, 'restrictions', e.target.value)}
        />

        {/* Toggle avançado */}
        <button
          type="button"
          onClick={() => onToggleAdvanced(profile.id)}
          className="w-full mt-4 py-2.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium flex items-center justify-center gap-2 text-sm rounded-lg transition-colors"
        >
          {profile.showAdvanced ? (
            <>
              <ChevronUp size={18} />
              Ocultar detalhes de saúde
            </>
          ) : (
            <>
              <ChevronDown size={18} />
              Adicionar detalhes de saúde (opcional)
            </>
          )}
        </button>

        {/* Campos avançados */}
        {profile.showAdvanced && (
          <div className="space-y-4 pt-4 mt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Essas informações ajudam a IA a criar um cardápio mais personalizado, mas não são obrigatórias.
            </p>
            
            <InputField
              label="Condições de saúde"
              optional
              type="text"
              placeholder="Ex: Ansiedade, diabetes, hipertensão"
              value={profile.healthConditions}
              onChange={(e) => onUpdate(profile.id, 'healthConditions', e.target.value)}
            />

            <InputField
              label="Medicamentos de uso contínuo"
              optional
              type="text"
              placeholder="Ex: Antidepressivos, anti-hipertensivos"
              value={profile.medications}
              onChange={(e) => onUpdate(profile.id, 'medications', e.target.value)}
            />

            <SelectField
              label="Nível de atividade física"
              optional
              value={profile.activityLevel || ''}
              onChange={(e) => onUpdate(profile.id, 'activityLevel', e.target.value)}
            >
              <option value="">Selecione...</option>
              <option value="sedentario">Sedentário (sem exercícios)</option>
              <option value="leve">Levemente ativo (1-3x semana)</option>
              <option value="moderado">Moderadamente ativo (3-5x semana)</option>
              <option value="muito-ativo">Muito ativo (exercício intenso diário)</option>
            </SelectField>

            <InputField
              label="Rotina diária"
              optional
              type="text"
              placeholder="Ex: Trabalho home office, estudo à noite"
              value={profile.routine}
              onChange={(e) => onUpdate(profile.id, 'routine', e.target.value)}
            />

            <InputField
              label="Horários das refeições"
              optional
              type="text"
              placeholder="Ex: Café 7h, almoço 12h, jantar 20h"
              value={profile.mealTimes}
              onChange={(e) => onUpdate(profile.id, 'mealTimes', e.target.value)}
            />

            <SelectField
              label="Habilidade na cozinha"
              optional
              value={profile.cookingSkill || ''}
              onChange={(e) => onUpdate(profile.id, 'cookingSkill', e.target.value)}
            >
              <option value="">Selecione...</option>
              <option value="iniciante">Iniciante (só o básico)</option>
              <option value="intermediario">Intermediário (receitas simples)</option>
              <option value="avancado">Avançado (domina técnicas)</option>
            </SelectField>
          </div>
        )}
      </div>
    </div>
  );
};
