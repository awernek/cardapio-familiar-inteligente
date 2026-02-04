# 🍽️ NURI — Nutrição Inteligente

**NURI** é planejamento alimentar semanal personalizado com IA para toda a família.

**[Acesse o app → www.nuri.app.br](https://www.nuri.app.br)** — 100% gratuito, sem cadastro.

---

## ✨ Funcionalidades

- **Perfis da Família** — Cadastre cada membro com dados físicos, restrições e objetivos
- **Avaliação Semanal** — Considera estresse, sono, energia e apetite de cada pessoa
- **Contexto da Semana** — Adapta ao orçamento, tempo disponível e rotina
- **Cardápio Personalizado** — 7 dias de refeições geradas por IA
- **Lista de Compras** — Organizada por categoria, pronta para ir ao mercado
- **Imprimir / PDF** — Exporte o cardápio para imprimir ou salvar
- **Histórico** — Acompanhe a evolução das semanas anteriores
- **Gamificação** — Conquistas e missões para manter a motivação

## 🛠️ Stack

| Camada      | Tecnologias                                      |
|------------|---------------------------------------------------|
| **Frontend** | React 18, Vite, Tailwind CSS                     |
| **Backend**  | Express, Node.js (API local)                     |
| **IA**       | Groq (Llama 3.3), Google Gemini, Anthropic Claude |
| **Banco**    | Supabase                                         |
| **Hospedagem** | Vercel                                        |
| **Testes**   | Vitest                                           |

## 💻 Desenvolvimento local

### 1. Clonar e instalar

```bash
git clone https://github.com/awernek/cardapio-familiar-inteligente.git
cd cardapio-familiar-inteligente
npm install
```

### 2. Variáveis de ambiente

**Frontend** — Crie `.env` na raiz (copie de `.env.example`):

```env
VITE_API_URL=http://localhost:3001
VITE_SUPABASE_URL=sua_url_supabase        # Opcional
VITE_SUPABASE_ANON_KEY=sua_chave_anon     # Opcional
VITE_WEB3FORMS_ACCESS_KEY=sua_chave       # Opcional (formulário de contato)
```

**Backend** — Crie `server/.env` (copie de `server/.env.example`):

```env
# Pelo menos uma chave é obrigatória
GOOGLE_API_KEY=sua_chave_google           # Recomendado (gratuito)
# OU ANTHROPIC_API_KEY=sua_chave_anthropic
# OU GROQ_API_KEY=sua_chave_groq

PORT=3001   # Opcional
```

### 3. Executar

**Terminal 1 — Backend:**

```bash
cd server
npm install
npm run dev
```

**Terminal 2 — Frontend:**

```bash
npm run dev
```

Acesse: **http://localhost:3000**

## 🧪 Testes

```bash
# Frontend
npm test

# Backend
cd server && npm test
```

Cobertura (frontend): `npm run test:coverage`

## 📁 Estrutura do projeto

```
├── src/           # Frontend React (componentes, hooks, contextos)
├── server/        # Backend Express (API de IA, middlewares, serviços)
├── supabase/      # Migrations e schema do banco
├── public/        # Assets estáticos
├── api/           # Funções serverless (Vercel)
└── docs/          # Documentação (API, design etc.)
```

## 🚀 Deploy

O app está hospedado na Vercel com deploy automático.

**URL em produção:** [https://www.nuri.app.br](https://www.nuri.app.br)

### Variáveis no Vercel

- **Frontend:** `VITE_API_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (opcionais)
- **Backend / serverless:** `GOOGLE_API_KEY` ou `ANTHROPIC_API_KEY` ou `GROQ_API_KEY` (obrigatória pelo menos uma)

## 📚 Documentação

- **[docs/PROJECT_INIT.md](./docs/PROJECT_INIT.md)** — Inicialização do projeto (visão geral, stack, fluxo, margem para melhorias — ideal para compartilhar com Claude ou nova equipe)
- **[docs/API_SETUP.md](./docs/API_SETUP.md)** — Configuração das APIs de IA (Google Gemini, Anthropic)
- **[server/README.md](./server/README.md)** — Documentação do servidor (endpoints, providers, rate limit)

## 🎯 Qualidade

- Clean code e estrutura modular
- Testes unitários e de integração (Vitest)
- Acessibilidade (WCAG)
- Performance otimizada
- Tratamento de erros robusto
- Documentação mantida

## 📝 Licença

MIT © 2026
