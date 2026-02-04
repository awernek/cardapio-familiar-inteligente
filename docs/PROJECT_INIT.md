# Inicialização do Projeto — NURI (Nutrição Inteligente)

Documento para onboarding, compartilhamento com assistentes (ex.: Claude) e identificação de margem para melhorias.

---

## 1. Visão geral

**Nome:** NURI — Nutrição Inteligente  
**Descrição:** Aplicação web que gera planejamento alimentar semanal personalizado com IA para famílias.  
**Produto:** [www.nuri.app.br](https://www.nuri.app.br) — gratuito, sem cadastro obrigatório (modo convidado disponível).

**Principais capacidades:**
- Cadastro de perfis (membros da família: dados físicos, restrições, objetivos).
- Questionário semanal por pessoa (estresse, sono, energia, apetite).
- Contexto da semana (orçamento, tempo, rotina).
- Cardápio de 7 dias gerado por IA (Groq / Google Gemini / Anthropic).
- Lista de compras, estimativa de custo, impressão/PDF.
- Histórico de cardápios (com persistência em Supabase para usuários autenticados).
- Gamificação (conquistas, missões, níveis).

---

## 2. Stack técnica

| Camada        | Tecnologias |
|---------------|-------------|
| Frontend      | React 18, Vite, Tailwind CSS, Lucide Icons |
| Backend local | Node.js, Express (porta 3001) |
| Produção API  | Vercel Serverless (`/api/generate-menu`, `/api/health`) |
| IA            | Groq (Llama 3.3 70B), Google Gemini (fallback), Anthropic Claude |
| Banco / Auth  | Supabase (PostgreSQL, Auth) |
| Hospedagem    | Vercel (frontend + serverless) |
| Testes        | Vitest (frontend e server), Testing Library |

Prioridade dos providers de IA no servidor: **Groq → Google → Anthropic** (primeira chave configurada vence).

---

## 3. Estrutura do repositório

```
cardápio-familiar-inteligente/
├── src/                    # Frontend React
│   ├── components/         # Componentes por página e steps
│   │   ├── auth/           # AuthForm, ConsentScreen
│   │   ├── gamification/   # AchievementToast, GamificationCard
│   │   └── steps/          # Cada step do fluxo (Profiles, Questionnaire, etc.)
│   ├── constants/          # steps.js, index
│   ├── contexts/           # AuthContext
│   ├── hooks/              # useMenuGeneration, useHistory, useProfiles, useGamification, etc.
│   ├── lib/                # supabase.js
│   ├── services/           # menuService.js (Supabase)
│   ├── utils/              # promptBuilder, menuLogic, reportGenerator, storage, logger, etc.
│   ├── types/
│   ├── App.jsx
│   └── main.jsx
├── server/                 # Backend Express (dev local)
│   ├── config/             # constants, cors
│   ├── middleware/         # validateRequest, errorHandler
│   ├── services/           # apiProvider, groqService, googleService, anthropicService
│   ├── utils/              # rateLimiter, parseJsonResponse, envValidation, logger, errors
│   └── index.js
├── api/                    # Vercel Serverless (produção)
│   ├── generate-menu.js    # Proxy para IA em prod
│   └── health.js
├── supabase/
│   ├── schema.sql
│   └── migrations/
├── public/                 # Assets (favicon, logos, manifest, etc.)
├── docs/                   # API_SETUP, ESPECIFICACOES_IMAGENS_DESIGNER, PROJECT_INIT
├── .env.example            # Frontend (VITE_*)
├── server/.env.example     # Backend (GOOGLE_API_KEY, etc.)
├── vercel.json             # Rewrites e headers para /api/*
├── vite.config.js
├── tailwind.config.js
└── package.json            # Scripts: dev, build, test, test:coverage, lint
```

---

## 4. Fluxo da aplicação (steps)

Ordem dos steps (definida em `src/constants/steps.js`):

1. **PROFILES** — Cadastro/edição dos membros da família.
2. **QUESTIONNAIRE** — Questionário semanal por perfil (um por vez).
3. **WEEKLY_CONTEXT** — Contexto da semana (orçamento, tempo, compras).
4. **REPORT** — Relatório/prioridades (visão antes de gerar).
5. **MENU** — Geração do cardápio (chamada à API de IA) e exibição (dias, lista de compras, custo).
6. **PROGRESS** — Tela de progresso/gamificação.

O roteamento por step é feito em `App.jsx` + `AppRouter.jsx`; estado de navegação em `useAppNavigation`.

---

## 5. Autenticação e dados

- **Landing** → pode “Experimentar sem cadastro” (modo convidado) ou “Entrar”.
- **Supabase Auth** — login/cadastro; após login, tela de consentimento (termos) se ainda não aceitos.
- **Dados persistidos (autenticado):** família, perfis, cardápios no Supabase; histórico de cardápios em `menu_history` / tabelas do schema.
- **Modo convidado:** dados em estado local (e possivelmente localStorage); sem histórico persistido entre sessões.

Schema principal: `families`, `profiles`, `weekly_assessments`, `weekly_contexts`, `menus` (e demais tabelas em `supabase/schema.sql`).

---

## 6. API de geração de cardápio

- **Endpoint:** `POST /api/generate-menu`
- **Body:** `{ "prompt": "string" }`
- **Quem monta o prompt:** frontend via `promptBuilder.buildPrompt()` (perfis, contexto, prioridades, insights); o texto final é enviado no `prompt`.
- **Em desenvolvimento:** frontend usa `VITE_API_URL` (ex.: `http://localhost:3001`) e fala com o Express em `server/`.
- **Em produção (Vercel):** frontend chama `/api/generate-menu`; `vercel.json` encaminha para `api/generate-menu.js` (serverless), que usa as mesmas envs de IA (Groq/Google/Anthropic).
- **Rate limit:** 20 req/hora por IP (lado servidor); headers `X-RateLimit-Limit`, `X-RateLimit-Remaining`.
- **Health:** `GET /api/health` (e `api/health.js` na Vercel).

Documentação detalhada do servidor: `server/README.md`. Configuração de APIs de IA: `docs/API_SETUP.md`.

---

## 7. Variáveis de ambiente

**Raiz (frontend):**
- `VITE_API_URL` — URL do backend (dev: `http://localhost:3001`).
- `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` — opcionais (Supabase).
- `VITE_WEB3FORMS_ACCESS_KEY` — opcional (formulário de contato).

**Server (pasta `server/`) ou Vercel (para serverless):**
- Pelo menos uma: `GROQ_API_KEY`, `GOOGLE_API_KEY` ou `ANTHROPIC_API_KEY`.
- `PORT` — opcional (padrão 3001).

Usar `.env.example` e `server/.env.example` como referência; nunca commitar `.env`.

---

## 8. Como rodar localmente

```bash
# 1. Instalar dependências
npm install
cd server && npm install && cd ..

# 2. Configurar .env na raiz e server/.env (copiar dos .env.example)

# 3. Terminal 1 — Backend
cd server && npm run dev

# 4. Terminal 2 — Frontend
npm run dev
```

Acesso: **http://localhost:3000**. Backend: **http://localhost:3001**.

---

## 9. Testes

```bash
# Frontend
npm test
npm run test:coverage

# Backend
cd server && npm test
cd server && npm run test:coverage
```

Vitest em ambos; testes em `src/__tests__/`, `src/**/__tests__/`, `server/__tests__/`, `server/**/__tests__/`.

---

## 10. Deploy (Vercel)

- Build: `npm run build` (Vite).
- Output: `dist`.
- Rewrites em `vercel.json`: `/api/*` → serverless; resto → SPA (`index.html`).
- Variáveis no Vercel: todas as `VITE_*` necessárias no frontend; para serverless, as chaves de IA e qualquer variável usada por `api/generate-menu.js`.

---

## 11. Margem para melhorias (para revisão com Claude ou equipe)

Itens que podem ser usados como checklist de melhorias ou discussão com um assistente (ex.: Claude):

### Código e arquitetura
- **App.jsx** concentra muita lógica (estado, handlers, memoização). Avaliar extração para hooks (ex.: `useAppHandlers`) ou quebra em subcomponentes/contextos para reduzir complexidade e facilitar testes.
- **Duplicação de lógica de API:** em dev usa Express; em prod usa serverless em `api/`. Garantir que validação, limites e formato de resposta estejam alinhados entre `server/` e `api/generate-menu.js`.
- **Tipagem:** projeto em JS (React). Considerar migração gradual para TypeScript ou JSDoc mais rigoroso para melhor DX e detecção de erros.
- **Constantes e env:** centralizar mensagens e configs (front e back); evitar strings mágicas e números soltos.

### Performance e UX
- **Bundle:** analisar `vite build` e considerar code-split por rotas/steps (lazy load de steps pesados).
- **Geração de cardápio:** feedback visual claro (loading, progresso, timeout) e tratamento de erros (retry, mensagens amigáveis).
- **Acessibilidade:** garantir foco, labels, contraste e navegação por teclado em formulários e modais (alvo WCAG já citado no README).
- **Mobile:** revisar toques, tamanhos de alvo e layout em telas pequenas (especialmente steps longos).

### Segurança e resiliência
- **Rate limit:** hoje por IP; em cenários com proxy/CDN, validar que o IP do cliente está correto (X-Forwarded-For / config do Vercel).
- **Prompt:** sanitização e limite de tamanho já existem no servidor; revisar se o `promptBuilder` nunca injeta conteúdo não sanitizado.
- **Supabase:** RLS e políticas de acesso revisadas; não expor chaves de serviço no frontend (apenas anon key).

### Testes e qualidade
- **Cobertura:** aumentar testes para fluxos críticos (geração de cardápio, salvamento no Supabase, navegação entre steps).
- **E2E:** não há E2E no repositório; considerar Playwright ou Cypress para fluxo principal (perfis → questionário → contexto → gerar → ver cardápio).
- **Testes de integração:** garantir que os serviços de IA (mock ou provider real em CI) sejam testados de forma estável.

### Documentação e operação
- **API:** manter `server/README.md` e `docs/API_SETUP.md` alinhados com `api/` (serverless) e com a ordem real dos providers (Groq primeiro).
- **.env.example:** incluir `GROQ_API_KEY` em `server/.env.example` se for opção recomendada.
- **Changelog/versão:** manter versão e mudanças relevantes (ex.: CHANGELOG.md ou release notes) para facilitar revisões e onboarding.
- **Monitoramento:** considerar health checks, métricas de uso da API e alertas em produção (ex.: Vercel Analytics já presente; expandir se necessário).

### Funcional e produto
- **Offline / PWA:** avaliar se faz sentido cache e uso offline básico (manifest já existe em `public/`).
- **Internacionalização:** se houver plano de outros idiomas, preparar textos extraídos (i18n).
- **A/B e analytics:** definir eventos essenciais (geração de cardápio, conclusão de steps, uso de lista de compras) para decisões de produto.

---

## 12. Referências rápidas

- **README principal:** `README.md`
- **Servidor (endpoints, providers, rate limit):** `server/README.md`
- **Configuração das APIs de IA:** `docs/API_SETUP.md`
- **Especificações de imagens/design:** `docs/ESPECIFICACOES_IMAGENS_DESIGNER.md`

---

*Documento gerado para init do projeto e compartilhamento com assistentes (ex.: Claude). Última atualização: fevereiro/2026.*
