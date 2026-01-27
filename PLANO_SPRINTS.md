# 🚀 Plano de Sprints - Melhorias de Código

**Projeto:** Cardápio Familiar Inteligente  
**Objetivo:** Implementar melhorias de clean code, performance e qualidade

---

## 📅 **Estrutura das Sprints**

Cada sprint terá duração estimada de **2-3 dias** e focará em melhorias relacionadas.

---

## 🎯 **SPRINT 1: Fundação e Logging** 
**Prioridade:** 🔥 Crítica  
**Duração:** 2-3 dias  
**Objetivo:** Criar base sólida para as próximas melhorias

### Tarefas:
1. ✅ Criar sistema de logging condicional (`src/utils/logger.js`)
2. ✅ Substituir todos os `console.log` por `logger.log`
3. ✅ Substituir `console.error` por `logger.error` (manter em produção)
4. ✅ Criar arquivo de constantes (`src/constants/`)
   - `steps.js` - Constantes dos steps
   - `index.js` - Export centralizado
5. ✅ Substituir strings mágicas por constantes

### Critérios de Aceite:
- [ ] Zero `console.log` no código (exceto logger)
- [ ] Sistema de logging funcionando em dev e prod
- [ ] Constantes centralizadas e sendo usadas
- [ ] Código compila sem erros

### Arquivos a Modificar:
- `src/utils/logger.js` (novo)
- `src/constants/steps.js` (novo)
- `src/constants/index.js` (novo)
- `src/App.jsx`
- `src/hooks/useMenuGeneration.js`
- `src/hooks/useGamification.js`
- `src/components/steps/WeeklyContextStep.jsx`
- `src/contexts/AuthContext.jsx`
- `src/services/menuService.js`
- `src/utils/storage.js`
- `src/hooks/useHistory.js`

---

## 🎯 **SPRINT 2: Validação de Tipos e Estruturas**
**Prioridade:** 🔥 Alta  
**Duração:** 2-3 dias  
**Objetivo:** Adicionar validação de tipos e definir estruturas de dados

### Tarefas:
1. ✅ Instalar PropTypes (`npm install prop-types`)
2. ✅ Criar arquivo de tipos/interfaces (`src/types/index.js`)
3. ✅ Adicionar PropTypes aos componentes principais:
   - `App.jsx`
   - `MenuStep.jsx`
   - `ProfilesStep.jsx`
   - `QuestionnaireStep.jsx`
   - `WeeklyContextStep.jsx`
   - `ReportStep.jsx`
   - `ProgressStep.jsx`
4. ✅ Adicionar PropTypes aos hooks customizados
5. ✅ Documentar estruturas de dados principais

### Critérios de Aceite:
- [ ] PropTypes instalado e configurado
- [ ] Todos os componentes principais com PropTypes
- [ ] Tipos documentados em `src/types/`
- [ ] Warnings do React sobre props ausentes resolvidos

### Arquivos a Modificar:
- `package.json` (adicionar prop-types)
- `src/types/index.js` (novo)
- Todos os componentes em `src/components/`
- Hooks em `src/hooks/`

---

## 🎯 **SPRINT 3: Refatoração de Componentes Grandes**
**Prioridade:** 🔥 Alta  
**Duração:** 3-4 dias  
**Objetivo:** Quebrar componentes grandes em componentes menores e reutilizáveis

### Tarefas:
1. ✅ Refatorar `App.jsx` (340 linhas)
   - Extrair lógica de navegação para hook `useAppNavigation`
   - Criar componente `AppRouter` para gerenciar steps
   - Extrair lógica de inicialização
2. ✅ Refatorar `MenuStep.jsx` (386 linhas)
   - Extrair `DayCard` component
   - Extrair `ShoppingList` component
   - Extrair `MenuActions` component
   - Extrair `CostEstimate` component
3. ✅ Extrair função `buildPrompt` de `useMenuGeneration.js`
   - Criar `src/utils/promptBuilder.js`
   - Mover toda lógica de construção de prompt

### Critérios de Aceite:
- [ ] `App.jsx` com menos de 200 linhas
- [ ] `MenuStep.jsx` com menos de 250 linhas
- [ ] Componentes extraídos são reutilizáveis
- [ ] Funcionalidade mantida 100%
- [ ] Código mais testável

### Arquivos a Criar:
- `src/hooks/useAppNavigation.js`
- `src/components/steps/MenuStep/DayCard.jsx`
- `src/components/steps/MenuStep/ShoppingList.jsx`
- `src/components/steps/MenuStep/MenuActions.jsx`
- `src/components/steps/MenuStep/CostEstimate.jsx`
- `src/utils/promptBuilder.js`

### Arquivos a Modificar:
- `src/App.jsx`
- `src/components/steps/MenuStep.jsx`
- `src/hooks/useMenuGeneration.js`

---

## 🎯 **SPRINT 4: Performance e Otimizações**
**Prioridade:** 🟡 Média  
**Duração:** 2-3 dias  
**Objetivo:** Otimizar renderizações e melhorar performance

### Tarefas:
1. ✅ Adicionar `useMemo` para cálculos pesados:
   - `generateWeeklyPriorities` em `App.jsx`
   - `generateInsights` em `App.jsx`
   - Cálculos de BMI
2. ✅ Adicionar `useCallback` para funções passadas como props
3. ✅ Implementar lazy loading de componentes pesados:
   - `MenuStep` (lazy)
   - `ReportStep` (lazy)
   - `ProgressStep` (lazy)
4. ✅ Otimizar re-renderizações desnecessárias

### Critérios de Aceite:
- [ ] Cálculos pesados memoizados
- [ ] Funções estáveis com useCallback
- [ ] Lazy loading implementado
- [ ] Performance melhorada (medir com React DevTools)

### Arquivos a Modificar:
- `src/App.jsx`
- `src/components/steps/MenuStep.jsx`
- `src/components/steps/ReportStep.jsx`
- `src/components/steps/ProgressStep.jsx`
- `src/utils/menuLogic.js`

---

## 🎯 **SPRINT 5: Segurança e Variáveis de Ambiente**
**Prioridade:** 🟡 Média  
**Duração:** 1-2 dias  
**Objetivo:** Mover secrets para variáveis de ambiente e melhorar segurança

### Tarefas:
1. ✅ Mover API key do Web3Forms para variável de ambiente
2. ✅ Criar `.env.example` atualizado
3. ✅ Adicionar validação de variáveis de ambiente no startup
4. ✅ Documentar variáveis necessárias no README
5. ✅ Adicionar validação de inputs mais robusta (opcional: Zod)

### Critérios de Aceite:
- [ ] Nenhuma API key hardcoded
- [ ] `.env.example` completo
- [ ] Validação de env vars no startup
- [ ] README atualizado com todas as variáveis

### Arquivos a Modificar:
- `src/components/LandingPage.jsx`
- `.env.example`
- `README.md`
- `src/main.jsx` (validação de env)

---

## 🎯 **SPRINT 6: Tratamento de Erros e Error Boundaries**
**Prioridade:** 🟡 Média  
**Duração:** 2 dias  
**Objetivo:** Melhorar tratamento de erros e adicionar Error Boundaries

### Tarefas:
1. ✅ Criar componente `ErrorBoundary`
2. ✅ Adicionar Error Boundary no `App.jsx`
3. ✅ Padronizar mensagens de erro
4. ✅ Criar utilitário de tratamento de erros (`src/utils/errorHandler.js`)
5. ✅ Melhorar feedback de erros ao usuário

### Critérios de Aceite:
- [ ] Error Boundary funcionando
- [ ] Erros padronizados e amigáveis
- [ ] Usuário recebe feedback claro em caso de erro
- [ ] Erros críticos logados adequadamente

### Arquivos a Criar:
- `src/components/ErrorBoundary.jsx`
- `src/utils/errorHandler.js`

### Arquivos a Modificar:
- `src/App.jsx`
- `src/main.jsx`
- Componentes que fazem fetch/operações assíncronas

---

## 🎯 **SPRINT 7: Testes Básicos**
**Prioridade:** 🔥 Alta  
**Duração:** 3-4 dias  
**Objetivo:** Adicionar testes unitários e de integração básicos

### Tarefas:
1. ✅ Configurar Vitest ou Jest
2. ✅ Criar testes para utils:
   - `menuLogic.js`
   - `bmi.js`
   - `storage.js`
   - `logger.js`
3. ✅ Criar testes para hooks:
   - `useGamification.js`
   - `useHistory.js`
   - `useMenuGeneration.js` (mock da API)
4. ✅ Criar testes de integração básicos:
   - Fluxo de criação de perfil
   - Fluxo de geração de cardápio (mock)

### Critérios de Aceite:
- [ ] Framework de testes configurado
- [ ] Cobertura mínima de 60% em utils
- [ ] Testes para hooks críticos
- [ ] Testes passando no CI/CD (se houver)

### Arquivos a Criar:
- `vitest.config.js` ou `jest.config.js`
- `src/utils/__tests__/menuLogic.test.js`
- `src/utils/__tests__/bmi.test.js`
- `src/hooks/__tests__/useGamification.test.js`
- `src/hooks/__tests__/useHistory.test.js`

---

## 🎯 **SPRINT 8: Acessibilidade e UX**
**Prioridade:** 🟢 Baixa  
**Duração:** 2 dias  
**Objetivo:** Melhorar acessibilidade e experiência do usuário

### Tarefas:
1. ✅ Adicionar ARIA labels aos componentes principais
2. ✅ Melhorar navegação por teclado
3. ✅ Adicionar roles semânticos
4. ✅ Testar com leitores de tela (básico)
5. ✅ Melhorar contraste de cores (se necessário)

### Critérios de Aceite:
- [ ] Componentes principais com ARIA labels
- [ ] Navegação por teclado funcional
- [ ] HTML semântico correto
- [ ] Score de acessibilidade melhorado (Lighthouse)

### Arquivos a Modificar:
- Todos os componentes em `src/components/`

---

## 📊 **Resumo das Sprints**

| Sprint | Prioridade | Duração | Foco Principal |
|--------|-----------|---------|----------------|
| **Sprint 1** | 🔥 Crítica | 2-3 dias | Logging e Constantes |
| **Sprint 2** | 🔥 Alta | 2-3 dias | Validação de Tipos |
| **Sprint 3** | 🔥 Alta | 3-4 dias | Refatoração |
| **Sprint 4** | 🟡 Média | 2-3 dias | Performance |
| **Sprint 5** | 🟡 Média | 1-2 dias | Segurança |
| **Sprint 6** | 🟡 Média | 2 dias | Error Handling |
| **Sprint 7** | 🔥 Alta | 3-4 dias | Testes |
| **Sprint 8** | 🟢 Baixa | 2 dias | Acessibilidade |

**Total Estimado:** 17-24 dias úteis (3-5 semanas)

---

## 🎯 **Ordem Recomendada de Execução**

### Fase 1 - Fundação (Sprints 1-2)
**Semana 1-2:** Criar base sólida
- Sprint 1: Logging e Constantes
- Sprint 2: Validação de Tipos

### Fase 2 - Refatoração (Sprint 3)
**Semana 3:** Melhorar estrutura
- Sprint 3: Refatoração de Componentes

### Fase 3 - Qualidade (Sprints 4-6)
**Semana 4:** Melhorias de qualidade
- Sprint 4: Performance
- Sprint 5: Segurança
- Sprint 6: Error Handling

### Fase 4 - Testes e Acessibilidade (Sprints 7-8)
**Semana 5:** Finalização
- Sprint 7: Testes
- Sprint 8: Acessibilidade

---

## ✅ **Checklist de Progresso**

- [x] Sprint 1: Fundação e Logging ✅ **CONCLUÍDA**
- [x] Sprint 2: Validação de Tipos ✅ **CONCLUÍDA**
- [x] Sprint 3: Refatoração de Componentes ✅ **CONCLUÍDA**
- [x] Sprint 4: Performance ✅ **CONCLUÍDA**
- [x] Sprint 5: Segurança ✅ **CONCLUÍDA**
- [x] Sprint 6: Error Handling ✅ **CONCLUÍDA**
- [x] Sprint 7: Testes ✅ **CONCLUÍDA**
- [x] Sprint 8: Acessibilidade ✅ **CONCLUÍDA**

---

## 📝 **Notas**

- Cada sprint pode ser ajustado conforme necessidade
- Algumas tarefas podem ser feitas em paralelo
- Priorize sprints críticas (1, 2, 3, 7) se houver limitação de tempo
- Teste após cada sprint antes de prosseguir

---

**Pronto para começar? Vamos iniciar pela Sprint 1! 🚀**
