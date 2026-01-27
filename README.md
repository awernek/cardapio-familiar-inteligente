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
- **Histórico**: Acompanhe a evolução das semanas anteriores
- **Gamificação**: Conquistas e missões para manter a motivação

## 🛠️ Stack

**Frontend:** React 18, Vite, Tailwind CSS  
**Backend:** Express, Node.js (servidor local)  
**IA:** Groq (Llama 3.3), Google Gemini, Anthropic Claude  
**Banco:** Supabase  
**Hospedagem:** Vercel  
**Testes:** Vitest

## 💻 Desenvolvimento Local

### 1. Clonar e instalar

```bash
git clone https://github.com/awernek/cardapio-familiar-inteligente.git
cd cardapio-familiar-inteligente
npm install
```

### 2. Configurar variáveis

**Frontend** - Crie `.env` na raiz:
```env
VITE_API_URL=http://localhost:3001
VITE_SUPABASE_URL=sua_url_supabase  # Opcional
VITE_SUPABASE_ANON_KEY=sua_chave_anon  # Opcional
```

**Backend** - Crie `server/.env`:
```env
GROQ_API_KEY=sua_chave_groq  # Ou GOOGLE_API_KEY ou ANTHROPIC_API_KEY
PORT=3001  # Opcional
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

## 🧪 Testes

```bash
# Frontend
npm test

# Backend
cd server && npm test
```

## 📁 Estrutura

```
├── src/              # Frontend React
├── server/           # Backend Express (modularizado)
├── supabase/         # Migrations e schema
└── public/           # Assets estáticos
```

## 🚀 Deploy

O app está hospedado na Vercel com deploy automático.

**URL:** https://cardapio-familiar-inteligente.vercel.app

### Variáveis de Ambiente (Vercel)

**Frontend:** `VITE_API_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (opcionais)  
**Backend:** `GROQ_API_KEY` ou `GOOGLE_API_KEY` ou `ANTHROPIC_API_KEY` (obrigatória)

## 📚 Documentação

- **[PLANO_SPRINTS.md](./PLANO_SPRINTS.md)**: Melhorias do frontend (8 sprints)
- **[server/README.md](./server/README.md)**: Documentação completa do servidor
- **[server/PLANO_SPRINTS.md](./server/PLANO_SPRINTS.md)**: Melhorias do backend (8 sprints)

## 🎯 Qualidade

- ✅ Clean Code e estrutura modular
- ✅ Testes unitários e de integração
- ✅ Acessibilidade (WCAG)
- ✅ Performance otimizada
- ✅ Error handling robusto
- ✅ Documentação completa

## 📝 Licença

MIT © 2026
