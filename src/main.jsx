import React from 'react'
import ReactDOM from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext'
import { validateEnvVars } from './utils/envValidation'
import './index.css'

// Valida variáveis de ambiente em desenvolvimento
validateEnvVars();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
      <Analytics />
    </AuthProvider>
  </React.StrictMode>,
)
