import { lazy, Suspense } from 'react';
import PropTypes from 'prop-types';
import { ProfilesStep } from './steps/ProfilesStep';
import { QuestionnaireStep } from './steps/QuestionnaireStep';
import { WeeklyContextStep } from './steps/WeeklyContextStep';
import { STEPS } from '../constants';
import { ProfileShape, IndividualAnswersShape, WeeklyContextShape, FamilyLocationShape, MenuDataShape, LastWeekComparisonShape, GamificationShape, WeekHistoryItemShape } from '../types';

// Lazy loading de componentes pesados
const ReportStep = lazy(() => import('./steps/ReportStep').then(module => ({ default: module.ReportStep })));
const MenuStep = lazy(() => import('./steps/MenuStep').then(module => ({ default: module.MenuStep })));
const ProgressStep = lazy(() => import('./steps/ProgressStep').then(module => ({ default: module.ProgressStep })));

// Componente de loading para lazy components
const LoadingFallback = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
  </div>
);

/**
 * Componente router que gerencia a renderização dos steps
 */
export const AppRouter = ({
  step,
  profiles,
  familyLocation,
  currentQuestionnaireIndex,
  individualAnswers,
  weeklyContext,
  menuData,
  expandedDay,
  showHistory,
  weekHistory,
  lastWeekComparison,
  gamification,
  // Handlers de perfis
  onUpdateLocation,
  onAddProfile,
  onUpdateProfile,
  onRemoveProfile,
  onToggleAdvanced,
  onContinueFromProfiles,
  // Handlers de questionário
  onSaveAnswers,
  onNextQuestionnaire,
  onPrevQuestionnaire,
  // Handlers de contexto
  onUpdateContext,
  onGenerateMenu,
  onViewReport,
  onBackFromWeeklyContext,
  // Handlers de menu
  onToggleDay,
  onReset,
  onViewProgress,
  onShoppingListUsed,
  // Handlers de relatório
  onToggleHistory,
  onBackFromReport,
  onContinueFromReport,
  // Handlers de progresso
  onBackFromProgress,
}) => {
  switch (step) {
    case STEPS.PROFILES:
      return (
        <ProfilesStep
          profiles={profiles}
          familyLocation={familyLocation}
          onUpdateLocation={onUpdateLocation}
          onAddProfile={onAddProfile}
          onUpdateProfile={onUpdateProfile}
          onRemoveProfile={onRemoveProfile}
          onToggleAdvanced={onToggleAdvanced}
          onContinue={onContinueFromProfiles}
        />
      );

    case STEPS.QUESTIONNAIRE:
      return (
        <QuestionnaireStep
          profiles={profiles}
          currentIndex={currentQuestionnaireIndex}
          individualAnswers={individualAnswers}
          onSaveAnswers={onSaveAnswers}
          onNext={onNextQuestionnaire}
          onPrev={onPrevQuestionnaire}
        />
      );

    case STEPS.WEEKLY_CONTEXT:
      return (
        <WeeklyContextStep
          profiles={profiles}
          individualAnswers={individualAnswers}
          weeklyContext={weeklyContext}
          familyLocation={familyLocation}
          onUpdateContext={onUpdateContext}
          onGenerateMenu={onGenerateMenu}
          onBack={onBackFromWeeklyContext}
          onViewReport={onViewReport}
        />
      );

    case STEPS.REPORT:
      return (
        <Suspense fallback={<LoadingFallback />}>
          <ReportStep
            profiles={profiles}
            individualAnswers={individualAnswers}
            weeklyContext={weeklyContext}
            weekHistory={weekHistory}
            showHistory={showHistory}
            onToggleHistory={onToggleHistory}
            onBack={onBackFromReport}
            onContinue={onContinueFromReport}
          />
        </Suspense>
      );

    case STEPS.MENU:
      if (!menuData) return null;
      return (
        <Suspense fallback={<LoadingFallback />}>
          <MenuStep
            menuData={menuData}
            profiles={profiles}
            individualAnswers={individualAnswers}
            weeklyContext={weeklyContext}
            lastWeekComparison={lastWeekComparison}
            expandedDay={expandedDay}
            onToggleDay={onToggleDay}
            onReset={onReset}
            onViewProgress={onViewProgress}
            onShoppingListUsed={onShoppingListUsed}
            gamification={gamification}
          />
        </Suspense>
      );

    case STEPS.PROGRESS:
      return (
        <Suspense fallback={<LoadingFallback />}>
          <ProgressStep
            profiles={profiles}
            individualAnswers={individualAnswers}
            weekHistory={weekHistory}
            onBack={onBackFromProgress}
          />
        </Suspense>
      );

    default:
      return null;
  }
};

AppRouter.propTypes = {
  step: PropTypes.string.isRequired,
  profiles: PropTypes.arrayOf(ProfileShape).isRequired,
  familyLocation: FamilyLocationShape.isRequired,
  currentQuestionnaireIndex: PropTypes.number.isRequired,
  individualAnswers: IndividualAnswersShape.isRequired,
  weeklyContext: WeeklyContextShape.isRequired,
  menuData: MenuDataShape,
  expandedDay: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  showHistory: PropTypes.bool.isRequired,
  weekHistory: PropTypes.arrayOf(WeekHistoryItemShape).isRequired,
  lastWeekComparison: LastWeekComparisonShape,
  gamification: GamificationShape.isRequired,
  onUpdateLocation: PropTypes.func.isRequired,
  onAddProfile: PropTypes.func.isRequired,
  onUpdateProfile: PropTypes.func.isRequired,
  onRemoveProfile: PropTypes.func.isRequired,
  onToggleAdvanced: PropTypes.func.isRequired,
  onContinueFromProfiles: PropTypes.func.isRequired,
  onSaveAnswers: PropTypes.func.isRequired,
  onNextQuestionnaire: PropTypes.func.isRequired,
  onPrevQuestionnaire: PropTypes.func.isRequired,
  onUpdateContext: PropTypes.func.isRequired,
  onGenerateMenu: PropTypes.func.isRequired,
  onViewReport: PropTypes.func.isRequired,
  onBackFromWeeklyContext: PropTypes.func.isRequired,
  onToggleDay: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  onViewProgress: PropTypes.func.isRequired,
  onShoppingListUsed: PropTypes.func.isRequired,
  onToggleHistory: PropTypes.func.isRequired,
  onBackFromReport: PropTypes.func.isRequired,
  onContinueFromReport: PropTypes.func.isRequired,
  onBackFromProgress: PropTypes.func.isRequired,
};
