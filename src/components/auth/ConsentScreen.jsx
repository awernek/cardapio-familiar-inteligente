import { useState } from 'react';
import { Shield, Check, AlertTriangle, FileText, Lock, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const ConsentScreen = () => {
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedDataProcessing, setAcceptedDataProcessing] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const { acceptTerms, signOut, user } = useAuth();

  const canContinue = acceptedPrivacy && acceptedTerms && acceptedDataProcessing;

  const handleAccept = () => {
    if (canContinue) {
      acceptTerms();
    }
  };

  const handleDecline = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          {/* Cabeçalho */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <Shield className="text-green-600" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Sua privacidade é importante
            </h1>
            <p className="text-gray-600">
              Olá{user?.user_metadata?.name ? `, ${user.user_metadata.name}` : ''}! Antes de continuar, precisamos do seu consentimento.
            </p>
          </div>

          {/* Aviso sobre dados sensíveis */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h3 className="font-semibold text-amber-800 mb-1">Dados de Saúde</h3>
                <p className="text-sm text-amber-700">
                  Este aplicativo coleta dados considerados sensíveis pela LGPD, incluindo: 
                  peso, altura, condições de saúde, medicamentos, níveis de estresse e qualidade do sono. 
                  Esses dados são usados exclusivamente para gerar cardápios personalizados.
                </p>
              </div>
            </div>
          </div>

          {/* O que fazemos com os dados */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Lock size={18} className="text-green-600" />
              O que fazemos com seus dados
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <Check size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                <span>Geramos cardápios personalizados usando inteligência artificial</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                <span>Armazenamos seus dados de forma segura e criptografada</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                <span>Nunca vendemos ou compartilhamos seus dados com terceiros</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                <span>Você pode solicitar a exclusão dos seus dados a qualquer momento</span>
              </li>
            </ul>
          </div>

          {/* Checkboxes de consentimento */}
          <div className="space-y-4 mb-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <div 
                onClick={() => setAcceptedPrivacy(!acceptedPrivacy)}
                className={`w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  acceptedPrivacy 
                    ? 'bg-green-600 border-green-600' 
                    : 'bg-white border-gray-300 hover:border-green-400'
                }`}
              >
                {acceptedPrivacy && <Check size={14} className="text-white" />}
              </div>
              <span className="text-sm text-gray-700">
                Li e concordo com a{' '}
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowPrivacy(true); }}
                  className="text-green-600 font-semibold hover:underline"
                >
                  Política de Privacidade
                </button>
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <div 
                onClick={() => setAcceptedTerms(!acceptedTerms)}
                className={`w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  acceptedTerms 
                    ? 'bg-green-600 border-green-600' 
                    : 'bg-white border-gray-300 hover:border-green-400'
                }`}
              >
                {acceptedTerms && <Check size={14} className="text-white" />}
              </div>
              <span className="text-sm text-gray-700">
                Li e concordo com os{' '}
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowTerms(true); }}
                  className="text-green-600 font-semibold hover:underline"
                >
                  Termos de Uso
                </button>
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <div 
                onClick={() => setAcceptedDataProcessing(!acceptedDataProcessing)}
                className={`w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  acceptedDataProcessing 
                    ? 'bg-green-600 border-green-600' 
                    : 'bg-white border-gray-300 hover:border-green-400'
                }`}
              >
                {acceptedDataProcessing && <Check size={14} className="text-white" />}
              </div>
              <span className="text-sm text-gray-700">
                <strong>Consinto expressamente</strong> com o tratamento dos meus dados pessoais 
                e dados sensíveis de saúde para a finalidade de geração de cardápios personalizados, 
                conforme a Lei Geral de Proteção de Dados (LGPD).
              </span>
            </label>
          </div>

          {/* Botões */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleDecline}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
            >
              Não concordo
            </button>
            <button
              onClick={handleAccept}
              disabled={!canContinue}
              className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              <Check size={20} />
              Concordo e quero continuar
            </button>
          </div>

          {/* Direitos do usuário */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Você pode revogar seu consentimento e solicitar a exclusão dos seus dados 
              a qualquer momento nas configurações do aplicativo. Para dúvidas, entre em 
              contato pelo email: privacidade@cardapiofamiliar.com.br
            </p>
          </div>
        </div>

        {/* Modal Política de Privacidade */}
        {showPrivacy && (
          <PrivacyModal onClose={() => setShowPrivacy(false)} />
        )}

        {/* Modal Termos de Uso */}
        {showTerms && (
          <TermsModal onClose={() => setShowTerms(false)} />
        )}
      </div>
    </div>
  );
};

// Modal de Política de Privacidade
const PrivacyModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <FileText size={24} className="text-green-600" />
          Política de Privacidade
        </h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
      </div>
      <div className="p-6 overflow-y-auto max-h-[60vh] text-sm text-gray-700 space-y-4">
        <p><strong>Última atualização:</strong> Janeiro de 2026</p>
        
        <h3 className="font-bold text-gray-800">1. Dados que Coletamos</h3>
        <p>Coletamos os seguintes dados pessoais:</p>
        <ul className="list-disc ml-5 space-y-1">
          <li><strong>Dados de identificação:</strong> nome, email</li>
          <li><strong>Dados físicos:</strong> peso, altura, idade, sexo</li>
          <li><strong>Dados de saúde (sensíveis):</strong> condições de saúde, medicamentos, restrições alimentares</li>
          <li><strong>Dados comportamentais:</strong> níveis de estresse, qualidade do sono, apetite</li>
        </ul>

        <h3 className="font-bold text-gray-800">2. Finalidade do Tratamento</h3>
        <p>Utilizamos seus dados exclusivamente para:</p>
        <ul className="list-disc ml-5 space-y-1">
          <li>Gerar cardápios alimentares personalizados</li>
          <li>Fornecer recomendações nutricionais baseadas no seu perfil</li>
          <li>Manter histórico das suas preferências e evolução</li>
        </ul>

        <h3 className="font-bold text-gray-800">3. Compartilhamento de Dados</h3>
        <p>Seus dados são processados por serviços de inteligência artificial para geração dos cardápios. 
        Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros para fins comerciais.</p>

        <h3 className="font-bold text-gray-800">4. Armazenamento e Segurança</h3>
        <p>Seus dados são armazenados em servidores seguros com criptografia. 
        Utilizamos medidas técnicas e organizacionais para proteger suas informações.</p>

        <h3 className="font-bold text-gray-800">5. Seus Direitos (LGPD)</h3>
        <p>Você tem direito a:</p>
        <ul className="list-disc ml-5 space-y-1">
          <li>Acessar seus dados pessoais</li>
          <li>Corrigir dados incompletos ou incorretos</li>
          <li>Solicitar a exclusão dos seus dados</li>
          <li>Revogar o consentimento a qualquer momento</li>
          <li>Solicitar portabilidade dos dados</li>
        </ul>

        <h3 className="font-bold text-gray-800">6. Contato</h3>
        <p>Para exercer seus direitos ou esclarecer dúvidas sobre privacidade:</p>
        <p><strong>Email:</strong> privacidade@cardapiofamiliar.com.br</p>
      </div>
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onClose}
          className="w-full bg-green-600 text-white py-2 rounded-xl font-semibold hover:bg-green-700"
        >
          Entendi
        </button>
      </div>
    </div>
  </div>
);

// Modal de Termos de Uso
const TermsModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <FileText size={24} className="text-blue-600" />
          Termos de Uso
        </h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
      </div>
      <div className="p-6 overflow-y-auto max-h-[60vh] text-sm text-gray-700 space-y-4">
        <p><strong>Última atualização:</strong> Janeiro de 2026</p>
        
        <h3 className="font-bold text-gray-800">1. Aceitação dos Termos</h3>
        <p>Ao utilizar o Cardápio Familiar Inteligente, você concorda com estes termos de uso.</p>

        <h3 className="font-bold text-gray-800">2. Descrição do Serviço</h3>
        <p>O Cardápio Familiar Inteligente é uma ferramenta que utiliza inteligência artificial 
        para gerar sugestões de cardápios personalizados com base nas informações fornecidas pelo usuário.</p>

        <h3 className="font-bold text-gray-800">3. Aviso Importante - Não é Orientação Médica</h3>
        <div className="bg-red-50 p-3 rounded-lg border border-red-200">
          <p className="text-red-800">
            <strong>ATENÇÃO:</strong> Este aplicativo NÃO substitui orientação de profissionais de saúde. 
            As sugestões geradas são apenas orientativas. Para condições específicas de saúde, 
            consulte sempre um médico ou nutricionista.
          </p>
        </div>

        <h3 className="font-bold text-gray-800">4. Responsabilidades do Usuário</h3>
        <ul className="list-disc ml-5 space-y-1">
          <li>Fornecer informações verdadeiras e atualizadas</li>
          <li>Manter suas credenciais de acesso seguras</li>
          <li>Não utilizar o serviço para fins ilegais</li>
          <li>Consultar profissionais de saúde para orientação médica/nutricional</li>
        </ul>

        <h3 className="font-bold text-gray-800">5. Limitação de Responsabilidade</h3>
        <p>O serviço é fornecido "como está". Não garantimos que as sugestões serão adequadas 
        para todas as condições de saúde. O uso das recomendações é de responsabilidade do usuário.</p>

        <h3 className="font-bold text-gray-800">6. Propriedade Intelectual</h3>
        <p>Todo o conteúdo do aplicativo é protegido por direitos autorais. 
        É proibida a reprodução sem autorização.</p>

        <h3 className="font-bold text-gray-800">7. Alterações nos Termos</h3>
        <p>Podemos alterar estes termos a qualquer momento. 
        Alterações significativas serão comunicadas por email.</p>
      </div>
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onClose}
          className="w-full bg-blue-600 text-white py-2 rounded-xl font-semibold hover:bg-blue-700"
        >
          Entendi
        </button>
      </div>
    </div>
  </div>
);
