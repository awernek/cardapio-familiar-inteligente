import { useState, useCallback } from 'react';

/**
 * Hook para gerenciar perfis da família
 * 
 * @returns {Object} Objeto com estado e funções para gerenciar perfis
 */
export const useProfiles = () => {
  const [profiles, setProfiles] = useState([]);

  /**
   * Adiciona um novo perfil vazio
   */
  const addProfile = useCallback(() => {
    setProfiles(prev => [...prev, {
      id: Date.now(),
      name: '',
      age: '',
      sex: '',
      weight: '',
      height: '',
      bodyType: '',
      restrictions: '',
      goals: '',
      showAdvanced: false,
      healthConditions: '',
      medications: '',
      activityLevel: '',
      mealTimes: '',
      cookingSkill: '',
      routine: ''
    }]);
  }, []);

  /**
   * Atualiza um campo específico de um perfil
   */
  const updateProfile = useCallback((id, field, value) => {
    setProfiles(prev => prev.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  }, []);

  /**
   * Remove um perfil
   */
  const removeProfile = useCallback((id) => {
    setProfiles(prev => prev.filter(p => p.id !== id));
  }, []);

  /**
   * Toggle detalhes avançados de um perfil
   */
  const toggleAdvanced = useCallback((id) => {
    setProfiles(prev => prev.map(p => 
      p.id === id ? { ...p, showAdvanced: !p.showAdvanced } : p
    ));
  }, []);

  /**
   * Reseta todos os perfis
   */
  const resetProfiles = useCallback(() => {
    setProfiles([]);
  }, []);

  return {
    profiles,
    setProfiles,
    addProfile,
    updateProfile,
    removeProfile,
    toggleAdvanced,
    resetProfiles,
  };
};
