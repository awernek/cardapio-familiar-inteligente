import React from 'react'
import ReactDOM from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import App from './App.jsx'
import { SupportPage } from './components/SupportPage.jsx'
import { ComoFuncionaPage } from './components/pages/ComoFuncionaPage.jsx'
import { ParaQuemEPage } from './components/pages/ParaQuemEPage.jsx'
import { AuthProvider } from './contexts/AuthContext'
import { validateEnvVars } from './utils/envValidation'
import './index.css'

// Valida variáveis de ambiente em desenvolvimento
validateEnvVars();

/**
 * Componente de roteamento simples
 * Detecta a rota atual e renderiza o componente apropriado
 */
const Router = () => {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  
  // Páginas estáticas (SEO)
  if (path === '/apoie') return <SupportPage />;
  if (path === '/como-funciona') return <ComoFuncionaPage />;
  if (path === '/para-quem-e') return <ParaQuemEPage />;
  
  // Rota padrão - app principal
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router />
    <Analytics />
  </React.StrictMode>,
)
