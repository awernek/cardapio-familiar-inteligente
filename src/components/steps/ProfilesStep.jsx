import PropTypes from 'prop-types';
import { User, Plus, AlertCircle, CheckCircle2, MapPin, ChevronRight } from 'lucide-react';
import { ProfileForm } from '../ProfileForm';
import { ProfileShape, FamilyLocationShape } from '../../types';

/**
 * Lista de estados brasileiros
 */
const ESTADOS_BR = [
  { sigla: 'AC', nome: 'Acre' },
  { sigla: 'AL', nome: 'Alagoas' },
  { sigla: 'AP', nome: 'Amapá' },
  { sigla: 'AM', nome: 'Amazonas' },
  { sigla: 'BA', nome: 'Bahia' },
  { sigla: 'CE', nome: 'Ceará' },
  { sigla: 'DF', nome: 'Distrito Federal' },
  { sigla: 'ES', nome: 'Espírito Santo' },
  { sigla: 'GO', nome: 'Goiás' },
  { sigla: 'MA', nome: 'Maranhão' },
  { sigla: 'MT', nome: 'Mato Grosso' },
  { sigla: 'MS', nome: 'Mato Grosso do Sul' },
  { sigla: 'MG', nome: 'Minas Gerais' },
  { sigla: 'PA', nome: 'Pará' },
  { sigla: 'PB', nome: 'Paraíba' },
  { sigla: 'PR', nome: 'Paraná' },
  { sigla: 'PE', nome: 'Pernambuco' },
  { sigla: 'PI', nome: 'Piauí' },
  { sigla: 'RJ', nome: 'Rio de Janeiro' },
  { sigla: 'RN', nome: 'Rio Grande do Norte' },
  { sigla: 'RS', nome: 'Rio Grande do Sul' },
  { sigla: 'RO', nome: 'Rondônia' },
  { sigla: 'RR', nome: 'Roraima' },
  { sigla: 'SC', nome: 'Santa Catarina' },
  { sigla: 'SP', nome: 'São Paulo' },
  { sigla: 'SE', nome: 'Sergipe' },
  { sigla: 'TO', nome: 'Tocantins' }
];

/**
 * Componente da etapa de perfis - versão conversacional
 */
export const ProfilesStep = ({ 
  profiles, 
  familyLocation,
  onUpdateLocation,
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
  const hasLocation = familyLocation?.state && familyLocation?.city;
  const canContinue = profiles.length > 0 && incompleteProfiles.length === 0 && hasLocation;
  const allProfilesComplete = profiles.length > 0 && incompleteProfiles.length === 0;

  return (
    <div className="space-y-4" role="main">
      {/* Card de Boas-vindas e Localização */}
      <section className="bg-white rounded-2xl shadow-lg p-4 sm:p-6" aria-labelledby="welcome-heading">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0" aria-hidden="true">
            <span className="text-xl">👋</span>
          </div>
          <div>
            <h2 id="welcome-heading" className="text-xl sm:text-2xl font-bold text-gray-800">
              Olá! Vamos criar seu cardápio?
            </h2>
            <p className="text-gray-600 mt-1">
              Primeiro, me conta de onde vocês são. Isso ajuda a sugerir ingredientes da região e estimar os custos de forma mais precisa.
            </p>
          </div>
        </div>

        {/* Localização */}
        <div className="bg-gray-50 rounded-xl p-4" role="region" aria-labelledby="location-heading">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="text-green-600" size={18} aria-hidden="true" />
            <h3 id="location-heading" className="font-medium text-gray-700">Onde vocês moram?</h3>
            {hasLocation && (
              <CheckCircle2 
                className="text-green-500 ml-auto" 
                size={18} 
                aria-label="Localização preenchida"
                aria-hidden="false"
              />
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="location-state" className="block text-sm text-gray-600 mb-1">
                Estado
              </label>
              <select
                id="location-state"
                value={familyLocation?.state || ''}
                onChange={(e) => onUpdateLocation({ ...familyLocation, state: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-sm sm:text-base"
                aria-required="true"
                aria-label="Selecione o estado"
              >
                <option value="">Selecione o estado...</option>
                {ESTADOS_BR.map(estado => (
                  <option key={estado.sigla} value={estado.sigla}>
                    {estado.nome}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="location-city" className="block text-sm text-gray-600 mb-1">
                Cidade
              </label>
              <input
                id="location-city"
                type="text"
                value={familyLocation?.city || ''}
                onChange={(e) => onUpdateLocation({ ...familyLocation, city: e.target.value })}
                placeholder="Ex: São Paulo"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                aria-required="true"
                aria-label="Digite o nome da cidade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Card de Perfis */}
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="text-blue-600" size={20} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                Quem vai comer junto?
              </h2>
              <p className="text-sm text-gray-500">
                Adicione cada pessoa da família
              </p>
            </div>
          </div>
          {profiles.length > 0 && (
            <div className={`text-sm font-medium ${allProfilesComplete ? 'text-green-600' : 'text-gray-500'}`}>
              {allProfilesComplete ? (
                <span className="flex items-center gap-1">
                  <CheckCircle2 size={16} />
                  Pronto!
                </span>
              ) : (
                `${profiles.length - incompleteProfiles.length}/${profiles.length}`
              )}
            </div>
          )}
        </div>

        {/* Lista de perfis */}
        {profiles.length === 0 && (
          <div className="text-center py-8 bg-gray-50 rounded-xl mb-4 mt-4">
            <div className="text-4xl mb-2">👨‍👩‍👧‍👦</div>
            <p className="text-gray-600 font-medium">Nenhuma pessoa adicionada ainda</p>
            <p className="text-sm text-gray-400 mt-1">Clique abaixo para adicionar alguém</p>
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
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-green-500 hover:text-green-600 transition-colors flex items-center justify-center gap-2 mb-4 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          aria-label={profiles.length === 0 ? "Adicionar primeira pessoa à família" : "Adicionar mais uma pessoa à família"}
        >
          <Plus size={20} aria-hidden="true" />
          {profiles.length === 0 ? 'Adicionar primeira pessoa' : 'Adicionar mais alguém'}
        </button>

        {/* Mensagens de validação */}
        {!hasLocation && profiles.length > 0 && (
          <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4 text-sm" role="alert" aria-live="polite">
            <MapPin className="text-blue-600 flex-shrink-0 mt-0.5" size={18} aria-hidden="true" />
            <p className="text-blue-800">
              Não esqueça de informar sua cidade e estado acima
            </p>
          </div>
        )}

        {profiles.length > 0 && !allProfilesComplete && (
          <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg mb-4 text-sm" role="alert" aria-live="polite">
            <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={18} aria-hidden="true" />
            <div>
              <p className="text-amber-800 font-medium">Faltam algumas informações</p>
              <p className="text-amber-700">
                {incompleteProfiles.length === 1 
                  ? `Complete o perfil de: ${incompleteProfiles[0].name || 'Pessoa sem nome'}`
                  : `Complete ${incompleteProfiles.length} perfis`
                }
              </p>
            </div>
          </div>
        )}

        <button
          onClick={onContinue}
          disabled={!canContinue}
          className={`w-full py-3.5 rounded-xl font-semibold transition-colors text-sm sm:text-base flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
            ${canContinue 
              ? 'bg-green-600 text-white hover:bg-green-700' 
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          aria-label={canContinue ? "Continuar para questionários individuais" : "Complete os perfis e a localização para continuar"}
          aria-disabled={!canContinue}
        >
          {canContinue ? (
            <>
              Próximo passo
              <ChevronRight size={20} aria-hidden="true" />
            </>
          ) : (
            'Complete as informações acima'
          )}
        </button>
      </div>
    </div>
  );
};

ProfilesStep.propTypes = {
  profiles: PropTypes.arrayOf(ProfileShape).isRequired,
  familyLocation: FamilyLocationShape.isRequired,
  onUpdateLocation: PropTypes.func.isRequired,
  onAddProfile: PropTypes.func.isRequired,
  onUpdateProfile: PropTypes.func.isRequired,
  onRemoveProfile: PropTypes.func.isRequired,
  onToggleAdvanced: PropTypes.func.isRequired,
  onContinue: PropTypes.func.isRequired,
};
