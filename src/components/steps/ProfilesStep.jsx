import { User, Plus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ProfileForm } from '../ProfileForm';

/**
 * Componente da etapa de perfis
 */
export const ProfilesStep = ({ 
  profiles, 
  onAddProfile, 
  onUpdateProfile, 
  onRemoveProfile, 
  onToggleAdvanced,
  onContinue 
}) => {
  const requiredFields = ['name', 'age', 'sex', 'weight', 'height', 'bodyType', 'goals'];
  
  const getIncompleteProfiles = () => {
    return profiles.filter(p => !requiredFields.every(f => p[f] && p[f] !== ''));
  };
  
  const incompleteProfiles = getIncompleteProfiles();
  const canContinue = profiles.length > 0 && incompleteProfiles.length === 0;
  const allComplete = profiles.length > 0 && canContinue;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <User className="text-blue-600 flex-shrink-0" size={24} />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Perfis da Família</h2>
        </div>
        {profiles.length > 0 && (
          <div className={`text-sm font-medium ${allComplete ? 'text-green-600' : 'text-gray-500'}`}>
            {allComplete ? (
              <span className="flex items-center gap-1">
                <CheckCircle2 size={16} />
                Pronto!
              </span>
            ) : (
              `${profiles.length - incompleteProfiles.length}/${profiles.length} completos`
            )}
          </div>
        )}
      </div>
      
      {/* Instrução */}
      <p className="text-sm text-gray-500 mb-4 sm:mb-6">
        Adicione as pessoas da família. Campos com <span className="text-red-500">*</span> são obrigatórios.
      </p>

      {/* Lista de perfis */}
      {profiles.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-xl mb-4">
          <User className="mx-auto text-gray-300 mb-2" size={48} />
          <p className="text-gray-500">Nenhuma pessoa adicionada ainda</p>
          <p className="text-sm text-gray-400">Clique no botão abaixo para começar</p>
        </div>
      )}

      {profiles.map((profile, index) => (
        <ProfileForm
          key={profile.id}
          profile={profile}
          index={index}
          onUpdate={onUpdateProfile}
          onRemove={onRemoveProfile}
          onToggleAdvanced={onToggleAdvanced}
        />
      ))}

      <button
        onClick={onAddProfile}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-green-500 hover:text-green-600 transition-colors flex items-center justify-center gap-2 mb-4 text-sm sm:text-base"
      >
        <Plus size={20} />
        Adicionar Pessoa
      </button>

      {/* Mensagem de validação */}
      {profiles.length > 0 && !canContinue && (
        <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg mb-4 text-sm">
          <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-amber-800 font-medium">Preencha os campos obrigatórios</p>
            <p className="text-amber-700">
              {incompleteProfiles.length === 1 
                ? `Faltam dados em: ${incompleteProfiles[0].name || 'Pessoa sem nome'}`
                : `Faltam dados em ${incompleteProfiles.length} perfis`
              }
            </p>
          </div>
        </div>
      )}

      <button
        onClick={onContinue}
        disabled={!canContinue}
        className={`w-full py-3.5 rounded-xl font-semibold transition-colors text-sm sm:text-base flex items-center justify-center gap-2
          ${canContinue 
            ? 'bg-green-600 text-white hover:bg-green-700' 
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
      >
        {canContinue && <CheckCircle2 size={20} />}
        Continuar para Questionários Individuais
      </button>
    </div>
  );
};
