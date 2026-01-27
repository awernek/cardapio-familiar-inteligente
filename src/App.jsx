import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ProfilesStep } from './components/steps/ProfilesStep';
import { QuestionnaireStep } from './components/steps/QuestionnaireStep';
import { WeeklyContextStep } from './components/steps/WeeklyContextStep';
import { ReportStep } from './components/steps/ReportStep';
import { MenuStep } from './components/steps/MenuStep';
import { ProgressStep } from './components/steps/ProgressStep';
import { AuthForm } from './components/auth/AuthForm';
import { ConsentScreen } from './components/auth/ConsentScreen';
import { LandingPage } from './components/LandingPage';
import { useHistory } from './hooks/useHistory';
import { useAuth } from './contexts/AuthContext';
import { useGamification } from './hooks/useGamification';
import { AchievementToast } from './components/gamification/AchievementToast';
import { GamificationCard } from './components/gamification/GamificationCard';
import { generateWeeklyPriorities, generateInsights, compareWithLastWeek } from './utils/menuLogic';
import { getOrCreateFamily, saveMenu, getMenuHistory } from './services/menuService';
import { isSupabaseAvailable } from './lib/supabase';

function App() {
  const { user, loading: authLoading, hasAcceptedTerms, isAuthenticated, isGuest, startGuestMode, exitGuestMode } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  
  const [step, setStep] = useState('profiles');
  const [profiles, setProfiles] = useState([]);
  const [familyLocation, setFamilyLocation] = useState({ state: '', city: '' });
  const [currentQuestionnaireIndex, setCurrentQuestionnaireIndex] = useState(0);
  const [individualAnswers, setIndividualAnswers] = useState({});
  const [weeklyContext, setWeeklyContext] = useState({});
  const [menuData, setMenuData] = useState(null);
  const [expandedDay, setExpandedDay] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [familyId, setFamilyId] = useState(null);
  const [menuHistory, setMenuHistory] = useState([]);
  
  const { weekHistory, saveWeekToHistory } = useHistory();
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

  // Inicializar família ao carregar (após autenticação e aceite de termos)
  useEffect(() => {
    const initFamily = async () => {
      // Só inicializa família para usuários autenticados (não guest)
      if (!isAuthenticated || !hasAcceptedTerms || isGuest) return;
      
      try {
        const family = await getOrCreateFamily('Minha Família', user?.id);
        setFamilyId(family.id);
        console.log('👨‍👩‍👧‍👦 Família inicializada:', family.id);
        
        // Carregar histórico de cardápios
        if (isSupabaseAvailable()) {
          const history = await getMenuHistory(family.id);
          setMenuHistory(history);
          console.log('📚 Histórico carregado:', history.length, 'cardápios');
        }
      } catch (error) {
        console.error('Erro ao inicializar família:', error);
      }
    };
    initFamily();
  }, [isAuthenticated, hasAcceptedTerms, isGuest, user?.id]);

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

  // Adicionar perfil
  const addProfile = () => {
    setProfiles([...profiles, {
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
  };

  // Atualizar perfil
  const updateProfile = (id, field, value) => {
    setProfiles(profiles.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  // Remover perfil
  const removeProfile = (id) => {
    setProfiles(profiles.filter(p => p.id !== id));
  };

  // Toggle detalhes avançados
  const toggleAdvanced = (id) => {
    setProfiles(profiles.map(p => 
      p.id === id ? { ...p, showAdvanced: !p.showAdvanced } : p
    ));
  };

  // Salvar respostas individuais
  const saveIndividualAnswers = (profileId, answers) => {
    setIndividualAnswers(prev => ({
      ...prev,
      [profileId]: answers
    }));
  };

  // Avançar para próxima pessoa
  const nextQuestionnaire = () => {
    if (currentQuestionnaireIndex < profiles.length - 1) {
      setCurrentQuestionnaireIndex(currentQuestionnaireIndex + 1);
    } else {
      setStep('weekly-context');
    }
  };

  // Voltar para pessoa anterior
  const prevQuestionnaire = () => {
    if (currentQuestionnaireIndex > 0) {
      setCurrentQuestionnaireIndex(currentQuestionnaireIndex - 1);
    } else {
      setStep('profiles');
    }
  };

  // Gerar cardápio
  const handleGenerateMenu = async (menuData) => {
    // Salva semana no histórico antes de gerar cardápio
    await saveWeekToHistory(
      profiles,
      individualAnswers,
      weeklyContext,
      () => generateWeeklyPriorities(profiles, individualAnswers, weeklyContext),
      () => generateInsights(profiles, individualAnswers)
    );
    
    // Salvar cardápio no Supabase
    if (familyId) {
      try {
        const savedMenu = await saveMenu(familyId, menuData, weeklyContext, profiles);
        console.log('💾 Cardápio salvo:', savedMenu.id);
        
        // Atualizar histórico local
        setMenuHistory(prev => [savedMenu, ...prev]);
      } catch (error) {
        console.error('Erro ao salvar cardápio:', error);
        // Continua mesmo se falhar o salvamento
      }
    }
    
    // Tracking de gamificação
    await trackMenuGenerated();
    await trackProfilesCount(profiles.length);
    
    setMenuData(menuData);
    setStep('menu');
  };

  // Comparar com semana anterior
  const lastWeekComparison = weekHistory.length > 0 
    ? compareWithLastWeek(profiles, individualAnswers, weekHistory[0])
    : null;

  // Resetar tudo
  const resetApp = () => {
    setStep('profiles');
    setMenuData(null);
    setCurrentQuestionnaireIndex(0);
    setIndividualAnswers({});
    setWeeklyContext({});
    setExpandedDay(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-3 sm:p-4">
      {/* Toast de nova conquista */}
      <AchievementToast 
        achievement={newAchievement} 
        onDismiss={dismissAchievement} 
      />
      
      <main className="max-w-4xl mx-auto" role="main">
        <Header step={step} onCreateAccount={() => { exitGuestMode(); setShowLogin(true); }} />

        {/* Step: Perfis */}
        {step === 'profiles' && (
          <ProfilesStep
            profiles={profiles}
            familyLocation={familyLocation}
            onUpdateLocation={setFamilyLocation}
            onAddProfile={addProfile}
            onUpdateProfile={updateProfile}
            onRemoveProfile={removeProfile}
            onToggleAdvanced={toggleAdvanced}
            onContinue={() => {
              setStep('questionnaire');
              setCurrentQuestionnaireIndex(0);
            }}
          />
        )}

        {/* Step: Questionário Individual */}
        {step === 'questionnaire' && (
          <QuestionnaireStep
            profiles={profiles}
            currentIndex={currentQuestionnaireIndex}
            individualAnswers={individualAnswers}
            onSaveAnswers={saveIndividualAnswers}
            onNext={nextQuestionnaire}
            onPrev={prevQuestionnaire}
          />
        )}

        {/* Step: Contexto Semanal */}
        {step === 'weekly-context' && (
          <WeeklyContextStep
            profiles={profiles}
            individualAnswers={individualAnswers}
            weeklyContext={weeklyContext}
            familyLocation={familyLocation}
            onUpdateContext={setWeeklyContext}
            onGenerateMenu={handleGenerateMenu}
            onBack={() => {
              setStep('questionnaire');
              setCurrentQuestionnaireIndex(profiles.length - 1);
            }}
            onViewReport={() => setStep('report')}
          />
        )}

        {/* Step: Relatório */}
        {step === 'report' && (
          <ReportStep
            profiles={profiles}
            individualAnswers={individualAnswers}
            weeklyContext={weeklyContext}
            weekHistory={weekHistory}
            showHistory={showHistory}
            onToggleHistory={() => setShowHistory(!showHistory)}
            onBack={() => setStep('weekly-context')}
            onContinue={() => {
              setStep('weekly-context');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* Step: Cardápio */}
        {step === 'menu' && menuData && (
          <MenuStep
            menuData={menuData}
            profiles={profiles}
            individualAnswers={individualAnswers}
            weeklyContext={weeklyContext}
            lastWeekComparison={lastWeekComparison}
            expandedDay={expandedDay}
            onToggleDay={setExpandedDay}
            onReset={resetApp}
            onViewProgress={() => setStep('progress')}
            onShoppingListUsed={trackShoppingListUsed}
            gamification={{
              missions: getMissions(),
              achievements: getAchievements(),
              level: getLevel()
            }}
          />
        )}

        {/* Step: Progresso */}
        {step === 'progress' && (
          <ProgressStep
            profiles={profiles}
            individualAnswers={individualAnswers}
            weekHistory={weekHistory}
            onBack={() => setStep('menu')}
          />
        )}
      </main>
    </div>
  );
}

export default App;
