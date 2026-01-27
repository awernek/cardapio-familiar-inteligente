import { supabase, isSupabaseAvailable } from '../lib/supabase';
import { getStorageItem, setStorageItem, listStorageKeys } from '../utils/storage';
import { logger } from '../utils/logger';

/**
 * Serviço para gerenciar cardápios e histórico
 * Usa Supabase se disponível, senão localStorage
 */

// =============================================
// FAMÍLIA
// =============================================

/**
 * Obtém ou cria uma família (vinculada ao usuário autenticado)
 */
export const getOrCreateFamily = async (familyName = 'Minha Família', userId = null) => {
  if (!isSupabaseAvailable()) {
    // Fallback: usar localStorage
    let familyId = localStorage.getItem('family_id');
    if (!familyId) {
      familyId = `local_${Date.now()}`;
      localStorage.setItem('family_id', familyId);
    }
    return { id: familyId, name: familyName };
  }

  // Se temos userId, buscar família do usuário
  if (userId) {
    const { data: existingFamily } = await supabase
      .from('families')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (existingFamily) {
      localStorage.setItem('family_id', existingFamily.id);
      return existingFamily;
    }

    // Criar nova família para o usuário
    const { data, error } = await supabase
      .from('families')
      .insert([{ name: familyName, user_id: userId }])
      .select()
      .single();

    if (error) {
      logger.error('Erro ao criar família:', error);
      throw error;
    }

    localStorage.setItem('family_id', data.id);
    return data;
  }

  // Fallback para compatibilidade (sem userId)
  let familyId = localStorage.getItem('family_id');
  
  if (familyId && !familyId.startsWith('local_')) {
    const { data, error } = await supabase
      .from('families')
      .select('*')
      .eq('id', familyId)
      .single();
    
    if (data && !error) {
      return data;
    }
  }

  // Criar nova família (sem user_id - modo legado)
  const { data, error } = await supabase
    .from('families')
    .insert([{ name: familyName }])
    .select()
    .single();

  if (error) {
    logger.error('Erro ao criar família:', error);
    throw error;
  }

  localStorage.setItem('family_id', data.id);
  return data;
};

// =============================================
// CARDÁPIOS
// =============================================

/**
 * Salva um cardápio gerado
 */
export const saveMenu = async (familyId, menuData, weeklyContext, profiles) => {
  const weekStart = getWeekStart();

  if (!isSupabaseAvailable()) {
    // Fallback: localStorage
    const menuKey = `menu:${familyId}:${weekStart}`;
    const menuRecord = {
      id: `local_${Date.now()}`,
      family_id: familyId,
      week_start: weekStart,
      menu_data: menuData,
      weekly_tips: menuData.weeklyTips,
      profiles_snapshot: profiles.map(p => ({ name: p.name, age: p.age })),
      created_at: new Date().toISOString()
    };
    await setStorageItem(menuKey, menuRecord);
    return menuRecord;
  }

  // Supabase
  const { data, error } = await supabase
    .from('menus')
    .insert([{
      family_id: familyId,
      week_start: weekStart,
      menu_data: menuData,
      weekly_tips: menuData.weeklyTips
    }])
    .select()
    .single();

  if (error) {
    logger.error('Erro ao salvar cardápio:', error);
    throw error;
  }

  return data;
};

/**
 * Obtém histórico de cardápios
 */
export const getMenuHistory = async (familyId, limit = 10) => {
  if (!isSupabaseAvailable()) {
    // Fallback: localStorage
    const keys = await listStorageKeys(`menu:${familyId}:`);
    const menus = [];
    
    for (const key of keys.slice(-limit)) {
      const menu = await getStorageItem(key);
      if (menu) menus.push(menu);
    }
    
    return menus.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  // Supabase
  const { data, error } = await supabase
    .from('menus')
    .select('*')
    .eq('family_id', familyId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    logger.error('Erro ao buscar histórico:', error);
    return [];
  }

  return data || [];
};

/**
 * Obtém um cardápio específico
 */
export const getMenu = async (menuId) => {
  if (!isSupabaseAvailable()) {
    // Para localStorage, precisaria buscar de forma diferente
    return null;
  }

  const { data, error } = await supabase
    .from('menus')
    .select('*')
    .eq('id', menuId)
    .single();

  if (error) {
    logger.error('Erro ao buscar cardápio:', error);
    return null;
  }

  return data;
};

// =============================================
// PERFIS
// =============================================

/**
 * Salva perfis da família
 */
export const saveProfiles = async (familyId, profiles) => {
  if (!isSupabaseAvailable()) {
    // Fallback: localStorage
    await setStorageItem(`profiles:${familyId}`, profiles);
    return profiles;
  }

  // Primeiro, remover perfis antigos
  await supabase
    .from('profiles')
    .delete()
    .eq('family_id', familyId);

  // Inserir novos perfis
  const profilesData = profiles.map(p => ({
    family_id: familyId,
    name: p.name,
    age: p.age,
    sex: p.sex,
    weight: p.weight,
    height: p.height,
    body_type: p.bodyType,
    restrictions: p.restrictions,
    goals: p.goals,
    health_conditions: p.healthConditions,
    medications: p.medications,
    activity_level: p.activityLevel,
    meal_times: p.mealTimes,
    cooking_skill: p.cookingSkill,
    routine: p.routine
  }));

  const { data, error } = await supabase
    .from('profiles')
    .insert(profilesData)
    .select();

  if (error) {
    logger.error('Erro ao salvar perfis:', error);
    throw error;
  }

  return data;
};

/**
 * Obtém perfis da família
 */
export const getProfiles = async (familyId) => {
  if (!isSupabaseAvailable()) {
    return await getStorageItem(`profiles:${familyId}`) || [];
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('family_id', familyId);

  if (error) {
    logger.error('Erro ao buscar perfis:', error);
    return [];
  }

  // Converter snake_case para camelCase
  return (data || []).map(p => ({
    id: p.id,
    name: p.name,
    age: p.age,
    sex: p.sex,
    weight: p.weight,
    height: p.height,
    bodyType: p.body_type,
    restrictions: p.restrictions,
    goals: p.goals,
    healthConditions: p.health_conditions,
    medications: p.medications,
    activityLevel: p.activity_level,
    mealTimes: p.meal_times,
    cookingSkill: p.cooking_skill,
    routine: p.routine
  }));
};

// =============================================
// UTILITÁRIOS
// =============================================

/**
 * Obtém a data de início da semana atual (segunda-feira)
 */
const getWeekStart = () => {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  return monday.toISOString().split('T')[0];
};
