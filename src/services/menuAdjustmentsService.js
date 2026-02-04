import { buildReplaceMealPrompt, buildSuggestVariationsPrompt } from '../utils/promptBuilder';
import { logger } from '../utils/logger';
import { errorHandler } from '../utils/errorHandler';

function getApiUrl() {
  const isProduction = import.meta.env.PROD;
  return isProduction ? '' : (import.meta.env.VITE_API_URL || 'http://localhost:3001');
}

/**
 * Substitui uma refeição por uma nova sugestão da IA
 * @param {Object} menuData - Cardápio atual
 * @param {number} dayIndex - Índice do dia (0-6)
 * @param {string} mealType - 'breakfast' | 'lunch' | 'dinner'
 * @param {Array} profiles - Perfis da família
 * @param {Object} weeklyContext - Contexto semanal
 * @returns {Promise<{ base: string, adaptations: Object }>}
 */
export async function replaceMeal(menuData, dayIndex, mealType, profiles, weeklyContext) {
  const prompt = buildReplaceMealPrompt(menuData, dayIndex, mealType, profiles, weeklyContext);
  const apiUrl = getApiUrl();

  const response = await fetch(`${apiUrl}/api/generate-menu`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    const handled = await errorHandler.handleApiError(response, {
      context: 'menuAdjustmentsService',
      operation: 'replaceMeal',
    });
    throw handled.originalError;
  }

  const data = await response.json();
  if (data.base === undefined) {
    logger.warn('Resposta de troca sem campo base:', data);
    throw new Error('Resposta inválida da IA. Tente novamente.');
  }
  return {
    base: data.base || '',
    adaptations: data.adaptations && typeof data.adaptations === 'object' ? data.adaptations : {},
  };
}

/**
 * Sugere 2–3 variações para uma refeição
 * @param {string} mealText - Texto do prato atual
 * @param {string} mealType - 'breakfast' | 'lunch' | 'dinner'
 * @param {Array} profiles - Perfis da família
 * @param {Object} weeklyContext - Contexto semanal
 * @returns {Promise<{ variations: Array<{ base: string, adaptations: Object }> }>}
 */
export async function suggestVariations(mealText, mealType, profiles, weeklyContext) {
  const prompt = buildSuggestVariationsPrompt(mealText, mealType, profiles, weeklyContext);
  const apiUrl = getApiUrl();

  const response = await fetch(`${apiUrl}/api/generate-menu`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    const handled = await errorHandler.handleApiError(response, {
      context: 'menuAdjustmentsService',
      operation: 'suggestVariations',
    });
    throw handled.originalError;
  }

  const data = await response.json();
  const list = Array.isArray(data.variations) ? data.variations : [];
  const variations = list.map((v) => ({
    base: typeof v.base === 'string' ? v.base : '',
    adaptations: v.adaptations && typeof v.adaptations === 'object' ? v.adaptations : {},
  }));
  return { variations };
}
