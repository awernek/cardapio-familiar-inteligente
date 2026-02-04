import { supabase, isSupabaseAvailable } from '../lib/supabase';
import { logger } from '../utils/logger';

/**
 * Serviço da biblioteca de receitas: listagem, detalhe, visualizações e salvar
 */

/**
 * Lista receitas com filtros opcionais
 * @param {Object} options
 * @param {string} options.search - Busca por título/descrição
 * @param {string} options.category - Filtrar por categoria
 * @param {string} options.orderBy - 'created_at' | 'view_count' | 'title'
 * @param {number} options.limit
 * @param {number} options.offset
 * @returns {Promise<Array>}
 */
export async function getRecipes({ search = '', category = '', orderBy = 'created_at', limit = 24, offset = 0 } = {}) {
  if (!isSupabaseAvailable()) {
    return [];
  }

  let query = supabase
    .from('public_recipes')
    .select('id, slug, title, description, image_url, prep_time_minutes, cook_time_minutes, servings, category, tags, view_count, created_at', { count: 'exact' });

  if (search && search.trim()) {
    const t = search.trim();
    query = query.or(`title.ilike.%${t}%,description.ilike.%${t}%`);
  }
  if (category && category.trim()) {
    query = query.eq('category', category.trim());
  }

  const orderColumn = orderBy === 'title' ? 'title' : orderBy === 'view_count' ? 'view_count' : 'created_at';
  const ascending = orderBy === 'title';
  query = query.order(orderColumn, { ascending, nullsFirst: false });

  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    logger.error('recipesService.getRecipes:', error);
    return [];
  }

  return { recipes: data || [], total: count ?? 0 };
}

/**
 * Busca uma receita por slug
 * @param {string} slug
 * @returns {Promise<Object|null>}
 */
export async function getRecipeBySlug(slug) {
  if (!isSupabaseAvailable() || !slug) return null;

  const { data, error } = await supabase
    .from('public_recipes')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    logger.error('recipesService.getRecipeBySlug:', error);
    return null;
  }

  return data;
}

/**
 * Incrementa o contador de visualizações (chama RPC)
 * @param {string} slug
 */
export async function incrementRecipeViews(slug) {
  if (!isSupabaseAvailable() || !slug) return;

  try {
    await supabase.rpc('increment_recipe_views', { recipe_slug: slug });
  } catch (e) {
    logger.warn('recipesService.incrementRecipeViews:', e?.message);
  }
}

/**
 * Lista IDs de receitas salvas pelo usuário
 * @param {string} userId
 * @returns {Promise<Set<string>>} Set de recipe_id (UUID string)
 */
export async function getSavedRecipeIds(userId) {
  if (!isSupabaseAvailable() || !userId) return new Set();

  const { data, error } = await supabase
    .from('saved_recipes')
    .select('recipe_id')
    .eq('user_id', userId);

  if (error) {
    logger.error('recipesService.getSavedRecipeIds:', error);
    return new Set();
  }

  return new Set((data || []).map((r) => r.recipe_id));
}

/**
 * Salva uma receita para o usuário (ou remove se já estiver salva)
 * @param {string} userId
 * @param {string} recipeId - UUID da receita
 * @returns {Promise<boolean>} true se passou a estar salva, false se removeu
 */
export async function toggleSaveRecipe(userId, recipeId) {
  if (!isSupabaseAvailable() || !userId || !recipeId) return false;

  const { data: existing } = await supabase
    .from('saved_recipes')
    .select('id')
    .eq('user_id', userId)
    .eq('recipe_id', recipeId)
    .maybeSingle();

  if (existing) {
    await supabase.from('saved_recipes').delete().eq('id', existing.id);
    return false;
  }

  const { error } = await supabase.from('saved_recipes').insert({
    user_id: userId,
    recipe_id: recipeId,
  });

  if (error) {
    logger.error('recipesService.toggleSaveRecipe:', error);
    return false;
  }

  return true;
}

/**
 * Lista categorias distintas para filtros
 * @returns {Promise<string[]>}
 */
export async function getRecipeCategories() {
  if (!isSupabaseAvailable()) return [];

  const { data, error } = await supabase
    .from('public_recipes')
    .select('category')
    .not('category', 'is', null);

  if (error) return [];

  const set = new Set((data || []).map((r) => r.category).filter(Boolean));
  return Array.from(set).sort();
}
