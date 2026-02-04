import { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseAvailable } from '../lib/supabase';
import { logger } from '../utils/logger';

/** URL base do app para redirects (OAuth e recuperação de senha). Evita 404 em prod. */
const getAppUrl = () => {
  const env = import.meta.env.VITE_APP_URL;
  if (env) return env.replace(/\/$/, '');
  if (typeof window !== 'undefined') return window.location.origin;
  return '';
};

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      if (!isSupabaseAvailable()) {
        const offlineUser = localStorage.getItem('offline_user');
        const acceptedTerms = localStorage.getItem('accepted_terms');
        if (offlineUser) setUser(JSON.parse(offlineUser));
        setHasAcceptedTerms(acceptedTerms === 'true');
        setLoading(false);
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        if (session?.user) {
          const acceptedTerms = localStorage.getItem(`terms_${session.user.id}`);
          setHasAcceptedTerms(acceptedTerms === 'true');
        }
      } catch (error) {
        logger.error('Erro ao verificar sessão:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    if (isSupabaseAvailable()) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === 'PASSWORD_RECOVERY') {
            setIsPasswordRecovery(true);
          }
          setUser(session?.user ?? null);
          if (session?.user) {
            const acceptedTerms = localStorage.getItem(`terms_${session.user.id}`);
            setHasAcceptedTerms(acceptedTerms === 'true');
          } else {
            setHasAcceptedTerms(false);
            setIsPasswordRecovery(false);
          }
        }
      );
      return () => subscription.unsubscribe();
    }
  }, []);

  // Login com email/senha
  const signIn = async (email, password) => {
    if (!isSupabaseAvailable()) {
      // Modo offline
      const offlineUser = { id: 'offline_' + Date.now(), email };
      localStorage.setItem('offline_user', JSON.stringify(offlineUser));
      setUser(offlineUser);
      return { user: offlineUser, error: null };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      return { user: null, error };
    }
    
    return { user: data.user, error: null };
  };

  // Login social (Google, etc.) — redirectTo fixo evita 404 em prod (Vercel)
  const signInWithProvider = async (provider) => {
    if (!isSupabaseAvailable()) {
      return { user: null, error: { message: 'Login social não disponível offline' } };
    }

    const redirectTo = getAppUrl() || window.location.origin;
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: redirectTo + '/'
      }
    });

    if (error) {
      return { user: null, error };
    }
    return { user: data.user, error: null };
  };

  // Recuperação de senha: envia email com link
  const resetPasswordForEmail = async (email) => {
    if (!isSupabaseAvailable()) {
      return { error: { message: 'Recuperação não disponível offline' } };
    }
    const redirectTo = getAppUrl() || window.location.origin;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectTo + '/redefinir-senha'
    });
    return { error };
  };

  // Definir nova senha (após clicar no link do email)
  const updatePassword = async (newPassword) => {
    if (!isSupabaseAvailable()) {
      return { error: { message: 'Indisponível' } };
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (!error) {
      setIsPasswordRecovery(false);
    }
    return { error };
  };

  // Cadastro com email/senha
  const signUp = async (email, password, name) => {
    if (!isSupabaseAvailable()) {
      // Modo offline
      const offlineUser = { id: 'offline_' + Date.now(), email, user_metadata: { name } };
      localStorage.setItem('offline_user', JSON.stringify(offlineUser));
      setUser(offlineUser);
      return { user: offlineUser, error: null };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    });
    
    if (error) {
      return { user: null, error };
    }
    
    return { user: data.user, error: null };
  };

  // Logout
  const signOut = async () => {
    if (!isSupabaseAvailable()) {
      localStorage.removeItem('offline_user');
      setUser(null);
      setHasAcceptedTerms(false);
      return;
    }

    await supabase.auth.signOut();
    setUser(null);
    setHasAcceptedTerms(false);
  };

  // Aceitar termos
  const acceptTerms = () => {
    if (user) {
      localStorage.setItem(`terms_${user.id}`, 'true');
    } else {
      localStorage.setItem('accepted_terms', 'true');
    }
    setHasAcceptedTerms(true);
  };

  // Revogar consentimento e excluir dados
  const revokeConsentAndDeleteData = async () => {
    if (user) {
      localStorage.removeItem(`terms_${user.id}`);
      // TODO: Implementar exclusão de dados no Supabase
    }
    setHasAcceptedTerms(false);
    await signOut();
  };

  // Entrar como visitante (experimentar sem login)
  const startGuestMode = () => {
    setIsGuest(true);
    // Aceitar termos temporariamente para modo guest
    localStorage.setItem('guest_terms', 'true');
    setHasAcceptedTerms(true);
  };

  // Sair do modo guest
  const exitGuestMode = () => {
    setIsGuest(false);
    localStorage.removeItem('guest_terms');
    setHasAcceptedTerms(false);
  };

  // Verificar se está em modo guest ao iniciar
  useEffect(() => {
    const guestTerms = localStorage.getItem('guest_terms');
    if (guestTerms === 'true' && !user) {
      setIsGuest(true);
      setHasAcceptedTerms(true);
    }
  }, [user]);

  const value = {
    user,
    loading,
    hasAcceptedTerms,
    isGuest,
    isPasswordRecovery,
    signIn,
    signUp,
    signInWithProvider,
    signOut,
    resetPasswordForEmail,
    updatePassword,
    clearPasswordRecovery: () => setIsPasswordRecovery(false),
    acceptTerms,
    revokeConsentAndDeleteData,
    startGuestMode,
    exitGuestMode,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
