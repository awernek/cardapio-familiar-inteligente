# Cardápio Familiar Inteligente

MVP para criar cardápios familiares personalizados com resposta de IA e também de um nutricionista.

## 🚀 Características

- **Mobile First**: Design responsivo otimizado para dispositivos móveis
- **Cross-browser**: Compatível com todos os principais navegadores
- **Código Limpo**: Estrutura organizada com componentes reutilizáveis
- **React Moderno**: Utilizando React 18 com hooks e componentes funcionais
- **Tailwind CSS**: Estilização moderna e responsiva

## 📋 Funcionalidades

1. **Perfis da Família**: Cadastro de múltiplos membros com dados físicos e objetivos
2. **Questionários Individuais**: Avaliação semanal de estresse, sono, energia e apetite
3. **Contexto Semanal**: Informações sobre correria, orçamento e tempo disponível
4. **Geração de Cardápio**: Cardápio personalizado gerado por IA (Google Gemini ou Claude)
5. **Relatório Completo**: Relatório detalhado para compartilhar com nutricionista
6. **Histórico**: Acompanhamento de semanas anteriores

## 🛠️ Tecnologias

- **React 18**: Biblioteca JavaScript para interfaces
- **Vite**: Build tool rápida e moderna
- **Tailwind CSS**: Framework CSS utility-first
- **Lucide React**: Ícones modernos
- **Express**: Backend proxy para APIs de IA
- **Google Gemini API**: Geração de cardápios com IA (recomendado - gratuita)
- **Anthropic Claude API**: Alternativa para geração de cardápios

## 📦 Instalação

### 1. Instalar dependências do frontend

```bash
npm install
```

### 2. Instalar dependências do servidor

```bash
cd server
npm install
cd ..
```

## 🔧 Configuração

### Passo 1: Configurar o Backend (Servidor)

1. **Entre na pasta do servidor:**
   ```bash
   cd server
   ```

2. **Crie o arquivo `.env`:**
   ```bash
   cp .env.example .env
   ```

3. **Configure sua chave de API no `.env` do servidor:**
   
   **Opção 1: Google Gemini (Recomendado - Gratuito) ⭐**
   ```env
   GOOGLE_API_KEY=sua_chave_google_aqui
   ```
   - Obtenha em: https://aistudio.google.com/apikey
   
   **Opção 2: Anthropic Claude (Alternativa)**
   ```env
   ANTHROPIC_API_KEY=sua_chave_anthropic_aqui
   ```
   - Obtenha em: https://console.anthropic.com/

4. **Volte para a raiz do projeto:**
   ```bash
   cd ..
   ```

### Passo 2: Configurar o Frontend

1. **Crie o arquivo `.env` na raiz do projeto:**
   ```bash
   cp .env.example .env
   ```

2. **O arquivo `.env` do frontend já está configurado corretamente:**
   ```env
   VITE_API_URL=http://localhost:3001
   ```

## 🚀 Como Executar

### Terminal 1: Iniciar o Servidor Backend

```bash
cd server
npm run dev
```

Você verá: `🚀 Servidor rodando em http://localhost:3001`

### Terminal 2: Iniciar o Frontend

```bash
npm run dev
```

Acesse: http://localhost:3000

## 📱 Estrutura do Projeto

```
cardápio-familiar-inteligente/
├── server/                 # Backend (Express)
│   ├── index.js           # Servidor proxy
│   ├── package.json       # Dependências do servidor
│   └── .env               # Chaves de API (NÃO commitar!)
├── src/                   # Frontend (React)
│   ├── components/        # Componentes React
│   ├── hooks/            # Hooks customizados
│   ├── utils/            # Funções utilitárias
│   └── App.jsx          # Componente principal
├── .env                  # Configuração do frontend
└── package.json          # Dependências do frontend
```

## 🎨 Design

- **Mobile First**: Layout otimizado para telas pequenas primeiro
- **Responsivo**: Adapta-se perfeitamente a tablets e desktops
- **Acessível**: Contraste adequado e navegação por teclado
- **Moderno**: Interface limpa e intuitiva

## 🌐 Compatibilidade

Testado e funcionando em:
- ✅ Chrome/Edge (últimas versões)
- ✅ Firefox (últimas versões)
- ✅ Safari (últimas versões)
- ✅ Opera (últimas versões)
- ✅ Navegadores mobile (iOS Safari, Chrome Mobile)

## ⚠️ Por que precisa de um servidor?

As APIs de IA (Google Gemini e Anthropic Claude) **não permitem** requisições diretas do navegador por questões de segurança (CORS). O servidor backend atua como um **proxy seguro** que:

- ✅ Mantém as chaves de API seguras (não expostas no frontend)
- ✅ Resolve problemas de CORS
- ✅ Permite controle de rate limiting
- ✅ Adiciona uma camada de segurança

## 🔐 Segurança

⚠️ **IMPORTANTE**: 
- Nunca commite arquivos `.env` com chaves reais
- As chaves de API devem estar **apenas no servidor** (`server/.env`)
- O frontend não precisa e não deve ter as chaves de API

## 🚀 Deploy na Vercel (Gratuito)

### Passo 1: Criar conta na Vercel
1. Acesse [vercel.com](https://vercel.com)
2. Faça login com sua conta GitHub

### Passo 2: Conectar o repositório
1. Clique em **"Add New Project"**
2. Selecione o repositório `cardapio-familiar-inteligente`
3. A Vercel detectará automaticamente que é um projeto Vite

### Passo 3: Configurar variáveis de ambiente
Antes de fazer o deploy, configure as variáveis:

1. Clique em **"Environment Variables"**
2. Adicione sua chave de API:
   - **Name:** `GROQ_API_KEY`
   - **Value:** `sua_chave_groq_aqui`
   
   (ou use `GOOGLE_API_KEY` ou `ANTHROPIC_API_KEY`)

3. Adicione as variáveis do Supabase:
   - **Name:** `VITE_SUPABASE_URL`
   - **Value:** `sua_url_supabase`
   - **Name:** `VITE_SUPABASE_ANON_KEY`
   - **Value:** `sua_chave_anon`

### Passo 4: Deploy
1. Clique em **"Deploy"**
2. Aguarde o build (cerca de 1-2 minutos)
3. Pronto! Seu app estará online em `seu-projeto.vercel.app`

### Estrutura para Vercel

```
cardápio-familiar-inteligente/
├── api/                    # Serverless Functions (Vercel)
│   ├── generate-menu.js   # Endpoint de geração
│   └── health.js          # Health check
├── vercel.json            # Configuração da Vercel
├── src/                   # Frontend React
└── ...
```

### Domínio Personalizado (Opcional)
1. Vá em **Settings > Domains**
2. Adicione seu domínio (ex: `cardapiofamiliar.com.br`)
3. Configure o DNS conforme instruções

## 📝 Licença

Este projeto é um MVP desenvolvido para uso pessoal/familiar.

## 🤝 Contribuindo

Este é um projeto MVP. Sugestões e melhorias são bem-vindas!
