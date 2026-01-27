# 🧪 Testes

Este projeto usa **Vitest** para testes unitários e de integração.

## 📦 Instalação

As dependências de teste já estão no `package.json`. Para instalar:

```bash
npm install
```

## 🚀 Executar Testes

### Modo Watch (desenvolvimento)
```bash
npm test
```

### Interface Visual
```bash
npm run test:ui
```

### Com Coverage
```bash
npm run test:coverage
```

## 📁 Estrutura de Testes

```
src/
├── utils/
│   └── __tests__/
│       ├── bmi.test.js
│       ├── menuLogic.test.js
│       ├── storage.test.js
│       └── logger.test.js
├── hooks/
│   └── __tests__/
│       ├── useGamification.test.js
│       ├── useHistory.test.js
│       └── useMenuGeneration.test.js
└── __tests__/
    └── integration.test.js
```

## ✅ Cobertura de Testes

- **Utils**: `bmi.js`, `menuLogic.js`, `storage.js`, `logger.js`
- **Hooks**: `useGamification`, `useHistory`, `useMenuGeneration`
- **Integração**: Fluxos completos de criação de perfil e geração de cardápio

## 📝 Escrevendo Novos Testes

1. Crie arquivos `.test.js` na mesma pasta do código ou em `__tests__/`
2. Use `describe` para agrupar testes relacionados
3. Use `it` ou `test` para casos de teste individuais
4. Use `expect` para asserções

Exemplo:
```javascript
import { describe, it, expect } from 'vitest';
import { minhaFuncao } from './minhaFuncao';

describe('minhaFuncao', () => {
  it('deve fazer algo corretamente', () => {
    expect(minhaFuncao('input')).toBe('output esperado');
  });
});
```

## 🔧 Configuração

A configuração do Vitest está em `vitest.config.js`. O ambiente de teste usa `jsdom` para simular o DOM do navegador.
