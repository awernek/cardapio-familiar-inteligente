import { useState } from 'react';
import { 
  Sparkles, 
  Users,
  User,
  Calendar, 
  ShoppingCart, 
  Brain, 
  Heart, 
  Clock, 
  ChefHat,
  ArrowRight,
  CheckCircle2,
  Star,
  Play,
  Shield,
  Zap,
  Mail,
  Send,
  X,
  MessageCircle
} from 'lucide-react';

export const LandingPage = ({ onStartTrial, onLogin }) => {
  const [showDemo, setShowDemo] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactStatus, setContactStatus] = useState(null); // 'sending' | 'success' | 'error'

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactStatus('sending');
    
    try {
      // Usando Web3Forms (gratuito) - funciona sem backend
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: 'YOUR_ACCESS_KEY_HERE', // Substitua pela sua chave do Web3Forms
          from_name: contactForm.name,
          email: contactForm.email,
          message: contactForm.message,
          subject: `Contato - Cardápio Familiar: ${contactForm.name}`,
          to: 'wernekdev@gmail.com'
        })
      });
      
      if (response.ok) {
        setContactStatus('success');
        setContactForm({ name: '', email: '', message: '' });
        setTimeout(() => {
          setShowContact(false);
          setContactStatus(null);
        }, 3000);
      } else {
        throw new Error('Erro ao enviar');
      }
    } catch (err) {
      // Fallback: abre email client
      const mailtoLink = `mailto:wernekdev@gmail.com?subject=${encodeURIComponent(`Contato - Cardápio Familiar: ${contactForm.name}`)}&body=${encodeURIComponent(`Nome: ${contactForm.name}\nEmail: ${contactForm.email}\n\nMensagem:\n${contactForm.message}`)}`;
      window.open(mailtoLink, '_blank');
      setContactStatus('success');
      setTimeout(() => {
        setShowContact(false);
        setContactStatus(null);
      }, 2000);
    }
  };

  const features = [
    {
      icon: <Brain className="text-purple-500" size={28} />,
      title: "IA Personalizada",
      description: "Cardápios adaptados às necessidades nutricionais de cada membro da família, incluindo crianças e idosos"
    },
    {
      icon: <Heart className="text-red-500" size={28} />,
      title: "Saúde Emocional",
      description: "Considera estresse, sono e humor para sugerir alimentos que ajudam o bem-estar mental"
    },
    {
      icon: <Calendar className="text-blue-500" size={28} />,
      title: "Cardápio Semanal Completo",
      description: "Organize café, almoço, lanche e jantar para 7 dias, economizando tempo e dinheiro no mercado"
    },
    {
      icon: <ShoppingCart className="text-green-500" size={28} />,
      title: "Lista de Compras Automática",
      description: "Lista organizada por categoria para economizar no supermercado e evitar desperdício"
    },
    {
      icon: <Clock className="text-orange-500" size={28} />,
      title: "Receitas para sua Rotina",
      description: "Semana corrida? Receitas rápidas de 15 minutos. Mais tempo? Pratos elaborados"
    },
    {
      icon: <Users className="text-indigo-500" size={28} />,
      title: "Para Toda a Família",
      description: "Perfis individuais respeitando alergias, intolerâncias e preferências de cada um"
    }
  ];

  const steps = [
    { number: "1", title: "Cadastre os perfis", description: "Adicione cada membro da família com suas preferências" },
    { number: "2", title: "Responda sobre a semana", description: "Como está o estresse, sono e rotina de cada um" },
    { number: "3", title: "Receba o cardápio", description: "IA gera um plano personalizado para 7 dias" },
  ];

  const faqs = [
    { 
      question: "O app é realmente gratuito?", 
      answer: "Sim! O modo gratuito permite gerar cardápios completos sem limite. No futuro, teremos planos pagos com funcionalidades extras como histórico e perfis salvos." 
    },
    { 
      question: "Preciso criar uma conta?", 
      answer: "Não é obrigatório. Você pode usar imediatamente sem cadastro. Os dados são usados apenas para gerar o cardápio e não são salvos." 
    },
    { 
      question: "A IA substitui um nutricionista?", 
      answer: "Não. O app é uma ferramenta de planejamento. Para orientação nutricional específica ou tratamento de condições de saúde, consulte um profissional." 
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6" role="banner">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="text-green-600" size={28} />
            <span className="font-bold text-xl text-gray-800">Cardápio Familiar</span>
          </div>
          <button
            onClick={onLogin}
            className="text-gray-600 hover:text-green-600 font-medium transition-colors"
          >
            Entrar
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <main role="main">
      <section className="container mx-auto px-4 py-12 sm:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap size={16} />
            Powered by Inteligência Artificial
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Acabe com o
            <span className="text-green-600"> "O que vou fazer pro jantar?"</span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Planejamento alimentar semanal para famílias de 2, 3, 4 ou mais pessoas. 
            Cardápios personalizados que consideram saúde, rotina e orçamento.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onStartTrial}
              className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-green-700 transition-all hover:scale-105 shadow-lg shadow-green-200"
            >
              Montar Meu Cardápio Grátis
              <ArrowRight size={20} />
            </button>
            <button
              onClick={() => setShowDemo(true)}
              className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-colors border border-gray-200"
            >
              <Play size={20} />
              Ver como funciona
            </button>
          </div>

          <p className="mt-6 text-sm text-gray-600 flex items-center justify-center gap-2">
            <Shield size={16} />
            Sem cadastro • 100% gratuito • Seus dados não são salvos
          </p>
        </div>
      </section>

      {/* Value Props */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-gray-600 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-green-500" />
            <span>100% Gratuito</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap size={18} className="text-yellow-500" />
            <span>Cardápio em segundos</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-blue-500" />
            <span>Sem necessidade de cadastro</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16 sm:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Tudo que sua família precisa
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Um planejamento alimentar que entende a complexidade da vida real
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-white py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Simples como 1, 2, 3
            </h2>
            <p className="text-lg text-gray-600">
              Em menos de 5 minutos você tem seu cardápio pronto
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-8 max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="flex-1 text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 py-16 sm:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Perguntas Frequentes
          </h2>
        </div>

        <div className="max-w-2xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                {faq.question}
              </h3>
              <p className="text-gray-600">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="bg-white py-16 sm:py-24" id="sobre">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Por que criamos este app?
              </h2>
              <p className="text-lg text-gray-600">
                Uma história real de uma família que enfrentava o mesmo problema que você
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
                  <User size={32} className="text-white" />
                </div>
                <div className="space-y-4 text-gray-700">
                  <p>
                    <strong className="text-gray-900">Sou engenheiro de software, casado e pai de dois filhos.</strong> Como muitas famílias, vivemos a rotina corrida, a dúvida diária sobre o que preparar para comer e a dificuldade de conciliar alimentação saudável com tempo, orçamento e as necessidades de cada pessoa da casa.
                  </p>
                  <p>
                    Percebi que a maior dificuldade não era cozinhar, mas <strong className="text-gray-900">decidir</strong>: o que comprar, o que preparar e como adaptar as refeições para diferentes fases da vida, níveis de estresse, apetite e rotina. As soluções existentes eram genéricas demais e não refletiam a realidade de uma família comum.
                  </p>
                  <p>
                    Foi a partir dessa necessidade real que eu e minha esposa tivemos a ideia de criar o <strong className="text-gray-900">Cardápio Familiar Inteligente</strong>: uma ferramenta pensada para simplificar as decisões, organizar a lista de compras automaticamente e ajudar a planejar refeições possíveis, saudáveis e adaptadas a cada integrante da família.
                  </p>
                  <p className="text-sm text-gray-600 border-t border-gray-200 pt-4 mt-4">
                    Atuo como engenheiro de software há mais de 10 anos. Essa experiência me permitiu transformar um problema cotidiano em uma solução prática, usando tecnologia para facilitar a vida das pessoas — começando pela minha própria família.
                  </p>
                  <p className="text-sm text-gray-600 italic">
                    Este app não substitui nutricionistas nem promete fórmulas milagrosas. Ele existe para ajudar famílias reais a comer melhor dentro da sua realidade, semana após semana.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-3xl p-8 sm:p-12 text-center text-white max-w-4xl mx-auto">
          <ChefHat size={48} className="mx-auto mb-4 opacity-90" />
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Pronto para acabar com o estresse na cozinha?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
            Planeje o cardápio semanal da sua família em minutos. 
            Ideal para famílias de 2, 3, 4 ou mais pessoas.
          </p>
          <button
            onClick={onStartTrial}
            className="inline-flex items-center justify-center gap-2 bg-white text-green-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors"
          >
            Montar Meu Cardápio Agora
            <ArrowRight size={20} />
          </button>
        </div>
      </section>

      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-8" role="contentinfo">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="text-green-600" size={20} />
              <span className="font-semibold text-gray-800">Cardápio Familiar Inteligente</span>
            </div>
            <div className="flex gap-6 text-sm text-gray-600">
              <button 
                onClick={() => setShowPrivacy(true)}
                className="hover:text-green-600"
              >
                Privacidade
              </button>
              <button 
                onClick={() => setShowTerms(true)}
                className="hover:text-green-600"
              >
                Termos
              </button>
              <button 
                onClick={() => setShowContact(true)}
                className="hover:text-green-600 flex items-center gap-1"
              >
                <Mail size={14} />
                Contato
              </button>
            </div>
            <p className="text-sm text-gray-600">
              © 2026 Cardápio Familiar. Feito com ❤️ no Brasil.
            </p>
          </div>
        </div>
      </footer>

      {/* Floating Contact Button */}
      <button
        onClick={() => setShowContact(true)}
        className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-all hover:scale-110 z-40"
        aria-label="Fale conosco"
      >
        <MessageCircle size={24} />
      </button>

      {/* Demo Modal */}
      {showDemo && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Como funciona</h3>
              <button 
                onClick={() => setShowDemo(false)}
                className="text-gray-600 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Cadastre os perfis da família</h4>
                    <p className="text-sm text-gray-600">Idade, peso, altura, restrições alimentares e objetivos de cada pessoa.</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Responda sobre a semana</h4>
                    <p className="text-sm text-gray-600">Como está a rotina, orçamento, tempo para cozinhar e estado emocional.</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
                  <div>
                    <h4 className="font-semibold text-gray-800">IA gera o cardápio</h4>
                    <p className="text-sm text-gray-600">7 dias de café, almoço, lanche e jantar + lista de compras organizada.</p>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => { setShowDemo(false); onStartTrial(); }}
              className="w-full mt-6 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 flex items-center justify-center gap-2"
            >
              Experimentar Agora
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Privacy Modal */}
      {showPrivacy && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-bold text-gray-800">Política de Privacidade</h3>
              <button 
                onClick={() => setShowPrivacy(false)}
                className="text-gray-600 hover:text-gray-700 p-1"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto text-sm text-gray-700 space-y-4">
              <p><strong>Última atualização:</strong> Janeiro de 2026</p>
              
              <h4 className="font-semibold text-gray-900">1. Coleta de Dados</h4>
              <p>No modo gratuito (sem cadastro), coletamos apenas os dados que você fornece para gerar o cardápio. Esses dados são processados temporariamente e <strong>não são armazenados</strong> em nossos servidores.</p>
              
              <h4 className="font-semibold text-gray-900">2. Dados Sensíveis</h4>
              <p>Informações de saúde (peso, altura, condições médicas) são consideradas dados sensíveis pela LGPD. Esses dados são usados exclusivamente para personalizar as sugestões alimentares e são tratados com máxima segurança.</p>
              
              <h4 className="font-semibold text-gray-900">3. Uso da Inteligência Artificial</h4>
              <p>Utilizamos serviços de IA de terceiros (Groq/Llama) para gerar os cardápios. Os dados enviados são processados de forma anônima e não são utilizados para treinamento de modelos.</p>
              
              <h4 className="font-semibold text-gray-900">4. Cookies e Analytics</h4>
              <p>Utilizamos o Vercel Analytics para entender como o site é utilizado. Não coletamos informações pessoais identificáveis através deste serviço.</p>
              
              <h4 className="font-semibold text-gray-900">5. Seus Direitos (LGPD)</h4>
              <p>Você tem direito a: acesso aos seus dados, correção, exclusão, portabilidade e revogação do consentimento. Para exercer esses direitos, entre em contato pelo email wernekdev@gmail.com.</p>
              
              <h4 className="font-semibold text-gray-900">6. Contato</h4>
              <p>Para dúvidas sobre privacidade: <a href="mailto:wernekdev@gmail.com" className="text-green-600 hover:underline">wernekdev@gmail.com</a></p>
            </div>
            <div className="p-4 border-t">
              <button
                onClick={() => setShowPrivacy(false)}
                className="w-full bg-green-600 text-white py-2.5 rounded-xl font-semibold hover:bg-green-700"
              >
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Terms Modal */}
      {showTerms && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-bold text-gray-800">Termos de Uso</h3>
              <button 
                onClick={() => setShowTerms(false)}
                className="text-gray-600 hover:text-gray-700 p-1"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto text-sm text-gray-700 space-y-4">
              <p><strong>Última atualização:</strong> Janeiro de 2026</p>
              
              <h4 className="font-semibold text-gray-900">1. Aceitação</h4>
              <p>Ao utilizar o Cardápio Familiar Inteligente, você concorda com estes termos de uso.</p>
              
              <h4 className="font-semibold text-gray-900">2. Descrição do Serviço</h4>
              <p>O Cardápio Familiar Inteligente é uma ferramenta de planejamento alimentar que utiliza inteligência artificial para gerar sugestões de cardápios personalizados.</p>
              
              <h4 className="font-semibold text-gray-900">3. Limitações</h4>
              <p><strong>Este serviço NÃO substitui orientação médica ou nutricional profissional.</strong> As sugestões são geradas por IA e devem ser consideradas apenas como referência para planejamento.</p>
              
              <h4 className="font-semibold text-gray-900">4. Responsabilidades do Usuário</h4>
              <p>Você é responsável por: fornecer informações precisas, consultar profissionais de saúde para dietas específicas, e verificar alergias e restrições antes de preparar as receitas.</p>
              
              <h4 className="font-semibold text-gray-900">5. Isenção de Responsabilidade</h4>
              <p>Não nos responsabilizamos por: reações alérgicas, problemas de saúde decorrentes do uso das sugestões, ou resultados diferentes dos esperados. Consulte sempre um nutricionista.</p>
              
              <h4 className="font-semibold text-gray-900">6. Propriedade Intelectual</h4>
              <p>Todo o conteúdo do site (design, código, textos) é de propriedade do Cardápio Familiar Inteligente e está protegido por direitos autorais.</p>
              
              <h4 className="font-semibold text-gray-900">7. Modificações</h4>
              <p>Reservamo-nos o direito de modificar estes termos a qualquer momento. Alterações significativas serão comunicadas aos usuários.</p>
              
              <h4 className="font-semibold text-gray-900">8. Contato</h4>
              <p>Para dúvidas: <a href="mailto:wernekdev@gmail.com" className="text-green-600 hover:underline">wernekdev@gmail.com</a></p>
            </div>
            <div className="p-4 border-t">
              <button
                onClick={() => setShowTerms(false)}
                className="w-full bg-green-600 text-white py-2.5 rounded-xl font-semibold hover:bg-green-700"
              >
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showContact && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Mail className="text-green-600" size={24} />
                <h3 className="text-xl font-bold text-gray-800">Fale Conosco</h3>
              </div>
              <button 
                onClick={() => { setShowContact(false); setContactStatus(null); }}
                className="text-gray-600 hover:text-gray-700 p-1"
              >
                <X size={20} />
              </button>
            </div>

            {contactStatus === 'success' ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="text-green-600" size={32} />
                </div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Mensagem enviada!</h4>
                <p className="text-gray-600">Obrigado pelo contato. Responderemos em breve.</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Seu nome"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="seu@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mensagem <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    placeholder="Como podemos ajudar?"
                  />
                </div>
                <button
                  type="submit"
                  disabled={contactStatus === 'sending'}
                  className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {contactStatus === 'sending' ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Enviar Mensagem
                    </>
                  )}
                </button>
                <p className="text-xs text-gray-600 text-center">
                  Ou envie diretamente para{' '}
                  <a href="mailto:wernekdev@gmail.com" className="text-green-600 hover:underline">
                    wernekdev@gmail.com
                  </a>
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
