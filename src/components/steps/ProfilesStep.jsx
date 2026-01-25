import { User, Plus } from 'lucide-react';
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
  const canContinue = profiles.length > 0 && 
    profiles.every(p => p.name && p.age && p.sex && p.weight && p.height && p.bodyType && p.goals);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <User className="text-blue-600 flex-shrink-0" size={24} />
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Perfis da Família</h2>
      </div>

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
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-green-500 hover:text-green-600 transition-colors flex items-center justify-center gap-2 mb-4 sm:mb-6 text-sm sm:text-base"
      >
        <Plus size={20} />
        Adicionar Pessoa
      </button>

      <button
        onClick={onContinue}
        disabled={!canContinue}
        className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
      >
        Continuar para Questionários Individuais
      </button>
    </div>
  );
};
