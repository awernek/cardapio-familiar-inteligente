# 🧪 Testes do Servidor

Guia completo sobre como executar e entender os testes do servidor.

## 📋 Índice

- [Instalação](#instalação)
- [Executando Testes](#executando-testes)
- [Estrutura de Testes](#estrutura-de-testes)
- [Cobertura](#cobertura)
- [Escrevendo Novos Testes](#escrevendo-novos-testes)

## 📦 Instalação

As dependências de teste já estão no `package.json`:

```bash
cd server
npm install
```

## 🚀 Executando Testes

### Modo Watch (Desenvolvimento)

```bash
npm test
```

Executa testes em modo watch - reexecuta quando arquivos mudam.

### Interface Visual

```bash
npm run test:ui
```

Abre interface visual do Vitest no navegador.

### Com Cobertura

```bash
npm run test:coverage
```

Executa todos os testes e gera relatório de cobertura.

## 📁 Estrutura de Testes

```
server/
├── test/
│   └── setup.js              # Setup global dos testes
├── utils/
│   └── __tests__/
│       ├── rateLimiter.test.js
│       ├── errorHandler.test.js
│       ├── parseJsonResponse.test.js
│       └── envValidation.test.js
├── services/
│   └── __tests__/
│       ├── groqService.test.js
│       ├── googleService.test.js
│       ├── anthropicService.test.js
│       └── apiProvider.test.js
└── __tests__/
    └── integration.test.js    # Testes de integração
```

## 🎯 Cobertura de Testes

### Utils (Cobertura: ~80%)

- ✅ **rateLimiter.test.js**: Testa rate limiting, limpeza automática, estatísticas
- ✅ **errorHandler.test.js**: Testa categorização, status codes, formatação
- ✅ **parseJsonResponse.test.js**: Testa parsing de JSON, remoção de markdown
- ✅ **envValidation.test.js**: Testa validação de variáveis de ambiente

### Services (Cobertura: ~70%)

- ✅ **groqService.test.js**: Testa integração Groq com mocks
- ✅ **googleService.test.js**: Testa fallback entre modelos
- ✅ **anthropicService.test.js**: Testa integração Anthropic com mocks
- ✅ **apiProvider.test.js**: Testa factory de providers, detecção, validação

### Integração (Cobertura: ~60%)

- ✅ **integration.test.js**: Testa endpoints completos
  - Health check
  - Geração de cardápio
  - Validação de entrada
  - Rate limiting
  - Sanitização
  - 404 handling

## ✍️ Escrevendo Novos Testes

### Exemplo: Teste de Utilidade

```javascript
import { describe, it, expect, beforeEach } from 'vitest';
import { minhaFuncao } from '../minhaFuncao.js';

describe('minhaFuncao', () => {
  beforeEach(() => {
    // Setup antes de cada teste
  });

  it('deve fazer algo específico', () => {
    const result = minhaFuncao('input');
    expect(result).toBe('expected');
  });
});
```

### Exemplo: Teste de Service com Mock

```javascript
import { describe, it, expect, vi } from 'vitest';
import { meuService } from '../meuService.js';

global.fetch = vi.fn();

describe('meuService', () => {
  it('deve chamar API corretamente', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: 'test' }),
    });

    const result = await meuService('input');
    expect(result).toEqual({ data: 'test' });
  });
});
```

## 🔧 Configuração

O Vitest está configurado em `vitest.config.js`:

- **Environment**: Node.js (não jsdom)
- **Globals**: Habilitado (describe, it, expect disponíveis globalmente)
- **Coverage**: v8 provider
- **Setup**: `test/setup.js` (mocks globais)

## 📊 Relatório de Cobertura

Após executar `npm run test:coverage`, o relatório estará em:

- **HTML**: `coverage/index.html`
- **JSON**: `coverage/coverage-final.json`
- **Texto**: No terminal

## 🐛 Troubleshooting

### Erro: "Cannot find module"

Certifique-se de estar na pasta `server/` ao executar os testes.

### Erros de Mock

Verifique se os mocks estão no `test/setup.js` ou no início do arquivo de teste.

### Timeout em testes

Alguns testes podem precisar de mais tempo. Use `it('teste', async () => {...}, { timeout: 5000 })`.

## 📚 Recursos

- [Documentação Vitest](https://vitest.dev/)
- [Supertest](https://github.com/visionmedia/supertest) - Para testes de integração HTTP
