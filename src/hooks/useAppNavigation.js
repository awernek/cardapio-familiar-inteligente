import { useState, useCallback } from 'react';
import { STEPS } from '../constants';

/**
 * Hook para gerenciar navegação entre steps do app
 * 
 * @returns {Object} Objeto com estado e funções de navegação
 */
export const useAppNavigation = () => {
  const [step, setStep] = useState(STEPS.PROFILES);
  const [currentQuestionnaireIndex, setCurrentQuestionnaireIndex] = useState(0);

  /**
   * Navega para um step específico
   */
  const navigateToStep = useCallback((targetStep) => {
    setStep(targetStep);
  }, []);

  /**
   * Avança para o próximo step
   */
  const nextStep = useCallback((profiles) => {
    if (step === STEPS.PROFILES) {
      setStep(STEPS.QUESTIONNAIRE);
      setCurrentQuestionnaireIndex(0);
    } else if (step === STEPS.QUESTIONNAIRE) {
      if (currentQuestionnaireIndex < profiles.length - 1) {
        setCurrentQuestionnaireIndex(currentQuestionnaireIndex + 1);
      } else {
        setStep(STEPS.WEEKLY_CONTEXT);
      }
    }
  }, [step, currentQuestionnaireIndex]);

  /**
   * Volta para o step anterior
   */
  const prevStep = useCallback((profiles) => {
    if (step === STEPS.QUESTIONNAIRE) {
      if (currentQuestionnaireIndex > 0) {
        setCurrentQuestionnaireIndex(currentQuestionnaireIndex - 1);
      } else {
        setStep(STEPS.PROFILES);
      }
    } else if (step === STEPS.WEEKLY_CONTEXT) {
      setStep(STEPS.QUESTIONNAIRE);
      setCurrentQuestionnaireIndex(profiles.length - 1);
    } else if (step === STEPS.REPORT) {
      setStep(STEPS.WEEKLY_CONTEXT);
    } else if (step === STEPS.MENU) {
      setStep(STEPS.WEEKLY_CONTEXT);
    } else if (step === STEPS.PROGRESS) {
      setStep(STEPS.MENU);
    }
  }, [step, currentQuestionnaireIndex]);

  /**
   * Reseta a navegação para o início
   */
  const resetNavigation = useCallback(() => {
    setStep(STEPS.PROFILES);
    setCurrentQuestionnaireIndex(0);
  }, []);

  return {
    step,
    currentQuestionnaireIndex,
    setStep,
    setCurrentQuestionnaireIndex,
    navigateToStep,
    nextStep,
    prevStep,
    resetNavigation,
  };
};
