import { ArrowRight, ArrowLeft, BookOpen } from 'lucide-react';
import { SEOPage } from '../seo/SEOPage';
import { BLOG_POSTS } from '../../content/blogPosts';

const BASE_URL = typeof window !== 'undefined' ? window.location.origin : 'https://www.nuri.app.br';

export function BlogListPage() {
  const goHome = () => { window.location.href = '/'; };

  return (
    <SEOPage
      title="Blog — Dicas de planejamento alimentar e cardápio semanal"
      description="Artigos sobre cardápio semanal econômico, planejamento alimentar familiar e como organizar as refeições da semana."
      keywords="blog nutrição, cardápio semanal, planejamento alimentar, dicas alimentação família"
      url={`${BASE_URL}/blog`}
    >
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        <header className="container mx-auto px-4 py-6">
          <nav className="flex items-center justify-between">
            <a href="/" onClick={(e) => { e.preventDefault(); goHome(); }} className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors font-medium">
              <ArrowLeft size={20} aria-hidden="true" />
              Voltar
            </a>
            <img src="/nuri-logo-horizontal.png" alt="NURI" className="h-11 w-auto object-contain" />
          </nav>
        </header>

        <main className="container mx-auto px-4 py-8 sm:py-12 max-w-3xl" id="main-content">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Blog
          </h1>
          <p className="text-lg text-gray-600 mb-10">
            Dicas de planejamento alimentar, cardápio semanal e organização para sua família.
          </p>

          <ul className="space-y-6" role="list">
            {BLOG_POSTS.map((post) => (
              <li key={post.slug}>
                <article className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <time className="text-sm text-gray-500" dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </time>
                  <h2 className="text-xl font-bold text-gray-900 mt-2 mb-2">
                    <a href={`/blog/${post.slug}`} className="hover:text-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded">
                      {post.title}
                    </a>
                  </h2>
                  <p className="text-gray-600 mb-4">{post.description}</p>
                  <a
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-green-600 font-medium hover:text-green-700"
                  >
                    Ler mais
                    <ArrowRight size={18} aria-hidden="true" />
                  </a>
                </article>
              </li>
            ))}
          </ul>

          <div className="mt-10 text-center">
            <a
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
            >
              <BookOpen size={20} aria-hidden="true" />
              Montar meu cardápio
            </a>
          </div>
        </main>

        <footer className="container mx-auto px-4 py-8 border-t border-gray-200 mt-12">
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            <a href="/" className="hover:text-green-600 transition-colors">Início</a>
            <a href="/como-funciona" className="hover:text-green-600 transition-colors">Como funciona</a>
            <a href="/para-quem-e" className="hover:text-green-600 transition-colors">Para quem é</a>
          </div>
          <p className="text-center text-sm text-gray-500 mt-4">© 2026 NURI. Nutrição Inteligente.</p>
        </footer>
      </div>
    </SEOPage>
  );
}
