import { useState, useEffect } from 'react';
import { getOrCreateFamily, getMenuHistory } from '../services/menuService';
import { isSupabaseAvailable } from '../lib/supabase';
import { logger } from '../utils/logger';

/**
 * Hook para inicialização da família e carregamento de dados
 * 
 * @param {boolean} isAuthenticated - Se o usuário está autenticado
 * @param {boolean} hasAcceptedTerms - Se aceitou os termos
 * @param {boolean} isGuest - Se está em modo guest
 * @param {string} userId - ID do usuário
 * @returns {Object} Objeto com familyId e menuHistory
 */
export const useAppInitialization = (isAuthenticated, hasAcceptedTerms, isGuest, userId) => {
  const [familyId, setFamilyId] = useState(null);
  const [menuHistory, setMenuHistory] = useState([]);

  useEffect(() => {
    const initFamily = async () => {
      // Só inicializa família para usuários autenticados (não guest)
      if (!isAuthenticated || !hasAcceptedTerms || isGuest) return;
      
      try {
        const family = await getOrCreateFamily('Minha Família', userId);
        setFamilyId(family.id);
        logger.log('👨‍👩‍👧‍👦 Família inicializada:', family.id);
        
        // Carregar histórico de cardápios
        if (isSupabaseAvailable()) {
          const history = await getMenuHistory(family.id);
          setMenuHistory(history);
          logger.log('📚 Histórico carregado:', history.length, 'cardápios');
        }
      } catch (error) {
        logger.error('Erro ao inicializar família:', error);
      }
    };
    initFamily();
  }, [isAuthenticated, hasAcceptedTerms, isGuest, userId]);

  return { familyId, menuHistory, setMenuHistory };
};
