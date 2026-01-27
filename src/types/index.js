/**
 * Definições de tipos e estruturas de dados
 * Documentação das estruturas usadas no projeto
 */

import PropTypes from 'prop-types';

/**
 * Estrutura de um perfil de pessoa
 */
export const ProfileShape = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  name: PropTypes.string.isRequired,
  age: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  sex: PropTypes.string,
  weight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  bodyType: PropTypes.string,
  restrictions: PropTypes.string,
  goals: PropTypes.string,
  showAdvanced: PropTypes.bool,
  healthConditions: PropTypes.string,
  medications: PropTypes.string,
  activityLevel: PropTypes.string,
  mealTimes: PropTypes.string,
  cookingSkill: PropTypes.string,
  routine: PropTypes.string,
});

/**
 * Estrutura de respostas individuais do questionário
 */
export const IndividualAnswersShape = PropTypes.objectOf(
  PropTypes.shape({
    stress: PropTypes.string,
    stressTime: PropTypes.string,
    sleep: PropTypes.string,
    sleepHours: PropTypes.string,
    sleepProblem: PropTypes.string,
    energy: PropTypes.string,
    appetite: PropTypes.string,
    appetiteTime: PropTypes.string,
    symptoms: PropTypes.string,
    preferences: PropTypes.string,
    followedPlan: PropTypes.string,
    notFollowedReason: PropTypes.string,
  })
);

/**
 * Estrutura do contexto semanal
 */
export const WeeklyContextShape = PropTypes.shape({
  busy: PropTypes.string,
  budget: PropTypes.string,
  cookingTime: PropTypes.string,
  groceryTrips: PropTypes.string,
  cookingReality: PropTypes.string,
  location: PropTypes.shape({
    state: PropTypes.string,
    city: PropTypes.string,
  }),
});

/**
 * Estrutura de localização da família
 */
export const FamilyLocationShape = PropTypes.shape({
  state: PropTypes.string,
  city: PropTypes.string,
});

/**
 * Estrutura de um dia do cardápio
 */
export const MenuDayShape = PropTypes.shape({
  day: PropTypes.string.isRequired,
  breakfast: PropTypes.shape({
    base: PropTypes.string.isRequired,
    adaptations: PropTypes.object,
  }).isRequired,
  lunch: PropTypes.shape({
    base: PropTypes.string.isRequired,
    adaptations: PropTypes.object,
  }).isRequired,
  dinner: PropTypes.shape({
    base: PropTypes.string.isRequired,
    adaptations: PropTypes.object,
  }).isRequired,
  individualSnacks: PropTypes.object,
  dayTip: PropTypes.string,
});

/**
 * Estrutura completa do cardápio
 */
export const MenuDataShape = PropTypes.shape({
  days: PropTypes.arrayOf(MenuDayShape).isRequired,
  shoppingList: PropTypes.shape({
    frutas_vegetais: PropTypes.arrayOf(PropTypes.string),
    proteinas: PropTypes.arrayOf(PropTypes.string),
    graos_cereais: PropTypes.arrayOf(PropTypes.string),
    laticinios: PropTypes.arrayOf(PropTypes.string),
    temperos_outros: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  weeklyTips: PropTypes.string,
  individualNotes: PropTypes.object,
  costEstimate: PropTypes.shape({
    min: PropTypes.number,
    max: PropTypes.number,
    currency: PropTypes.string,
    disclaimer: PropTypes.string,
    tips: PropTypes.string,
  }),
});

/**
 * Estrutura de uma conquista
 */
export const AchievementShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  unlocked: PropTypes.bool,
});

/**
 * Estrutura de uma missão
 */
export const MissionShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  target: PropTypes.number.isRequired,
  current: PropTypes.number,
  completed: PropTypes.bool,
});

/**
 * Estrutura de nível de gamificação
 */
export const LevelShape = PropTypes.shape({
  level: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
});

/**
 * Estrutura de dados de gamificação
 */
export const GamificationShape = PropTypes.shape({
  missions: PropTypes.arrayOf(MissionShape),
  achievements: PropTypes.arrayOf(AchievementShape),
  level: LevelShape,
});

/**
 * Estrutura de comparação com semana anterior
 */
export const LastWeekComparisonShape = PropTypes.arrayOf(
  PropTypes.shape({
    name: PropTypes.string.isRequired,
    changes: PropTypes.arrayOf(PropTypes.string).isRequired,
  })
);

/**
 * Estrutura de histórico de semana
 */
export const WeekHistoryItemShape = PropTypes.shape({
  date: PropTypes.string.isRequired,
  dateLabel: PropTypes.string.isRequired,
  profiles: PropTypes.arrayOf(PropTypes.object),
  weeklyContext: WeeklyContextShape,
  priorities: PropTypes.arrayOf(PropTypes.string),
  insights: PropTypes.arrayOf(PropTypes.object),
});

/**
 * Estrutura de dados do usuário
 */
export const UserShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  email: PropTypes.string,
  user_metadata: PropTypes.object,
});

/**
 * Exporta todas as shapes para uso em PropTypes
 */
export default {
  ProfileShape,
  IndividualAnswersShape,
  WeeklyContextShape,
  FamilyLocationShape,
  MenuDayShape,
  MenuDataShape,
  AchievementShape,
  MissionShape,
  LevelShape,
  GamificationShape,
  LastWeekComparisonShape,
  WeekHistoryItemShape,
  UserShape,
};
