import { useMemo } from 'react';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { SEOPage } from '../seo/SEOPage';
import { getPostBySlug } from '../../content/blogPosts';

const BASE_URL = typeof window !== 'undefined' ? window.location.origin : 'https://www.nuri.app.br';

export function BlogPostPage({ slug }) {
  const post = useMemo(() => getPostBySlug(slug), [slug]);

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Artigo não encontrado.</p>
          <a href="/blog" className="text-green-600 font-medium hover:underline">Voltar ao blog</a>
        </div>
      </div>
    );
  }

  const postUrl = `${BASE_URL}/blog/${post.slug}`;
  const articleSchema = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      author: { '@type': 'Organization', name: 'NURI - Nutrição Inteligente' },
      publisher: { '@type': 'Organization', name: 'NURI - Nutrição Inteligente' },
      url: postUrl,
    }),
    [post, postUrl]
  );

  return (
    <SEOPage
      title={post.title}
      description={post.description}
      keywords={post.keywords}
      url={postUrl}
      schema={articleSchema}
    >
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        <header className="container mx-auto px-4 py-6">
          <nav className="flex items-center justify-between">
            <a href="/blog" className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors font-medium">
              <ArrowLeft size={20} aria-hidden="true" />
              Voltar ao blog
            </a>
            <img src="/nuri-logo-horizontal.png" alt="NURI" className="h-11 w-auto object-contain" />
          </nav>
        </header>

        <main className="container mx-auto px-4 py-8 sm:py-12 max-w-3xl" id="main-content">
          <article>
            <time className="text-sm text-gray-500" dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </time>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-6">
              {post.title}
            </h1>
            <div className="prose prose-green max-w-none">
              {post.content.map((paragraph, i) => (
                <p key={i} className="text-gray-700 mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </article>

          <div className="mt-10 flex flex-wrap gap-4">
            <a href="/blog" className="text-green-600 font-medium hover:underline">
              ← Mais artigos
            </a>
            <a
              href="/"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
            >
              <BookOpen size={20} aria-hidden="true" />
              Montar meu cardápio
            </a>
          </div>
        </main>

        <footer className="container mx-auto px-4 py-8 border-t border-gray-200 mt-12">
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            <a href="/" className="hover:text-green-600 transition-colors">Início</a>
            <a href="/blog" className="hover:text-green-600 transition-colors">Blog</a>
          </div>
          <p className="text-center text-sm text-gray-500 mt-4">© 2026 NURI. Nutrição Inteligente.</p>
        </footer>
      </div>
    </SEOPage>
  );
}
