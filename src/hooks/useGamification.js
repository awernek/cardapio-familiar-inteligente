import { useState, useEffect } from 'react';
import { getStorageItem, setStorageItem } from '../utils/storage';
import { logger } from '../utils/logger';

/**
 * Definição das conquistas disponíveis
 */
const ACHIEVEMENTS = {
  firstMenu: {
    id: 'firstMenu',
    icon: '🎉',
    title: 'Primeiro Passo',
    description: 'Gerou seu primeiro cardápio',
    condition: (stats) => stats.menusGenerated >= 1
  },
  threeWeeks: {
    id: 'threeWeeks',
    icon: '🔥',
    title: 'Constância',
    description: 'Usou o app por 3 semanas',
    condition: (stats) => stats.weeksUsed >= 3
  },
  familyComplete: {
    id: 'familyComplete',
    icon: '👨‍👩‍👧‍👦',
    title: 'Família Reunida',
    description: 'Cadastrou 3 ou mais pessoas',
    condition: (stats) => stats.maxProfiles >= 3
  },
  planFollower: {
    id: 'planFollower',
    icon: '✅',
    title: 'Comprometido',
    description: 'Seguiu o plano por 3 dias',
    condition: (stats) => stats.daysFollowed >= 3
  },
  shoppingPro: {
    id: 'shoppingPro',
    icon: '🛒',
    title: 'Compras Organizadas',
    description: 'Usou a lista de compras',
    condition: (stats) => stats.shoppingListUsed >= 1
  },
  fiveMenus: {
    id: 'fiveMenus',
    icon: '⭐',
    title: 'Chef da Família',
    description: 'Gerou 5 cardápios',
    condition: (stats) => stats.menusGenerated >= 5
  }
};

/**
 * Definição das missões semanais
 */
const WEEKLY_MISSIONS = [
  {
    id: 'generateMenu',
    icon: '📅',
    title: 'Gerar o cardápio da semana',
    description: 'Crie seu cardápio semanal personalizado',
    target: 1,
    statKey: 'menusThisWeek'
  },
  {
    id: 'followPlan',
    icon: '🎯',
    title: 'Seguir o plano por 3 dias',
    description: 'Marque os dias que seguiu o cardápio',
    target: 3,
    statKey: 'daysFollowedThisWeek'
  },
  {
    id: 'useShoppingList',
    icon: '🛒',
    title: 'Usar a lista de compras',
    description: 'Acesse a lista para fazer as compras',
    target: 1,
    statKey: 'shoppingListThisWeek'
  }
];

/**
 * Hook para gerenciar gamificação
 * 
 * @returns {Object} Objeto com:
 * @returns {Object} returns.stats - Estatísticas de gamificação
 * @returns {boolean} returns.loading - Estado de carregamento
 * @returns {Object|null} returns.newAchievement - Nova conquista desbloqueada
 * @returns {Function} returns.dismissAchievement - Função para descartar notificação
 * @returns {Function} returns.getMissions - Função que retorna array de missões
 * @returns {Function} returns.getAchievements - Função que retorna array de conquistas
 * @returns {Function} returns.getLevel - Função que retorna nível atual
 * @returns {Function} returns.trackMenuGenerated - Função para rastrear cardápio gerado
 * @returns {Function} returns.trackProfilesCount - Função para rastrear contagem de perfis
 * @returns {Function} returns.trackDayFollowed - Função para rastrear dia seguido
 * @returns {Function} returns.trackShoppingListUsed - Função para rastrear uso de lista
 */
export const useGamification = () => {
  const [stats, setStats] = useState({
    menusGenerated: 0,
    weeksUsed: 0,
    maxProfiles: 0,
    daysFollowed: 0,
    shoppingListUsed: 0,
    menusThisWeek: 0,
    daysFollowedThisWeek: 0,
    shoppingListThisWeek: 0,
    lastWeekReset: null,
    unlockedAchievements: []
  });
  
  const [newAchievement, setNewAchievement] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carregar stats ao montar
  useEffect(() => {
    loadStats();
  }, []);

  // Verificar conquistas quando stats mudam
  useEffect(() => {
    if (!loading) {
      checkAchievements();
    }
  }, [stats.menusGenerated, stats.weeksUsed, stats.maxProfiles, stats.daysFollowed, stats.shoppingListUsed]);

  const loadStats = async () => {
    try {
      const saved = await getStorageItem('gamification-stats');
      if (saved) {
        // Verificar se precisa resetar missões semanais
        const lastReset = saved.lastWeekReset ? new Date(saved.lastWeekReset) : null;
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        if (!lastReset || lastReset < weekAgo) {
          // Nova semana - resetar contadores semanais
          saved.menusThisWeek = 0;
          saved.daysFollowedThisWeek = 0;
          saved.shoppingListThisWeek = 0;
          saved.lastWeekReset = now.toISOString();
        }
        
        setStats(saved);
      }
    } catch (error) {
      logger.log('Erro ao carregar stats de gamificação:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveStats = async (newStats) => {
    try {
      await setStorageItem('gamification-stats', newStats);
      setStats(newStats);
    } catch (error) {
      logger.error('Erro ao salvar stats:', error);
    }
  };

  const checkAchievements = () => {
    const newUnlocked = [];
    
    Object.values(ACHIEVEMENTS).forEach(achievement => {
      const isUnlocked = stats.unlockedAchievements?.includes(achievement.id);
      const shouldUnlock = achievement.condition(stats);
      
      if (!isUnlocked && shouldUnlock) {
        newUnlocked.push(achievement.id);
        // Mostrar notificação da nova conquista
        setNewAchievement(achievement);
        setTimeout(() => setNewAchievement(null), 5000);
      }
    });
    
    if (newUnlocked.length > 0) {
      const updatedStats = {
        ...stats,
        unlockedAchievements: [...(stats.unlockedAchievements || []), ...newUnlocked]
      };
      saveStats(updatedStats);
    }
  };

  // Ações que incrementam stats
  const trackMenuGenerated = async () => {
    const newStats = {
      ...stats,
      menusGenerated: stats.menusGenerated + 1,
      menusThisWeek: stats.menusThisWeek + 1,
      weeksUsed: stats.weeksUsed + 1
    };
    await saveStats(newStats);
  };

  const trackProfilesCount = async (count) => {
    if (count > stats.maxProfiles) {
      const newStats = {
        ...stats,
        maxProfiles: count
      };
      await saveStats(newStats);
    }
  };

  const trackDayFollowed = async () => {
    const newStats = {
      ...stats,
      daysFollowed: stats.daysFollowed + 1,
      daysFollowedThisWeek: stats.daysFollowedThisWeek + 1
    };
    await saveStats(newStats);
  };

  const trackShoppingListUsed = async () => {
    const newStats = {
      ...stats,
      shoppingListUsed: stats.shoppingListUsed + 1,
      shoppingListThisWeek: stats.shoppingListThisWeek + 1
    };
    await saveStats(newStats);
  };

  // Calcular progresso das missões
  const getMissions = () => {
    return WEEKLY_MISSIONS.map(mission => ({
      ...mission,
      current: stats[mission.statKey] || 0,
      completed: (stats[mission.statKey] || 0) >= mission.target
    }));
  };

  // Obter conquistas com status
  const getAchievements = () => {
    return Object.values(ACHIEVEMENTS).map(achievement => ({
      ...achievement,
      unlocked: stats.unlockedAchievements?.includes(achievement.id) || false
    }));
  };

  // Calcular nível baseado em conquistas
  const getLevel = () => {
    const unlockedCount = stats.unlockedAchievements?.length || 0;
    if (unlockedCount >= 5) return { level: 3, title: 'Expert', icon: '👑' };
    if (unlockedCount >= 3) return { level: 2, title: 'Dedicado', icon: '⭐' };
    if (unlockedCount >= 1) return { level: 1, title: 'Iniciante', icon: '🌱' };
    return { level: 0, title: 'Novato', icon: '🥚' };
  };

  const dismissAchievement = () => {
    setNewAchievement(null);
  };

  return {
    stats,
    loading,
    newAchievement,
    dismissAchievement,
    getMissions,
    getAchievements,
    getLevel,
    trackMenuGenerated,
    trackProfilesCount,
    trackDayFollowed,
    trackShoppingListUsed
  };
};
