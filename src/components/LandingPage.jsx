import { useState } from 'react';
import { 
  Sparkles, 
  Users, 
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
  Zap
} from 'lucide-react';

export const LandingPage = ({ onStartTrial, onLogin }) => {
  const [showDemo, setShowDemo] = useState(false);

  const features = [
    {
      icon: <Brain className="text-purple-500" size={28} />,
      title: "IA Personalizada",
      description: "Cardápios adaptados às necessidades nutricionais de cada membro da família"
    },
    {
      icon: <Heart className="text-red-500" size={28} />,
      title: "Saúde Emocional",
      description: "Considera estresse, sono e humor para sugerir alimentos que ajudam o bem-estar"
    },
    {
      icon: <Calendar className="text-blue-500" size={28} />,
      title: "Planejamento Semanal",
      description: "Organize 7 dias de refeições de uma vez, economizando tempo e dinheiro"
    },
    {
      icon: <ShoppingCart className="text-green-500" size={28} />,
      title: "Lista de Compras",
      description: "Lista automática e organizada por categoria para ir ao mercado"
    },
    {
      icon: <Clock className="text-orange-500" size={28} />,
      title: "Adapta à sua Rotina",
      description: "Semana corrida? Receitas rápidas. Mais tempo? Pratos elaborados"
    },
    {
      icon: <Users className="text-indigo-500" size={28} />,
      title: "Toda a Família",
      description: "Perfis individuais respeitando restrições e preferências de cada um"
    }
  ];

  const steps = [
    { number: "1", title: "Cadastre os perfis", description: "Adicione cada membro da família com suas preferências" },
    { number: "2", title: "Responda sobre a semana", description: "Como está o estresse, sono e rotina de cada um" },
    { number: "3", title: "Receba o cardápio", description: "IA gera um plano personalizado para 7 dias" },
  ];

  const testimonials = [
    { 
      name: "Marina S.", 
      text: "Finalmente parei de pensar 'o que fazer pro jantar?' todo dia!", 
      rating: 5 
    },
    { 
      name: "Carlos R.", 
      text: "Minha esposa tem restrições alimentares e o app considera tudo perfeitamente.", 
      rating: 5 
    },
    { 
      name: "Ana P.", 
      text: "A lista de compras organizada me fez economizar tempo e dinheiro.", 
      rating: 5 
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
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
            Cardápios semanais personalizados para cada membro da família, 
            considerando saúde, rotina e orçamento.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onStartTrial}
              className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-green-700 transition-all hover:scale-105 shadow-lg shadow-green-200"
            >
              Experimentar Grátis
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

          <p className="mt-6 text-sm text-gray-500 flex items-center justify-center gap-2">
            <Shield size={16} />
            Sem cadastro para experimentar • Seus dados protegidos pela LGPD
          </p>
        </div>
      </section>

      {/* Social Proof */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap items-center justify-center gap-8 text-gray-500 text-sm">
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="#FFB800" stroke="#FFB800" />)}
            </div>
            <span>4.9/5 de avaliação</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={20} />
            <span>+2.500 famílias ativas</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={20} />
            <span>+15.000 cardápios gerados</span>
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

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-16 sm:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            O que estão falando
          </h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} fill="#FFB800" stroke="#FFB800" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">
                "{testimonial.text}"
              </p>
              <p className="font-medium text-gray-900">
                {testimonial.name}
              </p>
            </div>
          ))}
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
            Experimente agora mesmo, sem precisar criar conta. 
            Veja como a IA cria um cardápio personalizado para sua família.
          </p>
          <button
            onClick={onStartTrial}
            className="inline-flex items-center justify-center gap-2 bg-white text-green-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors"
          >
            Experimentar Grátis Agora
            <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="text-green-600" size={20} />
              <span className="font-semibold text-gray-800">Cardápio Familiar Inteligente</span>
            </div>
            <div className="flex gap-6 text-sm text-gray-600">
              <a href="#" className="hover:text-green-600">Privacidade</a>
              <a href="#" className="hover:text-green-600">Termos</a>
              <a href="#" className="hover:text-green-600">Contato</a>
            </div>
            <p className="text-sm text-gray-500">
              © 2026 Cardápio Familiar. Feito com ❤️ no Brasil.
            </p>
          </div>
        </div>
      </footer>

      {/* Demo Modal */}
      {showDemo && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Como funciona</h3>
              <button 
                onClick={() => setShowDemo(false)}
                className="text-gray-500 hover:text-gray-700"
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
    </div>
  );
};
