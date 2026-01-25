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

| Variável | Descrição |
|----------|-----------|
| `GROQ_API_KEY` | Chave da API Groq |
| `VITE_SUPABASE_URL` | URL do projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Chave anon do Supabase |

## 💻 Desenvolvimento Local

### 1. Clonar e instalar

```bash
git clone https://github.com/awernek/cardapio-familiar-inteligente.git
cd cardapio-familiar-inteligente
npm install
```

### 2. Configurar variáveis

Crie um arquivo `.env` na raiz:

```env
VITE_API_URL=http://localhost:3001
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anon
```

E um arquivo `server/.env`:

```env
GROQ_API_KEY=sua_chave_groq
```

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
