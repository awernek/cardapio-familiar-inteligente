import { useState, useEffect, useRef, useMemo } from 'react';
import { ArrowLeft, BookOpen, Clock, Users, Heart } from 'lucide-react';
import { SEOPage } from '../seo/SEOPage';
import { buildRecipeSchema } from '../../utils/seo';
import {
  getRecipeBySlug,
  incrementRecipeViews,
  getSavedRecipeIds,
  toggleSaveRecipe,
} from '../../services/recipesService';
import { useAuth } from '../../contexts/AuthContext';

const BASE_URL = typeof window !== 'undefined' ? window.location.origin : 'https://www.nuri.app.br';

/**
 * Converte instructions (texto com quebras ou array) em array de passos
 */
function parseInstructions(instructions) {
  if (!instructions) return [];
  if (Array.isArray(instructions)) return instructions;
  return String(instructions)
    .split(/\n+/)
    .map((s) => s.replace(/^\s*[-*•]\s*/, '').trim())
    .filter(Boolean);
}

export function RecipeDetailPage({ slug }) {
  const { user } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savedIds, setSavedIds] = useState(new Set());
  const viewsIncremented = useRef(false);

  useEffect(() => {
    if (!slug) return;
    getRecipeBySlug(slug).then((data) => {
      setRecipe(data);
      if (data && !viewsIncremented.current) {
        viewsIncremented.current = true;
        incrementRecipeViews(slug);
      }
    });
  }, [slug]);

  useEffect(() => {
    if (!user?.id) return;
    getSavedRecipeIds(user.id).then(setSavedIds);
  }, [user?.id]);

  const isSaved = recipe && savedIds.has(recipe.id);

  const handleSave = async () => {
    if (!user?.id || !recipe) return;
    setSaving(true);
    const nowSaved = await toggleSaveRecipe(user.id, recipe.id);
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (nowSaved) next.add(recipe.id);
      else next.delete(recipe.id);
      return next;
    });
    setSaving(false);
  };

  const steps = useMemo(() => (recipe ? parseInstructions(recipe.instructions) : []), [recipe]);
  const ingredients = useMemo(() => {
    if (!recipe?.ingredients) return [];
    const arr = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
    return arr.map((item) => {
      if (typeof item === 'string') return item;
      if (item?.name && item?.amount) return `${item.amount} ${item.name}`.trim();
      return typeof item === 'object' ? JSON.stringify(item) : String(item);
    });
  }, [recipe]);

  const recipeSchema = useMemo(() => {
    if (!recipe) return null;
    const baseUrl = BASE_URL;
    const url = `${baseUrl}/receita/${recipe.slug}`;
    return buildRecipeSchema(
      {
        name: recipe.title,
        description: recipe.description,
        image: recipe.image_url,
        prepTimeMinutes: recipe.prep_time_minutes,
        cookTimeMinutes: recipe.cook_time_minutes,
        recipeYield: recipe.servings,
        recipeIngredient: ingredients,
        recipeInstructions: steps,
      },
      url
    );
  }, [recipe, ingredients, steps]);

  if (!slug) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <p className="text-gray-600">URL inválida.</p>
      </div>
    );
  }

  if (recipe === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-green-500 border-t-transparent" aria-label="Carregando" />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Receita não encontrada.</p>
          <a href="/receitas" className="text-green-600 font-medium hover:underline">Ver todas as receitas</a>
        </div>
      </div>
    );
  }

  const pageUrl = `${BASE_URL}/receita/${recipe.slug}`;

  return (
    <SEOPage
      title={recipe.title}
      description={recipe.description || `Receita: ${recipe.title}. ${recipe.servings ? `${recipe.servings} porções.` : ''}`}
      keywords={`receita, ${recipe.category || ''}, ${recipe.title}, NURI`}
      image={recipe.image_url}
      url={pageUrl}
      schema={recipeSchema}
    >
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        <header className="container mx-auto px-4 py-6">
          <nav className="flex items-center justify-between">
            <a href="/receitas" className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors font-medium">
              <ArrowLeft size={20} aria-hidden="true" />
              Voltar às receitas
            </a>
            <img src="/nuri-logo-horizontal.png" alt="NURI" className="h-11 w-auto object-contain" />
          </nav>
        </header>

        <main className="container mx-auto px-4 py-8 sm:py-12 max-w-3xl" id="main-content">
          {recipe.image_url ? (
            <img
              src={recipe.image_url}
              alt=""
              className="w-full rounded-2xl aspect-[16/10] object-cover mb-6"
            />
          ) : (
            <div className="w-full rounded-2xl aspect-[16/10] bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center text-6xl mb-6" aria-hidden="true">
              🍽️
            </div>
          )}

          {recipe.category && (
            <span className="text-sm font-medium text-green-600 uppercase tracking-wide">{recipe.category}</span>
          )}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-1 mb-4">
            {recipe.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
            {recipe.prep_time_minutes > 0 && (
              <span className="flex items-center gap-1">
                <Clock size={16} aria-hidden="true" />
                Prep: {recipe.prep_time_minutes} min
              </span>
            )}
            {recipe.cook_time_minutes > 0 && (
              <span className="flex items-center gap-1">
                <Clock size={16} aria-hidden="true" />
                Cozimento: {recipe.cook_time_minutes} min
              </span>
            )}
            {recipe.servings > 0 && (
              <span className="flex items-center gap-1">
                <Users size={16} aria-hidden="true" />
                {recipe.servings} porções
              </span>
            )}
            {recipe.view_count > 0 && (
              <span>{recipe.view_count} visualizações</span>
            )}
          </div>

          {user && (
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors mb-6 ${
                isSaved ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-700'
              }`}
            >
              <Heart size={18} aria-hidden="true" fill={isSaved ? 'currentColor' : 'none'} />
              {saving ? 'Salvando...' : isSaved ? 'Receita salva' : 'Salvar receita'}
            </button>
          )}

          {recipe.description && (
            <p className="text-gray-700 mb-6">{recipe.description}</p>
          )}

          {ingredients.length > 0 && (
            <section className="mb-8" aria-labelledby="ingredients-heading">
              <h2 id="ingredients-heading" className="text-xl font-bold text-gray-900 mb-3">Ingredientes</h2>
              <ul className="list-disc list-inside space-y-1 text-gray-700" role="list">
                {ingredients.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          {steps.length > 0 && (
            <section className="mb-8" aria-labelledby="instructions-heading">
              <h2 id="instructions-heading" className="text-xl font-bold text-gray-900 mb-3">Modo de preparo</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700 space-y-2" role="list">
                {steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </section>
          )}

          <div className="mt-10 flex flex-wrap gap-4">
            <a href="/receitas" className="text-green-600 font-medium hover:underline">
              ← Mais receitas
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
            <a href="/receitas" className="hover:text-green-600 transition-colors">Receitas</a>
            <a href="/blog" className="hover:text-green-600 transition-colors">Blog</a>
          </div>
          <p className="text-center text-sm text-gray-500 mt-4">© 2026 NURI. Nutrição Inteligente.</p>
        </footer>
      </div>
    </SEOPage>
  );
}
