import { useState, useEffect } from 'react';
import { listStorageKeys, getStorageItem, setStorageItem } from '../utils/storage';
import { logger } from '../utils/logger';

/**
 * Hook para gerenciar histórico de semanas
 * 
 * @returns {Object} Objeto com:
 * @returns {Array} returns.weekHistory - Array de objetos com histórico de semanas
 * @returns {boolean} returns.loading - Estado de carregamento
 * @returns {Function} returns.loadHistory - Função para recarregar histórico
 * @returns {Function} returns.saveWeekToHistory - Função para salvar semana no histórico
 *   @param {Array} profiles - Array de perfis
 *   @param {Object} individualAnswers - Respostas individuais
 *   @param {Object} weeklyContext - Contexto semanal
 *   @param {Function} generateWeeklyPriorities - Função para gerar prioridades
 *   @param {Function} generateInsights - Função para gerar insights
 */
export const useHistory = () => {
  const [weekHistory, setWeekHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carregar histórico ao montar
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const keys = await listStorageKeys('week-history:');
      if (keys && keys.length > 0) {
        const history = [];
        // Últimas 4 semanas
        for (const key of keys.slice(-4)) {
          const data = await getStorageItem(key);
          if (data) {
            history.push(data);
          }
        }
        setWeekHistory(history.sort((a, b) => new Date(b.date) - new Date(a.date)));
      }
    } catch (error) {
      logger.log('Sem histórico anterior ou erro ao carregar:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveWeekToHistory = async (profiles, individualAnswers, weeklyContext, generateWeeklyPriorities, generateInsights) => {
    const weekData = {
      date: new Date().toISOString(),
      dateLabel: new Date().toLocaleDateString('pt-BR'),
      profiles: profiles.map(p => ({
        name: p.name,
        age: p.age,
        weight: p.weight,
        answers: individualAnswers[p.id]
      })),
      weeklyContext,
      priorities: generateWeeklyPriorities(profiles, individualAnswers, weeklyContext),
      insights: generateInsights(profiles, individualAnswers)
    };

    try {
      const weekKey = `week-history:${Date.now()}`;
      await setStorageItem(weekKey, weekData);
      await loadHistory();
    } catch (error) {
      logger.error('Erro ao salvar histórico:', error);
      throw error;
    }
  };

  return { weekHistory, loading, loadHistory, saveWeekToHistory };
};
