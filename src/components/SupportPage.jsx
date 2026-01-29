import { useState } from 'react';
import { 
  Sparkles, 
  Heart,
  Copy, 
  Check,
  ArrowLeft,
  Coffee,
  Server,
  Code
} from 'lucide-react';

/**
 * Página de apoio voluntário via Pix
 * Página estática, sem modal, sem pop-up, sem redirecionamento automático
 */
export const SupportPage = () => {
  const [copied, setCopied] = useState(false);
  
  // Chave Pix - pode ser configurada via env ou hardcoded
  const pixKey = import.meta.env.VITE_PIX_KEY || 'wernekdev@gmail.com';
  
  const handleCopyPix = async () => {
    try {
      await navigator.clipboard.writeText(pixKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      // Fallback para navegadores que não suportam clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = pixKey;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleGoBack = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header simples */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Voltar</span>
          </button>
          <div className="flex items-center gap-2">
            <Sparkles className="text-green-600" size={24} />
            <span className="font-bold text-lg text-gray-800">Cardápio Familiar</span>
          </div>
        </nav>
      </header>

      {/* Conteúdo principal */}
      <main className="container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-2xl mx-auto">
          {/* Título */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              💛 Apoie o Cardápio Familiar Inteligente
            </h1>
            <p className="text-lg text-gray-600">
              Seu apoio é voluntário e faz diferença para manter este projeto vivo.
            </p>
          </div>

          {/* Card principal */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-8">
            {/* Texto explicativo */}
            <div className="space-y-4 text-gray-700 mb-8">
              <p>
                O <strong className="text-gray-900">Cardápio Familiar Inteligente</strong> é um projeto 
                criado com carinho para ajudar famílias a planejarem suas refeições de forma mais 
                simples e saudável.
              </p>
              <p>
                O app é <strong className="text-green-600">100% gratuito</strong> e continuará assim. 
                Não existe assinatura, não existe bloqueio de funcionalidades, não existe versão 
                "premium" escondida.
              </p>
              <p>
                Se você gosta do projeto e quer contribuir de alguma forma, pode fazer um Pix de 
                qualquer valor. É totalmente opcional e não muda nada na sua experiência com o app.
              </p>
            </div>

            {/* Divisor */}
            <div className="border-t border-gray-100 my-8"></div>

            {/* Seção do Pix */}
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center justify-center gap-2">
                <Heart className="text-red-500" size={20} />
                Apoie via Pix
              </h2>

              {/* QR Code */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6 inline-block">
                <img 
                  src="/pix-qrcode.png" 
                  alt="QR Code Pix para doação" 
                  className="w-48 h-48 mx-auto rounded-lg"
                  onError={(e) => {
                    // Fallback para SVG se PNG não existir
                    e.target.src = '/pix-qrcode.svg';
                  }}
                />
                <p className="text-xs text-gray-400 mt-2">
                  Escaneie com o app do seu banco
                </p>
              </div>

              {/* Chave Pix */}
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">Ou copie a chave Pix:</p>
                <div className="flex items-center justify-center gap-2">
                  <code className="bg-gray-100 px-4 py-2 rounded-lg text-gray-800 font-mono text-sm">
                    {pixKey}
                  </code>
                  <button
                    onClick={handleCopyPix}
                    className={`p-2 rounded-lg transition-all ${
                      copied 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    title={copied ? 'Copiado!' : 'Copiar chave Pix'}
                  >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                </div>
                {copied && (
                  <p className="text-sm text-green-600 mt-2 animate-fade-in">
                    Chave copiada para a área de transferência!
                  </p>
                )}
              </div>

              {/* Mensagem de agradecimento */}
              <p className="text-gray-600">
                Qualquer valor ajuda 💛
              </p>
            </div>
          </div>

          {/* Transparência */}
          <div className="bg-gray-50 rounded-xl p-6 text-center">
            <h3 className="font-semibold text-gray-800 mb-4">
              Para onde vai o apoio?
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm text-gray-600">
              <div className="flex items-center justify-center gap-2">
                <Server size={16} className="text-blue-500" />
                <span>Servidores e hospedagem</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Code size={16} className="text-purple-500" />
                <span>Manutenção e melhorias</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Coffee size={16} className="text-orange-500" />
                <span>Cafezinho do desenvolvedor</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Este é um projeto independente mantido por uma pessoa. 
              Seu apoio ajuda a cobrir custos de infraestrutura e permite que o app continue gratuito para todos.
            </p>
          </div>

          {/* Botão de voltar */}
          <div className="text-center mt-8">
            <button
              onClick={handleGoBack}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors"
            >
              <ArrowLeft size={18} />
              <span>Voltar para o início</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer simples */}
      <footer className="border-t border-gray-200 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="text-green-600" size={16} />
            <span className="font-semibold text-gray-800">Cardápio Familiar Inteligente</span>
          </div>
          <p>© 2026 Cardápio Familiar. Feito com ❤️ no Brasil.</p>
        </div>
      </footer>
    </div>
  );
};
