import { useMemo } from 'react';
import { ArrowRight, ArrowLeft, Users, MessageSquare, Calendar, ChefHat } from 'lucide-react';
import { SEOPage } from '../seo/SEOPage';
import { buildFAQPageSchema } from '../../utils/seo';

const BASE_URL = typeof window !== 'undefined' ? window.location.origin : 'https://www.nuri.app.br';

const FAQS = [
  {
    question: 'Preciso me cadastrar?',
    answer: 'Não. Você pode usar em modo convidado e gerar cardápios à vontade. Cadastro é opcional e serve para salvar histórico e perfis.',
  },
  {
    question: 'É realmente grátis?',
    answer: 'Sim. O NURI é gratuito para uso pessoal. Não pedimos cartão de crédito.',
  },
  {
    question: 'Quanto tempo leva?',
    answer: 'Menos de 5 minutos para preencher perfis e contexto. A geração do cardápio leva poucos segundos.',
  },
];

export function ComoFuncionaPage() {
  const handleCta = () => {
    window.location.href = '/';
  };

  const handleBack = () => {
    window.location.href = '/';
  };

  const faqSchema = useMemo(
    () => buildFAQPageSchema(FAQS, `${BASE_URL}/como-funciona`),
    []
  );

  return (
    <SEOPage
      title="Como funciona o NURI - Cardápio Semanal Automático"
      description="Planeje suas refeições em 5 minutos. Cardápio personalizado, lista de compras e economia garantida. Sem cadastro obrigatório."
      keywords="cardápio semanal, planejamento alimentar, lista de compras, economia, como planejar refeições"
      url={`${BASE_URL}/como-funciona`}
      schema={faqSchema}
    >
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        <header className="container mx-auto px-4 py-6">
          <nav className="flex items-center justify-between">
            <a
              href="/"
              onClick={(e) => { e.preventDefault(); handleBack(); }}
              className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors font-medium"
            >
              <ArrowLeft size={20} aria-hidden="true" />
              Voltar
            </a>
            <img src="/nuri-logo-horizontal.png" alt="NURI - Nutrição Inteligente" className="h-11 w-auto object-contain" />
          </nav>
        </header>

        <main className="container mx-auto px-4 py-8 sm:py-12 max-w-3xl" id="main-content">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Como funciona o NURI
          </h1>
          <p className="text-lg text-gray-600 mb-10">
            Sua semana organizada em 3 passos simples. Sem stress, sem desperdício.
          </p>

          <section className="space-y-10 mb-12">
            <article className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                <Users size={24} aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">1. Cadastre sua família</h2>
                <p className="text-gray-600">
                  Adicione cada pessoa que come em casa: idade, restrições alimentares, objetivos (emagrecer, ganhar massa, manter). 
                  O NURI usa isso para montar um cardápio que respeita alergias, intolerâncias e preferências. 
                  Você pode usar o modo gratuito sem cadastro e experimentar na hora.
                </p>
              </div>
            </article>

            <article className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                <MessageSquare size={24} aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">2. Conte como está a semana</h2>
                <p className="text-gray-600">
                  Para cada membro, responda como está o estresse, o sono, a energia e o apetite. 
                  Diga também quanto tempo e orçamento você tem para cozinhar e fazer compras. 
                  A IA leva tudo isso em conta: semana corrida vira receitas rápidas; semana mais tranquila pode ter pratos elaborados.
                </p>
              </div>
            </article>

            <article className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
                <Calendar size={24} aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">3. Receba o cardápio e a lista de compras</h2>
                <p className="text-gray-600">
                  Em segundos você recebe o planejamento de 7 dias: café, almoço, lanche e jantar. 
                  A lista de compras sai organizada por categoria, pronta para o mercado. 
                  Você pode imprimir ou salvar em PDF. Quem cria conta ainda guarda histórico e pode repetir ou ajustar nas próximas semanas.
                </p>
              </div>
            </article>
          </section>

          <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 mb-10" aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="text-xl font-semibold text-gray-900 mb-4">Perguntas frequentes</h2>
            <dl className="space-y-4">
              {FAQS.map((faq, i) => (
                <div key={i}>
                  <dt className="font-medium text-gray-900">{faq.question}</dt>
                  <dd className="text-gray-600 mt-1">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </section>

          <div className="text-center">
            <button
              onClick={handleCta}
              className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-green-700 transition-all hover:scale-105 shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              <ChefHat size={22} aria-hidden="true" />
              Experimentar grátis
              <ArrowRight size={20} aria-hidden="true" />
            </button>
          </div>
        </main>

        <footer className="container mx-auto px-4 py-8 border-t border-gray-200 mt-12">
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            <a href="/" className="hover:text-green-600 transition-colors">Início</a>
            <a href="/para-quem-e" className="hover:text-green-600 transition-colors">Para quem é</a>
            <a href="/apoie" className="hover:text-yellow-600 transition-colors">Apoie o projeto</a>
          </div>
          <p className="text-center text-sm text-gray-500 mt-4">© 2026 NURI. Nutrição Inteligente.</p>
        </footer>
      </div>
    </SEOPage>
  );
}
