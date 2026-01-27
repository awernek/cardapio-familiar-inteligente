# 🖥️ Servidor Backend - Cardápio Familiar Inteligente

Servidor Express que atua como proxy para APIs de IA, gerando cardápios personalizados.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Configuração](#configuração)
- [Executando o Servidor](#executando-o-servidor)
- [APIs Suportadas](#apis-suportadas)
- [Adicionando um Novo Provider](#adicionando-um-novo-provider)
- [Endpoints](#endpoints)
- [Arquitetura](#arquitetura)
- [Desenvolvimento](#desenvolvimento)

## 🎯 Visão Geral

O servidor é um proxy inteligente que:
- Recebe prompts de cardápio do frontend
- Valida e sanitiza a entrada
- Aplica rate limiting
- Escolhe automaticamente o melhor provider de IA disponível
- Retorna cardápios em formato JSON padronizado

**Prioridade de Providers:**
1. Groq (gratuito e rápido)
2. Google Gemini (fallback entre modelos)
3. Anthropic Claude

## 📁 Estrutura do Projeto

```
server/
├── config/                 # Configurações
│   ├── constants.js        # Constantes centralizadas
│   └── cors.js             # Configuração CORS
├── middleware/             # Middlewares Express
│   ├── errorHandler.js     # Tratamento global de erros
│   └── validateRequest.js  # Validação de requisições
├── services/               # Serviços de API
│   ├── apiProvider.js      # Factory de providers
│   ├── groqService.js      # Integração Groq
│   ├── googleService.js    # Integração Google Gemini
│   └── anthropicService.js # Integração Anthropic
├── utils/                  # Utilitários
│   ├── logger.js           # Sistema de logging
│   ├── errorHandler.js     # Tratamento de erros
│   ├── errors.js           # Classes de erro customizadas
│   ├── envValidation.js    # Validação de env vars
│   ├── parseJsonResponse.js # Parsing de JSON
│   └── rateLimiter.js      # Rate limiting
├── index.js                # Entry point do servidor
├── package.json
└── README.md               # Este arquivo
```

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na pasta `server/` (copie de `.env.example`):

```env
# Obrigatória: Pelo menos uma API key
GROQ_API_KEY=sua_chave_groq
# OU
GOOGLE_API_KEY=sua_chave_google
# OU
ANTHROPIC_API_KEY=sua_chave_anthropic

# Opcional
PORT=3001
```

### Obter API Keys

- **Groq**: https://console.groq.com/ (gratuito)
- **Google**: https://makersuite.google.com/app/apikey
- **Anthropic**: https://console.anthropic.com/

## 🚀 Executando o Servidor

### Desenvolvimento

```bash
cd server
npm install
npm run dev
```

O servidor estará disponível em `http://localhost:3001`

### Produção

```bash
npm start
```

## 🔌 APIs Suportadas

### Groq (Recomendado)
- **Modelo**: Llama 3.3 70B
- **Vantagens**: Gratuito, rápido, JSON nativo
- **Limites**: Generosos para uso gratuito

### Google Gemini
- **Modelos**: gemini-2.0-flash, gemini-1.5-flash-latest, gemini-pro
- **Vantagens**: Fallback automático entre modelos
- **Limites**: Depende do plano

### Anthropic Claude
- **Modelo**: Claude Sonnet 4
- **Vantagens**: Alta qualidade
- **Limites**: Depende do plano

## ➕ Adicionando um Novo Provider

Para adicionar um novo provider de IA:

1. **Criar o service** (`services/novoProviderService.js`):
```javascript
import { parseJsonResponse } from '../utils/parseJsonResponse.js';
import { logger } from '../utils/logger.js';

export async function generateMenuWithNovoProvider(prompt, apiKey) {
  // Implementar chamada à API
  const response = await fetch('...', { ... });
  const content = await response.json();
  return parseJsonResponse(content, { provider: 'NovoProvider' });
}
```

2. **Adicionar no `apiProvider.js`**:
```javascript
import { generateMenuWithNovoProvider } from './novoProviderService.js';

// Adicionar na prioridade
const apiKeys = {
  // ...
  novoProviderKey: process.env.NOVO_PROVIDER_API_KEY || null,
};

// Adicionar no switch de generateMenu()
case 'novoProvider':
  return await generateMenuWithNovoProvider(prompt, apiKey);
```

3. **Adicionar constantes** em `config/constants.js`:
```javascript
export const API_ENDPOINTS = {
  // ...
  NOVO_PROVIDER: 'https://api.novoprovider.com/...',
};
```

4. **Atualizar validação** em `utils/envValidation.js`:
```javascript
const apiKeys = {
  // ...
  NOVO_PROVIDER_API_KEY: process.env.NOVO_PROVIDER_API_KEY,
};
```

## 📡 Endpoints

### POST /api/generate-menu

Gera um cardápio personalizado.

**Request:**
```json
{
  "prompt": "Gere um cardápio semanal para família de 4 pessoas..."
}
```

**Response 200:**
```json
{
  "days": [
    {
      "day": "Segunda-feira",
      "meals": { ... }
    }
  ],
  "shoppingList": [ ... ]
}
```

**Response 400:**
```json
{
  "error": "Prompt não fornecido"
}
```

**Response 429:**
```json
{
  "error": "Muitas requisições. Aguarde um momento antes de tentar novamente.",
  "retryAfter": 3600
}
```

### GET /api/health

Health check do servidor.

**Response 200:**
```json
{
  "status": "ok",
  "message": "Servidor funcionando"
}
```

### GET /api/metrics

Retorna métricas detalhadas do rate limiter (útil para monitoramento).

**Response 200:**
```json
{
  "totalRequests": 150,
  "blockedRequests": 5,
  "uniqueIps": 25,
  "currentlyBlocked": 2,
  "activeRecords": 10,
  "lastCleanup": "2026-01-27T10:30:00.000Z",
  "cleanupCount": 3,
  "blockRate": "3.33%"
}
```

## 🏗️ Arquitetura

### Fluxo de Requisição

```
Cliente
  ↓
CORS Middleware
  ↓
JSON Parser
  ↓
Validate Request (sanitiza prompt)
  ↓
Rate Limiter
  ↓
API Provider Factory (escolhe provider)
  ↓
Service (Groq/Google/Anthropic)
  ↓
Parse JSON Response
  ↓
Resposta ao Cliente
```

### Tratamento de Erros

```
Erro ocorre
  ↓
Error Handler (categoriza erro)
  ↓
Error Middleware (formata resposta)
  ↓
Resposta de erro ao cliente
```

## 🛠️ Desenvolvimento

### Logs

O servidor usa um sistema de logging condicional:
- **Desenvolvimento**: Todos os logs são exibidos
- **Produção**: Apenas erros são logados

```javascript
import { logger } from './utils/logger.js';

logger.log('Mensagem informativa');
logger.warn('Aviso');
logger.error('Erro');
logger.debug('Debug (apenas dev)');
```

### Rate Limiting

- **Limite**: 20 requisições por hora por IP
- **Limpeza automática**: Registros expirados são removidos a cada 30 minutos
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`
- **Detecção de IP**: Suporte a proxies reversos (X-Forwarded-For, X-Real-IP)
- **Métricas**: Endpoint `/api/metrics` para monitoramento detalhado

**Detecção de IP (ordem de prioridade):**
1. `X-Forwarded-For` (primeiro IP da lista)
2. `X-Real-IP`
3. `req.ip` (Express)
4. `req.connection.remoteAddress` (fallback)
5. `'unknown'` (se nenhum disponível)

### Validação

- **Tamanho mínimo**: 10 caracteres
- **Tamanho máximo**: 50.000 caracteres
- **Sanitização**: Remove caracteres de controle e normaliza espaços

### Tratamento de Erros

O servidor categoriza erros automaticamente:
- **API**: Erros de APIs externas (502)
- **VALIDATION**: Erros de validação (400)
- **RATE_LIMIT**: Rate limit excedido (429)
- **SYSTEM**: Erros internos (500)

## 📚 Documentação Adicional

- **[ANÁLISE_SERVIDOR.md](./ANÁLISE_SERVIDOR.md)**: Análise detalhada do servidor
- **[PLANO_SPRINTS.md](./PLANO_SPRINTS.md)**: Plano das melhorias implementadas

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📝 Licença

MIT © 2026
