import { useState, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { AuthForm } from './components/auth/AuthForm';
import { ConsentScreen } from './components/auth/ConsentScreen';
import { LandingPage } from './components/LandingPage';
import { AppRouter } from './components/AppRouter';
import { ErrorBoundary } from './components/ErrorBoundary';
import { HistoryPage } from './components/HistoryPage';
import { AccountPage } from './components/AccountPage';
import { useHistory } from './hooks/useHistory';
import { useAuth } from './contexts/AuthContext';
import { useGamification } from './hooks/useGamification';
import { useAppNavigation } from './hooks/useAppNavigation';
import { useAppInitialization } from './hooks/useAppInitialization';
import { useProfiles } from './hooks/useProfiles';
import { AchievementToast } from './components/gamification/AchievementToast';
import { generateWeeklyPriorities, generateInsights, compareWithLastWeek } from './utils/menuLogic';
import { saveMenu, deleteMenu } from './services/menuService';
import { logger } from './utils/logger';
import { errorHandler } from './utils/errorHandler';
import { STEPS } from './constants';

function App() {
  const { user, loading: authLoading, hasAcceptedTerms, isAuthenticated, isGuest, startGuestMode, exitGuestMode } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [currentPage, setCurrentPage] = useState('app'); // 'app' | 'history' | 'account'
  
  // Hooks customizados - TODOS devem estar no topo, antes de qualquer return condicional
  const navigation = useAppNavigation();
  const { profiles, addProfile, updateProfile, removeProfile, toggleAdvanced, resetProfiles } = useProfiles();
  const [familyLocation, setFamilyLocation] = useState({ state: '', city: '' });
  const [individualAnswers, setIndividualAnswers] = useState({});
  const [weeklyContext, setWeeklyContext] = useState({});
  const [menuData, setMenuData] = useState(null);
  const [expandedDay, setExpandedDay] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  
  const { weekHistory, saveWeekToHistory } = useHistory();
  const { familyId, menuHistory, setMenuHistory } = useAppInitialization(
    isAuthenticated,
    hasAcceptedTerms,
    isGuest,
    user?.id
  );
  
  const { 
    newAchievement, 
    dismissAchievement, 
    getMissions, 
    getAchievements, 
    getLevel,
    trackMenuGenerated,
    trackProfilesCount,
    trackShoppingListUsed
  } = useGamification();

  // Cálculos pesados memoizados - devem estar antes dos returns condicionais
  const priorities = useMemo(() => {
    if (!profiles.length || !Object.keys(individualAnswers).length || !Object.keys(weeklyContext).length) {
      return [];
    }
    return generateWeeklyPriorities(profiles, individualAnswers, weeklyContext);
  }, [profiles, individualAnswers, weeklyContext]);

  const insights = useMemo(() => {
    if (!profiles.length || !Object.keys(individualAnswers).length) {
      return [];
    }
    return generateInsights(profiles, individualAnswers);
  }, [profiles, individualAnswers]);

  // Comparar com semana anterior (memoizado)
  const lastWeekComparison = useMemo(() => {
    if (weekHistory.length === 0) return null;
    return compareWithLastWeek(profiles, individualAnswers, weekHistory[0]);
  }, [profiles, individualAnswers, weekHistory]);

  // Dados de gamificação (memoizado)
  const gamificationData = useMemo(() => ({
    missions: getMissions(),
    achievements: getAchievements(),
    level: getLevel()
  }), [getMissions, getAchievements, getLevel]);

  // Salvar respostas individuais (memoizado)
  const saveIndividualAnswers = useCallback((profileId, answers) => {
    setIndividualAnswers(prev => ({
      ...prev,
      [profileId]: answers
    }));
  }, []);

  // Handlers de navegação (memoizados)
  const nextQuestionnaire = useCallback(() => {
    if (navigation.currentQuestionnaireIndex < profiles.length - 1) {
      navigation.setCurrentQuestionnaireIndex(navigation.currentQuestionnaireIndex + 1);
    } else {
      navigation.navigateToStep(STEPS.WEEKLY_CONTEXT);
    }
  }, [navigation, profiles.length]);

  const prevQuestionnaire = useCallback(() => {
    if (navigation.currentQuestionnaireIndex > 0) {
      navigation.setCurrentQuestionnaireIndex(navigation.currentQuestionnaireIndex - 1);
    } else {
      navigation.navigateToStep(STEPS.PROFILES);
    }
  }, [navigation]);

  // Gerar cardápio (memoizado)
  const handleGenerateMenu = useCallback(async (menuData) => {
    // Salva semana no histórico antes de gerar cardápio
    await saveWeekToHistory(
      profiles,
      individualAnswers,
      weeklyContext,
      () => priorities,
      () => insights
    );
    
    // Salvar cardápio no Supabase
    if (familyId) {
      try {
        const savedMenu = await saveMenu(familyId, menuData, weeklyContext, profiles);
        logger.log('💾 Cardápio salvo:', savedMenu.id);
        
        // Atualizar histórico local
        setMenuHistory(prev => [savedMenu, ...prev]);
      } catch (error) {
        errorHandler.handleError(error, {
          context: 'App',
          operation: 'saveMenu',
        });
        // Continua mesmo se falhar o salvamento
      }
    }
    
    // Tracking de gamificação
    await trackMenuGenerated();
    await trackProfilesCount(profiles.length);
    
    setMenuData(menuData);
    navigation.navigateToStep(STEPS.MENU);
  }, [profiles, individualAnswers, weeklyContext, familyId, priorities, insights, saveWeekToHistory, setMenuHistory, trackMenuGenerated, trackProfilesCount, navigation]);

  // Resetar tudo (memoizado)
  const resetApp = useCallback(() => {
    navigation.resetNavigation();
    resetProfiles();
    setMenuData(null);
    setIndividualAnswers({});
    setWeeklyContext({});
    setExpandedDay(null);
  }, [navigation, resetProfiles]);

  // Handlers inline memoizados - devem estar no topo também
  const handleUpdateLocation = useCallback(setFamilyLocation, []);
  const handleUpdateContext = useCallback(setWeeklyContext, []);
  const handleToggleDay = useCallback(setExpandedDay, []);
  const handleToggleHistory = useCallback(() => setShowHistory(prev => !prev), []);
  
  // Função para ir do ProfilesStep para QuestionnaireStep (sempre começa no índice 0)
  const handleContinueFromProfiles = useCallback(() => {
    // Define o índice como 0 e navega para QUESTIONNAIRE
    navigation.setCurrentQuestionnaireIndex(0);
    navigation.navigateToStep(STEPS.QUESTIONNAIRE);
  }, [navigation]);
  
  const handleViewReport = useCallback(() => navigation.navigateToStep(STEPS.REPORT), [navigation]);
  
  const handleBackFromWeeklyContext = useCallback(() => {
    navigation.navigateToStep(STEPS.QUESTIONNAIRE);
    navigation.setCurrentQuestionnaireIndex(profiles.length - 1);
  }, [navigation, profiles.length]);
  
  const handleViewProgress = useCallback(() => navigation.navigateToStep(STEPS.PROGRESS), [navigation]);
  
  const handleBackFromReport = useCallback(() => navigation.navigateToStep(STEPS.WEEKLY_CONTEXT), [navigation]);
  
  const handleContinueFromReport = useCallback(() => {
    navigation.navigateToStep(STEPS.WEEKLY_CONTEXT);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [navigation]);
  
  const handleBackFromProgress = useCallback(() => navigation.navigateToStep(STEPS.MENU), [navigation]);

  // Navegação para páginas especiais
  const handleViewHistory = useCallback(() => setCurrentPage('history'), []);
  const handleViewAccount = useCallback(() => setCurrentPage('account'), []);
  const handleBackToApp = useCallback(() => setCurrentPage('app'), []);
  
  // Deletar cardápio do histórico
  const handleDeleteMenu = useCallback(async (menuId) => {
    try {
      await deleteMenu(menuId);
      setMenuHistory(prev => prev.filter(m => m.id !== menuId));
      logger.log('🗑️ Cardápio excluído:', menuId);
    } catch (error) {
      errorHandler.handleError(error, {
        context: 'App',
        operation: 'deleteMenu',
      });
    }
  }, [setMenuHistory]);
  
  // Visualizar cardápio do histórico
  const handleViewMenuFromHistory = useCallback((menu) => {
    setMenuData(menu.menu_data);
    setCurrentPage('app');
    navigation.navigateToStep(STEPS.MENU);
  }, [navigation]);

  // Atualizar uma refeição no cardápio (trocar / variação)
  const handleUpdateMeal = useCallback((dayIndex, mealType, newMeal) => {
    setMenuData((prev) => {
      if (!prev?.days) return prev;
      return {
        ...prev,
        days: prev.days.map((d, i) =>
          i === dayIndex ? { ...d, [mealType]: { base: newMeal.base, adaptations: newMeal.adaptations || {} } } : d
        ),
      };
    });
  }, []);

  // Loading screen
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Tela de login (quando usuário clica em "Entrar")
  if (showLogin && !isAuthenticated) {
    return (
      <div>
        <button 
          onClick={() => setShowLogin(false)}
          className="fixed top-4 left-4 z-50 text-gray-600 hover:text-gray-800 flex items-center gap-2"
        >
          ← Voltar
        </button>
        <AuthForm />
      </div>
    );
  }

  // Landing Page (não autenticado e não é guest)
  if (!isAuthenticated && !isGuest) {
    return (
      <LandingPage 
        onStartTrial={() => startGuestMode()} 
        onLogin={() => setShowLogin(true)} 
      />
    );
  }

  // Tela de consentimento (autenticado mas não aceitou termos)
  if (isAuthenticated && !hasAcceptedTerms) {
    return <ConsentScreen />;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-3 sm:p-4">
        {/* Toast de nova conquista */}
        <AchievementToast 
          achievement={newAchievement} 
          onDismiss={dismissAchievement} 
        />
        
        <main id="main-content" className="max-w-4xl mx-auto" role="main" tabIndex="-1">
          <Header 
            step={navigation.step} 
            onCreateAccount={() => { exitGuestMode(); setShowLogin(true); }} 
            onViewHistory={handleViewHistory}
            onViewAccount={handleViewAccount}
          />

          {/* Página de Histórico */}
          {currentPage === 'history' && (
            <HistoryPage 
              menuHistory={menuHistory}
              onBack={handleBackToApp}
              onViewMenu={handleViewMenuFromHistory}
              onDeleteMenu={handleDeleteMenu}
            />
          )}

          {/* Página de Conta */}
          {currentPage === 'account' && (
            <AccountPage 
              profiles={profiles}
              menuHistory={menuHistory}
              onBack={handleBackToApp}
            />
          )}

          {/* App Principal */}
          {currentPage === 'app' && (
            <AppRouter
          step={navigation.step}
          profiles={profiles}
          familyLocation={familyLocation}
          currentQuestionnaireIndex={navigation.currentQuestionnaireIndex}
          individualAnswers={individualAnswers}
          weeklyContext={weeklyContext}
          menuData={menuData}
          expandedDay={expandedDay}
          showHistory={showHistory}
          weekHistory={weekHistory}
          lastWeekComparison={lastWeekComparison}
          gamification={gamificationData}
          onUpdateLocation={handleUpdateLocation}
          onAddProfile={addProfile}
          onUpdateProfile={updateProfile}
          onRemoveProfile={removeProfile}
          onToggleAdvanced={toggleAdvanced}
          onContinueFromProfiles={handleContinueFromProfiles}
          onNextQuestionnaire={nextQuestionnaire}
          onSaveAnswers={saveIndividualAnswers}
          onPrevQuestionnaire={prevQuestionnaire}
          onUpdateContext={handleUpdateContext}
          onGenerateMenu={handleGenerateMenu}
          onViewReport={handleViewReport}
          onBackFromWeeklyContext={handleBackFromWeeklyContext}
          onToggleDay={handleToggleDay}
          onReset={resetApp}
          onViewProgress={handleViewProgress}
          onShoppingListUsed={trackShoppingListUsed}
          onToggleHistory={handleToggleHistory}
          onBackFromReport={handleBackFromReport}
          onContinueFromReport={handleContinueFromReport}
          onBackFromProgress={handleBackFromProgress}
          onUpdateMeal={handleUpdateMeal}
          />
          )}
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;
