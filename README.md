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
- **Histórico**: Acompanhe a evolução das semanas anteriores
- **Gamificação**: Conquistas e missões para manter a motivação

## 🛠️ Stack

| Tecnologia | Uso |
|------------|-----|
| React 18 | Frontend |
| Vite | Build tool |
| Tailwind CSS | Estilização |
| Vitest | Testes unitários e integração |
| Groq API (Llama 3.3) | Geração de cardápios |
| Supabase | Autenticação e banco de dados |
| Vercel | Hospedagem (Serverless) |

## 🎯 Qualidade de Código

O projeto segue boas práticas de desenvolvimento:

- ✅ **Clean Code**: Código organizado, legível e bem estruturado
- ✅ **Type Safety**: PropTypes em todos os componentes
- ✅ **Testes**: Cobertura de testes unitários e de integração
- ✅ **Performance**: Memoização, lazy loading e otimizações React
- ✅ **Acessibilidade**: ARIA labels, navegação por teclado, HTML semântico
- ✅ **Error Handling**: Error Boundaries e tratamento centralizado de erros
- ✅ **Segurança**: Variáveis de ambiente validadas, sem chaves expostas
- ✅ **Logging**: Sistema de logs condicional (dev/prod)

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

- ✅ **Utils**: `bmi.js`, `menuLogic.js`, `storage.js`, `logger.js`
- ✅ **Hooks**: `useGamification`, `useHistory`, `useMenuGeneration`
- ✅ **Integração**: Fluxos completos de criação de perfil e geração de cardápio

Veja mais detalhes em `src/test/README.md`.

## ♿ Acessibilidade

O projeto segue as diretrizes WCAG e boas práticas de acessibilidade:

- ✅ **ARIA Labels**: Todos os elementos interativos têm labels descritivos
- ✅ **Navegação por Teclado**: Focus visible, skip links, suporte completo a Tab/Enter/Espaço
- ✅ **HTML Semântico**: Uso correto de `<header>`, `<main>`, `<nav>`, `<section>`, `<article>`
- ✅ **Roles Semânticos**: `role="banner"`, `role="main"`, `role="alert"`, etc.
- ✅ **Screen Readers**: Suporte completo com `aria-labelledby`, `aria-describedby`
- ✅ **Estados Dinâmicos**: `aria-expanded`, `aria-disabled`, `aria-busy`, `aria-live`
- ✅ **Formulários**: Labels associados com `htmlFor`, `fieldset`/`legend` para grupos

## 🔧 Melhorias Implementadas

O projeto passou por 8 sprints de melhorias focadas em qualidade de código:

### Sprint 1: Fundação e Logging
- Sistema de logging condicional (dev/prod)
- Centralização de constantes
- Remoção de `console.log` espalhados

### Sprint 2: Validação de Tipos
- PropTypes em todos os componentes
- JSDoc em hooks e funções principais
- Tipos centralizados em `src/types/`

### Sprint 3: Refatoração de Componentes
- Componentes grandes divididos em menores
- Extração de lógica para hooks customizados
- Separação de responsabilidades

### Sprint 4: Performance e Otimizações
- `useMemo` e `useCallback` para evitar re-renders
- `React.memo` em componentes filhos
- Lazy loading com `React.lazy` e `Suspense`

### Sprint 5: Segurança e Variáveis de Ambiente
- Validação de variáveis de ambiente
- Remoção de chaves hardcoded
- Documentação de variáveis obrigatórias/opcionais

### Sprint 6: Tratamento de Erros
- Error Boundary para capturar erros React
- Tratamento centralizado de erros
- Mensagens amigáveis ao usuário

### Sprint 7: Testes Básicos
- Configuração do Vitest
- Testes unitários para utils e hooks
- Testes de integração para fluxos principais

### Sprint 8: Acessibilidade e UX
- ARIA labels e roles semânticos
- Navegação por teclado completa
- HTML semântico e melhorias de UX

## 📁 Estrutura do Projeto

```
├── api/                          # Serverless Functions (Vercel)
│   ├── generate-menu.js          # Endpoint de geração
│   └── health.js                 # Health check
├── src/
│   ├── components/               # Componentes React
│   │   ├── LandingPage.jsx       # Página inicial
│   │   ├── Header.jsx            # Cabeçalho
│   │   ├── ProfileForm.jsx       # Formulário de perfil
│   │   ├── ErrorBoundary.jsx    # Error Boundary
│   │   ├── AppRouter.jsx         # Router de steps
│   │   ├── auth/                 # Login/Cadastro
│   │   ├── gamification/         # Componentes de gamificação
│   │   └── steps/                # Etapas do fluxo
│   │       ├── ProfilesStep.jsx
│   │       ├── QuestionnaireStep.jsx
│   │       ├── WeeklyContextStep.jsx
│   │       ├── MenuStep.jsx
│   │       │   └── MenuStep/     # Sub-componentes
│   │       │       ├── MenuActions.jsx
│   │       │       ├── DayCard.jsx
│   │       │       ├── ShoppingList.jsx
│   │       │       └── CostEstimate.jsx
│   │       ├── ReportStep.jsx
│   │       └── ProgressStep.jsx
│   ├── contexts/                 # Context API
│   │   └── AuthContext.jsx       # Autenticação
│   ├── hooks/                    # Hooks customizados
│   │   ├── useAppNavigation.js   # Navegação entre steps
│   │   ├── useAppInitialization.js # Inicialização
│   │   ├── useProfiles.js         # Gerenciamento de perfis
│   │   ├── useMenuGeneration.js   # Geração de cardápio
│   │   ├── useGamification.js     # Gamificação
│   │   ├── useHistory.js          # Histórico
│   │   └── __tests__/              # Testes dos hooks
│   ├── services/                  # Serviços
│   │   └── menuService.js         # Serviço Supabase
│   ├── utils/                     # Funções utilitárias
│   │   ├── logger.js              # Sistema de logs
│   │   ├── errorHandler.js        # Tratamento de erros
│   │   ├── envValidation.js       # Validação de env vars
│   │   ├── promptBuilder.js      # Construção de prompts
│   │   ├── menuLogic.js           # Lógica de negócio
│   │   ├── bmi.js                 # Cálculo de IMC
│   │   ├── storage.js             # LocalStorage
│   │   ├── browserCompatibility.js
│   │   └── __tests__/              # Testes das utils
│   ├── constants/                 # Constantes
│   │   ├── steps.js               # Constantes de steps
│   │   └── index.js
│   ├── types/                     # Tipos e PropTypes
│   │   └── index.js
│   ├── test/                      # Configuração de testes
│   │   ├── setup.js               # Setup do Vitest
│   │   └── README.md
│   ├── __tests__/                 # Testes de integração
│   ├── App.jsx                    # Componente principal
│   └── main.jsx                   # Entry point
├── server/                        # Backend local (dev)
│   └── index.js                   # Servidor Express
├── supabase/                      # Migrations e schema
│   ├── schema.sql
│   ├── rls_update.sql
│   └── migrations/
├── public/                        # Assets estáticos
├── vitest.config.js               # Configuração Vitest
└── vercel.json                    # Config Vercel
```

## 📊 Analytics

Analytics habilitado via Vercel Analytics no dashboard do projeto.

## 🔒 Privacidade

- Modo gratuito: dados não são salvos, usados apenas para gerar o cardápio
- Dados sensíveis (saúde) tratados conforme LGPD
- Usuários podem solicitar exclusão a qualquer momento

## 📚 Documentação Adicional

- **[ANÁLISE_PROJETO.md](./ANÁLISE_PROJETO.md)**: Análise detalhada da estrutura e qualidade do código
- **[PLANO_SPRINTS.md](./PLANO_SPRINTS.md)**: Plano completo das 8 sprints de melhorias implementadas
- **[src/test/README.md](./src/test/README.md)**: Guia completo sobre testes

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

MIT © 2026
