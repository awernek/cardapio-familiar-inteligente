import { useState, useEffect } from 'react';
import { listStorageKeys, getStorageItem, setStorageItem } from '../utils/storage';

/**
 * Hook para gerenciar histórico de semanas
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
      console.log('Sem histórico anterior ou erro ao carregar:', error);
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
      console.error('Erro ao salvar histórico:', error);
      throw error;
    }
  };

  return { weekHistory, loading, loadHistory, saveWeekToHistory };
};
