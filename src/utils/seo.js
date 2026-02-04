/**
 * Utilitários para SEO: meta tags e dados estruturados.
 * Use com SEOPage ou aplicando manualmente no document.
 */

const DEFAULT_KEYWORDS = 'cardápio semanal, planejamento alimentar, lista de compras, receitas familiares, economia mercado, o que fazer pro jantar';

/**
 * Gera objeto com meta tags para uma página.
 * @param {Object} options
 * @param {string} options.title - Título da página (será sufixado com " | NURI")
 * @param {string} options.description - Meta description
 * @param {string} [options.keywords] - Meta keywords (opcional)
 * @param {string} [options.image] - URL da imagem OG (fallback: /og-image.svg)
 * @param {string} [options.url] - URL canônica da página
 * @returns {Object} Objeto com title, description, keywords e propriedades og/twitter
 */
export function generateMetaTags({ title, description, keywords = DEFAULT_KEYWORDS, image, url }) {
  const baseTitle = title ? `${title} | NURI - Nutrição Inteligente` : 'NURI - Nutrição Inteligente';
  const imageUrl = image || (typeof window !== 'undefined' ? `${window.location.origin}/og-image.svg` : '/og-image.svg');
  const canonicalUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  return {
    title: baseTitle,
    description,
    keywords,
    'og:title': title || 'NURI - Nutrição Inteligente',
    'og:description': description,
    'og:image': imageUrl.startsWith('http') ? imageUrl : `${typeof window !== 'undefined' ? window.location.origin : ''}${imageUrl}`,
    'og:url': canonicalUrl,
    'og:type': 'website',
    'og:locale': 'pt_BR',
    'twitter:card': 'summary_large_image',
    'twitter:title': title || 'NURI - Nutrição Inteligente',
    'twitter:description': description,
    'twitter:image': imageUrl.startsWith('http') ? imageUrl : undefined,
    canonical: canonicalUrl,
  };
}

/**
 * Aplica meta tags no document (title + description).
 * Útil para páginas estáticas que não usam react-helmet.
 * @param {Object} meta - Objeto retornado por generateMetaTags
 * @returns {Function} Função de cleanup para restaurar valores anteriores (chame no unmount)
 */
export function applyMetaTags(meta) {
  const prevTitle = document.title;
  const metaDesc = document.querySelector('meta[name="description"]');
  const prevDescription = metaDesc ? metaDesc.getAttribute('content') : null;

  document.title = meta.title || prevTitle;
  if (meta.description) {
    if (!metaDesc) {
      const el = document.createElement('meta');
      el.name = 'description';
      el.content = meta.description;
      document.head.appendChild(el);
    } else {
      metaDesc.setAttribute('content', meta.description);
    }
  }

  return () => {
    document.title = prevTitle;
    const d = document.querySelector('meta[name="description"]');
    if (d) d.setAttribute('content', prevDescription || '');
  };
}

/**
 * Gera Schema.org FAQPage para rich snippets no Google.
 * @param {Array<{ question: string, answer: string }>} faqs
 * @param {string} [url] - URL da página
 * @returns {Object} JSON-LD FAQPage
 */
export function buildFAQPageSchema(faqs, url) {
  if (!faqs?.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    })),
    ...(url && { url }),
  };
}

/**
 * Gera Schema.org Organization (para home ou páginas institucionais).
 * @param {Object} options
 * @returns {Object} JSON-LD Organization
 */
export function buildOrganizationSchema({ name = 'NURI - Nutrição Inteligente', url, logo }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    ...(url && { url }),
    ...(logo && { logo }),
  };
}

/**
 * Gera Schema.org Recipe para página de receita (rich snippets).
 * @param {Object} recipe - { name, description, image, totalTime, cookTime, prepTime, recipeYield, recipeIngredient, recipeInstructions }
 * @param {string} [url] - URL canônica da página
 * @returns {Object} JSON-LD Recipe
 */
export function buildRecipeSchema(recipe, url) {
  if (!recipe?.name) return null;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.name,
    ...(recipe.description && { description: recipe.description }),
    ...(recipe.image && { image: Array.isArray(recipe.image) ? recipe.image : [recipe.image] }),
    ...(recipe.recipeYield && { recipeYield: String(recipe.recipeYield) }),
    ...(recipe.recipeIngredient?.length && { recipeIngredient: recipe.recipeIngredient }),
    ...(recipe.recipeInstructions?.length && {
      recipeInstructions: recipe.recipeInstructions.map((step) =>
        typeof step === 'string' ? { '@type': 'HowToStep', text: step } : { '@type': 'HowToStep', ...step }
      ),
    }),
  };
  if (recipe.prepTimeMinutes || recipe.cookTimeMinutes) {
    const total = (Number(recipe.prepTimeMinutes) || 0) + (Number(recipe.cookTimeMinutes) || 0);
    if (total > 0) schema.totalTime = `PT${total}M`;
    if (recipe.cookTimeMinutes) schema.cookTime = `PT${recipe.cookTimeMinutes}M`;
    if (recipe.prepTimeMinutes) schema.prepTime = `PT${recipe.prepTimeMinutes}M`;
  }
  if (url) schema.url = url;
  return schema;
}
