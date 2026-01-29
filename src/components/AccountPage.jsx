import PropTypes from 'prop-types';
import { useState } from 'react';
import { ArrowLeft, User, Mail, Shield, Trash2, Users, Calendar, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

/**
 * Página de conta do usuário
 */
export const AccountPage = ({ profiles, menuHistory, onBack }) => {
  const { user, revokeConsentAndDeleteData } = useAuth();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Usuário';
  const userEmail = user?.email || '';
  const createdAt = user?.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }) : 'N/A';

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await revokeConsentAndDeleteData();
    } catch (error) {
      console.error('Erro ao excluir conta:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
      >
        <ArrowLeft size={20} />
        Voltar
      </button>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-3">
          <User className="text-green-600" />
          Minha Conta
        </h2>
        <p className="text-gray-600">
          Gerencie suas informações e preferências
        </p>
      </div>

      {/* Informações do usuário */}
      <div className="space-y-6">
        {/* Card do perfil */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
              <User size={32} className="text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">{userName}</h3>
              <p className="text-gray-600 flex items-center gap-2">
                <Mail size={14} />
                {userEmail}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Membro desde {createdAt}
              </p>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Users size={24} className="text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{profiles?.length || 0}</p>
            <p className="text-sm text-gray-600">Perfis cadastrados</p>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Calendar size={24} className="text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{menuHistory?.length || 0}</p>
            <p className="text-sm text-gray-600">Cardápios gerados</p>
          </div>
        </div>

        {/* Perfis da família */}
        {profiles && profiles.length > 0 && (
          <div className="border border-gray-200 rounded-xl p-4">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Users size={18} className="text-green-600" />
              Perfis da Família
            </h3>
            <div className="space-y-3">
              {profiles.map((profile, index) => (
                <div key={profile.id || index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-700 font-semibold">
                      {profile.name?.charAt(0)?.toUpperCase() || '?'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{profile.name || 'Sem nome'}</p>
                    <p className="text-sm text-gray-500">
                      {profile.age ? `${profile.age} anos` : ''} 
                      {profile.age && profile.sex ? ' • ' : ''}
                      {profile.sex === 'masculino' ? 'Masculino' : profile.sex === 'feminino' ? 'Feminino' : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Privacidade e segurança */}
        <div className="border border-gray-200 rounded-xl p-4">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Shield size={18} className="text-green-600" />
            Privacidade e Segurança
          </h3>
          
          <div className="space-y-3 text-sm text-gray-600">
            <p>• Seus dados são armazenados de forma segura</p>
            <p>• Não compartilhamos informações com terceiros</p>
            <p>• Você pode excluir sua conta a qualquer momento</p>
          </div>
        </div>

        {/* Zona de perigo */}
        <div className="border border-red-200 bg-red-50 rounded-xl p-4">
          <h3 className="font-semibold text-red-800 mb-4 flex items-center gap-2">
            <AlertTriangle size={18} />
            Zona de Perigo
          </h3>
          
          {!showDeleteConfirm ? (
            <div>
              <p className="text-sm text-red-700 mb-4">
                Ao excluir sua conta, todos os seus dados serão permanentemente removidos, incluindo perfis e histórico de cardápios.
              </p>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-red-300 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              >
                <Trash2 size={16} />
                Excluir minha conta
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-lg p-4 border border-red-300">
              <p className="text-sm text-red-800 font-medium mb-4">
                Tem certeza absoluta? Esta ação não pode ser desfeita.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {isDeleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Excluindo...
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} />
                      Sim, excluir tudo
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

AccountPage.propTypes = {
  profiles: PropTypes.array,
  menuHistory: PropTypes.array,
  onBack: PropTypes.func.isRequired,
};
