import { useState } from 'react';
import { generateWeeklyPriorities, generateInsights } from '../utils/menuLogic';
import { logger } from '../utils/logger';
import { errorHandler } from '../utils/errorHandler';
import { buildPrompt, calculateBMI } from '../utils/promptBuilder';

const REPEAT_STORAGE_KEY = 'nuri_repeat_meals';

/** Lê pratos "repetir" do localStorage para incluir no prompt da próxima geração */
function getRepeatMealsFromStorage() {
  try {
    const raw = localStorage.getItem(REPEAT_STORAGE_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list.map((r) => ({ text: r.text || '' })).filter((r) => r.text) : [];
  } catch {
    return [];
  }
}

/**
 * Hook para geração de cardápio com IA
 * 
 * @returns {Object} Objeto com:
 * @returns {Function} returns.generateMenu - Função assíncrona para gerar cardápio
 *   @param {Array} profiles - Array de perfis da família
 *   @param {Object} individualAnswers - Respostas individuais do questionário
 *   @param {Object} weeklyContext - Contexto semanal
 *   @returns {Promise<Object>} Dados do cardápio gerado
 * @returns {boolean} returns.loading - Estado de carregamento
 * @returns {string|null} returns.error - Mensagem de erro, se houver
 */
export const useMenuGeneration = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateMenu = async (profiles, individualAnswers, weeklyContext) => {
    setLoading(true);
    setError(null);

    try {
      const profilesWithAnswers = profiles.map(p => {
        const answers = individualAnswers[p.id] || {};
        const bmi = calculateBMI(p.weight, p.height);
        
        return {
          name: p.name,
          age: p.age,
          sex: p.sex,
          weight: p.weight,
          height: p.height,
          bmi: bmi,
          bodyType: p.bodyType,
          restrictions: p.restrictions,
          goals: p.goals,
          healthConditions: p.healthConditions,
          medications: p.medications,
          activityLevel: p.activityLevel,
          routine: p.routine,
          mealTimes: p.mealTimes,
          cookingSkill: p.cookingSkill,
          weeklyStatus: answers
        };
      });

      const priorities = generateWeeklyPriorities(profiles, individualAnswers, weeklyContext);
      const insights = generateInsights(profiles, individualAnswers);

      const repeatMeals = getRepeatMealsFromStorage();
      const prompt = buildPrompt(profilesWithAnswers, weeklyContext, priorities, insights, repeatMeals);

      // Em produção (Vercel), usa caminho relativo. Em dev, usa localhost
      const isProduction = import.meta.env.PROD;
      const apiUrl = isProduction ? '' : (import.meta.env.VITE_API_URL || 'http://localhost:3001');
      
      logger.log('📡 Enviando requisição para:', `${apiUrl}/api/generate-menu`);
      logger.log('📝 Prompt gerado (primeiros 500 chars):', prompt.substring(0, 500));
      logger.log('🌐 Ambiente:', isProduction ? 'Produção' : 'Desenvolvimento');
      
      const response = await fetch(`${apiUrl}/api/generate-menu`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt })
      });

      logger.log('📥 Resposta recebida, status:', response.status);

      if (!response.ok) {
        const handledError = await errorHandler.handleApiError(response, {
          context: 'useMenuGeneration',
          operation: 'generateMenu',
        });
        setError(handledError.message);
        throw handledError.originalError;
      }

      const menuJson = await response.json();
      logger.log('✅ JSON parseado com sucesso');
      
      return menuJson;
    } catch (err) {
      const handledError = errorHandler.handleError(err, {
        context: 'useMenuGeneration',
        operation: 'generateMenu',
      });
      setError(handledError.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { generateMenu, loading, error };
};
