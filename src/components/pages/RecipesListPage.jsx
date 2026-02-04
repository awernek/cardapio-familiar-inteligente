import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, BookOpen, ChefHat } from 'lucide-react';
import { SEOPage } from '../seo/SEOPage';
import { RecipeCard } from '../recipes/RecipeCard';
import { RecipeFilters } from '../recipes/RecipeFilters';
import { getRecipes, getRecipeCategories } from '../../services/recipesService';
import { isSupabaseAvailable } from '../../lib/supabase';

const BASE_URL = typeof window !== 'undefined' ? window.location.origin : 'https://www.nuri.app.br';

export function RecipesListPage() {
  const [recipes, setRecipes] = useState([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [orderBy, setOrderBy] = useState('created_at');
  const [loading, setLoading] = useState(true);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const goHome = () => { window.location.href = '/'; };

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    const { recipes: list, total: count } = await getRecipes({
      search: debouncedSearch,
      category,
      orderBy,
      limit: 24,
      offset: 0,
    });
    setRecipes(list);
    setTotal(count ?? 0);
    setLoading(false);
  }, [debouncedSearch, category, orderBy]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!isSupabaseAvailable()) return;
    getRecipeCategories().then(setCategories);
  }, []);

  return (
    <SEOPage
      title="Receitas — Biblioteca de receitas para o cardápio semanal"
      description="Receitas práticas e saudáveis para montar seu cardápio semanal. Filtros por categoria, tempo e porções."
      keywords="receitas, cardápio semanal, receitas saudáveis, receitas família, NURI"
      url={`${BASE_URL}/receitas`}
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

        <main className="container mx-auto px-4 py-8 sm:py-12 max-w-5xl" id="main-content">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Biblioteca de receitas
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Receitas para inspirar seu cardápio semanal. Use os filtros e a busca para encontrar o que precisa.
          </p>

          {!isSupabaseAvailable() ? (
            <div className="rounded-2xl bg-amber-50 border border-amber-200 p-6 text-center">
              <p className="text-amber-800 font-medium">Biblioteca de receitas em breve</p>
              <p className="text-amber-700 text-sm mt-1">Configure o Supabase para ver as receitas aqui.</p>
              <a href="/" className="inline-flex items-center gap-2 mt-4 text-green-600 font-medium hover:underline">
                <BookOpen size={18} />
                Montar meu cardápio
              </a>
            </div>
          ) : (
            <>
              <RecipeFilters
                search={search}
                onSearchChange={setSearch}
                category={category}
                onCategoryChange={setCategory}
                categories={categories}
                orderBy={orderBy}
                onOrderByChange={setOrderBy}
              />

              {loading ? (
                <div className="py-12 flex justify-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-2 border-green-500 border-t-transparent" aria-hidden="true" />
                </div>
              ) : recipes.length === 0 ? (
                <div className="py-12 text-center text-gray-600">
                  <ChefHat className="mx-auto text-gray-300 mb-4" size={48} aria-hidden="true" />
                  <p className="font-medium">Nenhuma receita encontrada</p>
                  <p className="text-sm mt-1">Tente outros filtros ou busque por outro termo.</p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-500 mb-4">{total} receita{total !== 1 ? 's' : ''} encontrada{total !== 1 ? 's' : ''}</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" role="list">
                    {recipes.map((recipe) => (
                      <li key={recipe.id}>
                        <RecipeCard recipe={recipe} />
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </>
          )}

          <div className="mt-12 text-center">
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
            <a href="/como-funciona" className="hover:text-green-600 transition-colors">Como funciona</a>
            <a href="/para-quem-e" className="hover:text-green-600 transition-colors">Para quem é</a>
            <a href="/blog" className="hover:text-green-600 transition-colors">Blog</a>
          </div>
          <p className="text-center text-sm text-gray-500 mt-4">© 2026 NURI. Nutrição Inteligente.</p>
        </footer>
      </div>
    </SEOPage>
  );
}
