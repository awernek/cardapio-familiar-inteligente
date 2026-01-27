# 🍽️ Cardápio Familiar Inteligente

Planejamento alimentar semanal personalizado com IA para toda a família.

**[Acesse o App](https://cardapio-familiar-inteligente.vercel.app)** — 100% gratuito, sem cadastro.

---

## ✨ Funcionalidades

- **Perfis da Família**: Cadastre cada membro com dados físicos, restrições e objetivos
- **Avaliação Semanal**: Considera estresse, sono, energia e apetite de cada pessoa
- **Contexto da Semana**: Adapta ao orçamento, tempo disponível e rotina
- **Cardápio Personalizado**: 7 dias de refeições geradas por IA
- **Lista de Compras**: Organizada por categoria, pronta para ir ao mercado
- **Imprimir/PDF**: Exporte o cardápio para imprimir ou salvar
- **Compartilhar**: Envie via WhatsApp

## 🛠️ Stack

| Tecnologia | Uso |
|------------|-----|
| React 18 | Frontend |
| Vite | Build tool |
| Tailwind CSS | Estilização |
| Groq API (Llama 3.3) | Geração de cardápios |
| Supabase | Autenticação e banco de dados |
| Vercel | Hospedagem (Serverless) |

## 🚀 Deploy em Produção

O app está hospedado na Vercel com deploy automático a cada push.

**URL de Produção**: https://cardapio-familiar-inteligente.vercel.app

### Variáveis de Ambiente (Vercel)

#### Frontend (Vite)
| Variável | Descrição | Obrigatória |
|----------|-----------|-------------|
| `VITE_API_URL` | URL do servidor backend (padrão: http://localhost:3001) | Não |
| `VITE_SUPABASE_URL` | URL do projeto Supabase | Não |
| `VITE_SUPABASE_ANON_KEY` | Chave anon do Supabase | Não |
| `VITE_WEB3FORMS_ACCESS_KEY` | Chave de acesso do Web3Forms (formulário de contato) | Não |

#### Backend (Server)
| Variável | Descrição | Obrigatória |
|----------|-----------|-------------|
| `GROQ_API_KEY` | Chave da API Groq (ou `GOOGLE_API_KEY` / `ANTHROPIC_API_KEY`) | Sim |
| `PORT` | Porta do servidor (padrão: 3001) | Não |

## 💻 Desenvolvimento Local

### 1. Clonar e instalar

```bash
git clone https://github.com/awernek/cardapio-familiar-inteligente.git
cd cardapio-familiar-inteligente
npm install
```

### 2. Configurar variáveis

Crie um arquivo `.env` na raiz (copie de `.env.example`):

```env
# URL do servidor backend
VITE_API_URL=http://localhost:3001

# Supabase (opcional - para autenticação e histórico)
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anon

# Web3Forms (opcional - para formulário de contato)
VITE_WEB3FORMS_ACCESS_KEY=sua_chave_web3forms
```

E um arquivo `server/.env` (copie de `server/.env.example`):

```env
# Chave da API de IA (escolha uma)
GROQ_API_KEY=sua_chave_groq
# OU
# GOOGLE_API_KEY=sua_chave_google
# OU
# ANTHROPIC_API_KEY=sua_chave_anthropic

# Porta do servidor (opcional)
PORT=3001
```

**Nota:** As variáveis marcadas como opcionais permitem que o app funcione sem elas, mas algumas funcionalidades podem estar limitadas.

### 3. Executar

**Terminal 1 - Backend:**
```bash
cd server
npm install
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Acesse: http://localhost:3000

## 🧪 Testes

O projeto usa **Vitest** para testes unitários e de integração.

### Executar Testes

```bash
# Modo watch (desenvolvimento)
npm test

# Interface visual
npm run test:ui

# Com cobertura de código
npm run test:coverage
```

### Cobertura de Testes

- ✅ Utils: `bmi.js`, `menuLogic.js`, `storage.js`, `logger.js`
- ✅ Hooks: `useGamification`, `useHistory`, `useMenuGeneration`
- ✅ Integração: Fluxos completos de criação de perfil e geração de cardápio

Veja mais detalhes em `src/test/README.md`.

## 📁 Estrutura

```
├── api/                    # Serverless Functions (Vercel)
│   └── generate-menu.js    # Endpoint de geração
├── src/
│   ├── components/         # Componentes React
│   │   ├── LandingPage.jsx # Página inicial
│   │   ├── Header.jsx      # Cabeçalho
│   │   ├── auth/           # Login/Cadastro
│   │   └── steps/          # Etapas do fluxo
│   ├── contexts/           # Context API (Auth)
│   ├── hooks/              # Hooks customizados
│   ├── services/           # Serviços (Supabase)
│   └── utils/              # Funções utilitárias
├── server/                 # Backend local (dev)
├── public/                 # Assets estáticos
└── vercel.json             # Config Vercel
```

## 📊 Analytics

Analytics habilitado via Vercel Analytics no dashboard do projeto.

## 🔒 Privacidade

- Modo gratuito: dados não são salvos, usados apenas para gerar o cardápio
- Dados sensíveis (saúde) tratados conforme LGPD
- Usuários podem solicitar exclusão a qualquer momento

## 📝 Licença

MIT © 2026
