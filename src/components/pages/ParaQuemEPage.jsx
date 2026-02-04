import { ArrowRight, ArrowLeft, Users, Heart, Briefcase, Baby } from 'lucide-react';
import { SEOPage } from '../seo/SEOPage';

const BASE_URL = typeof window !== 'undefined' ? window.location.origin : 'https://www.nuri.app.br';

export function ParaQuemEPage() {
  const handleCta = () => {
    window.location.href = '/';
  };

  return (
    <SEOPage
      title="Para quem é o NURI - Planejamento Alimentar para Famílias"
      description="Para quem está cansado de decidir o que fazer pro jantar. Famílias, pais ocupados, quem quer economizar e comer melhor sem complicação."
      keywords="planejamento alimentar familiar, cardápio para família, o que fazer pro jantar, organização semanal, economia mercado"
      url={`${BASE_URL}/para-quem-e`}
    >
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        <header className="container mx-auto px-4 py-6">
          <nav className="flex items-center justify-between">
            <a
              href="/"
              onClick={(e) => { e.preventDefault(); window.location.href = '/'; }}
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
            Para quem é o NURI
          </h1>
          <p className="text-lg text-gray-600 mb-10">
            Para quem quer semana organizada, sem correria na hora das refeições e sem desperdício.
          </p>

          <section className="space-y-8 mb-12">
            <article className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                <Users size={24} aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Famílias que comem junto</h2>
                <p className="text-gray-600">
                  Quem tem criança, adolescente, idoso ou pessoas com restrições em casa sabe: um cardápio único não resolve. 
                  O NURI monta a semana pensando em cada perfil — quantidade, preferências e objetivos — e une tudo em um plano só, 
                  com lista de compras única para você não perder tempo no mercado.
                </p>
              </div>
            </article>

            <article className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
                <Briefcase size={24} aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Quem vive correndo</h2>
                <p className="text-gray-600">
                  Se você nunca sabe o que fazer pro jantar e acaba pedindo delivery ou repetindo os mesmos pratos, 
                  o NURI ajuda a ter um plano na mão: você escolhe quanto tempo tem para cozinhar e o app sugere receitas 
                  que cabem na sua rotina. Menos decisão no dia a dia e mais previsibilidade.
                </p>
              </div>
            </article>

            <article className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                <Heart size={24} aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Quem quer comer melhor sem dieta radical</h2>
                <p className="text-gray-600">
                  Não é app de dieta restritiva. É para quem quer organizar a alimentação da casa, 
                  reduzir desperdício e variar o cardápio com refeições possíveis e saborosas. 
                  A IA considera sono, estresse e apetite da semana para sugerir opções que fazem sentido no momento.
                </p>
              </div>
            </article>

            <article className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                <Baby size={24} aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Pais e cuidadores</h2>
                <p className="text-gray-600">
                  Planejar lanches, almoços e jantares para os pequenos (ou para quem precisa de cuidado especial) 
                  exige tempo e criatividade. O NURI ajuda a ter uma semana desenhada com antecedência, 
                  com lista de compras pronta, para você focar em executar em vez de decidir na última hora.
                </p>
              </div>
            </article>
          </section>

          <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 mb-10">
            <p className="text-gray-700">
              <strong className="text-gray-900">Resumindo:</strong> o NURI é para quem quer acabar com o “o que a gente come hoje?” 
              e ter uma semana organizada, com cardápio personalizado e lista de compras em poucos minutos. 
              É gratuito para começar e não exige cadastro.
            </p>
          </section>

          <div className="text-center">
            <button
              onClick={handleCta}
              className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-green-700 transition-all hover:scale-105 shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Montar meu cardápio
              <ArrowRight size={20} aria-hidden="true" />
            </button>
          </div>
        </main>

        <footer className="container mx-auto px-4 py-8 border-t border-gray-200 mt-12">
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            <a href="/" className="hover:text-green-600 transition-colors">Início</a>
            <a href="/como-funciona" className="hover:text-green-600 transition-colors">Como funciona</a>
            <a href="/apoie" className="hover:text-yellow-600 transition-colors">Apoie o projeto</a>
          </div>
          <p className="text-center text-sm text-gray-500 mt-4">© 2026 NURI. Nutrição Inteligente.</p>
        </footer>
      </div>
    </SEOPage>
  );
}
