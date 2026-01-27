/**
 * Constantes dos steps do fluxo da aplicação
 */

export const STEPS = {
  PROFILES: 'profiles',
  QUESTIONNAIRE: 'questionnaire',
  WEEKLY_CONTEXT: 'weekly-context',
  REPORT: 'report',
  MENU: 'menu',
  PROGRESS: 'progress',
};

/**
 * Array com todos os steps na ordem do fluxo
 */
export const STEPS_ORDER = [
  STEPS.PROFILES,
  STEPS.QUESTIONNAIRE,
  STEPS.WEEKLY_CONTEXT,
  STEPS.REPORT,
  STEPS.MENU,
  STEPS.PROGRESS,
];

/**
 * Verifica se um step é válido
 * @param {string} step - Step a verificar
 * @returns {boolean}
 */
export const isValidStep = (step) => {
  return Object.values(STEPS).includes(step);
};

/**
 * Obtém o próximo step no fluxo
 * @param {string} currentStep - Step atual
 * @returns {string|null} Próximo step ou null se for o último
 */
export const getNextStep = (currentStep) => {
  const currentIndex = STEPS_ORDER.indexOf(currentStep);
  if (currentIndex === -1 || currentIndex === STEPS_ORDER.length - 1) {
    return null;
  }
  return STEPS_ORDER[currentIndex + 1];
};

/**
 * Obtém o step anterior no fluxo
 * @param {string} currentStep - Step atual
 * @returns {string|null} Step anterior ou null se for o primeiro
 */
export const getPreviousStep = (currentStep) => {
  const currentIndex = STEPS_ORDER.indexOf(currentStep);
  if (currentIndex <= 0) {
    return null;
  }
  return STEPS_ORDER[currentIndex - 1];
};
