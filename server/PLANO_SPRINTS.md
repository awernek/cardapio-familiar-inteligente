# 🚀 Plano de Sprints - Melhorias do Backend

**Projeto:** Cardápio Familiar Inteligente - Backend  
**Objetivo:** Implementar melhorias de clean code, modularização e qualidade no servidor

---

## 📅 **Estrutura das Sprints**

Cada sprint terá duração estimada de **2-3 dias** e focará em melhorias relacionadas.

---

## 🎯 **SPRINT 1: Fundação e Logging**
**Prioridade:** 🔥 Crítica  
**Duração:** 2-3 dias  
**Objetivo:** Criar base sólida para as próximas melhorias

### Tarefas:
1. Criar sistema de logging condicional (`utils/logger.js`)
   - Similar ao frontend, mas adaptado para Node.js
   - Níveis: info, warn, error, debug
   - Logs estruturados com timestamps
2. Substituir todos os `console.log` por `logger.log`
3. Substituir `console.error` por `logger.error`
4. Criar arquivo de constantes (`config/constants.js`)
   - Rate limit configs
   - API endpoints
   - Mensagens de erro
   - Timeouts

### Critérios de Aceite:
- [x] Zero `console.log` no código (exceto logger)
- [x] Sistema de logging funcionando em dev e prod
- [x] Constantes centralizadas e sendo usadas
- [x] Servidor compila e roda sem erros

### Arquivos a Criar/Modificar:
- `server/utils/logger.js` (novo)
- `server/config/constants.js` (novo)
- `server/index.js` (modificar)

---

## 🎯 **SPRINT 2: Modularização - Utils e Config**
**Prioridade:** 🔥 Alta  
**Duração:** 2-3 dias  
**Objetivo:** Extrair utilitários e configurações

### Tarefas:
1. Criar `utils/rateLimiter.js`
   - Mover lógica de rate limiting
   - Adicionar limpeza automática de registros expirados
   - JSDoc completo
2. Criar `utils/errorHandler.js`
   - Tratamento centralizado de erros
   - Categorização de erros (API, validação, sistema)
   - Mensagens amigáveis
3. Criar `utils/parseJsonResponse.js`
   - Função para parsing comum de JSON
   - Tratamento de markdown code blocks
   - Validação de JSON válido
4. Criar `config/cors.js`
   - Extrair configuração CORS
   - Centralizar allowed origins

### Critérios de Aceite:
- [x] Rate limiter modularizado e testado
- [x] Error handler centralizado funcionando
- [x] Parsing de JSON unificado
- [x] CORS configurado em módulo separado
- [x] Código mais limpo e organizado

### Arquivos a Criar/Modificar:
- `server/utils/rateLimiter.js` (novo)
- `server/utils/errorHandler.js` (novo)
- `server/utils/parseJsonResponse.js` (novo)
- `server/config/cors.js` (novo)
- `server/index.js` (refatorar)

---

## 🎯 **SPRINT 3: Modularização - Services**
**Prioridade:** 🔥 Alta  
**Duração:** 2-3 dias  
**Objetivo:** Separar integrações de API em serviços independentes

### Tarefas:
1. Criar `services/groqService.js`
   - Extrair lógica de chamada Groq
   - Usar `parseJsonResponse` comum
   - Tratamento de erros específico
2. Criar `services/googleService.js`
   - Extrair lógica de chamada Google Gemini
   - Fallback entre modelos
   - Usar `parseJsonResponse` comum
3. Criar `services/anthropicService.js`
   - Extrair lógica de chamada Anthropic
   - Usar `parseJsonResponse` comum
4. Criar `services/apiProvider.js`
   - Factory para escolher provider
   - Validação de API keys
   - Detecção automática de provider disponível

### Critérios de Aceite:
- [x] Cada service isolado e testável
- [x] Código duplicado eliminado
- [x] Provider factory funcionando
- [x] Todas as APIs funcionando corretamente

### Arquivos a Criar/Modificar:
- `server/services/groqService.js` (novo)
- `server/services/googleService.js` (novo)
- `server/services/anthropicService.js` (novo)
- `server/services/apiProvider.js` (novo)
- `server/index.js` (refatorar)

---

## 🎯 **SPRINT 4: Validação e Segurança**
**Prioridade:** 🔥 Alta  
**Duração:** 2-3 dias  
**Objetivo:** Melhorar validação de entrada e segurança

### Tarefas:
1. Criar `utils/envValidation.js`
   - Validar variáveis de ambiente no startup
   - Verificar API keys obrigatórias
   - Warnings para variáveis opcionais
2. Criar `middleware/validateRequest.js`
   - Validação robusta do body
   - Sanitização de entrada
   - Validação de tipos e estrutura
   - Limites de tamanho
3. Melhorar validação de prompt
   - Verificar estrutura esperada
   - Validar tipos de dados
   - Sanitizar conteúdo

### Critérios de Aceite:
- [x] Validação de env vars no startup
- [x] Middleware de validação funcionando
- [x] Entrada sanitizada e validada
- [x] Mensagens de erro claras

### Arquivos a Criar/Modificar:
- `server/utils/envValidation.js` (novo)
- `server/middleware/validateRequest.js` (novo)
- `server/index.js` (adicionar middleware)

---

## 🎯 **SPRINT 5: Tratamento de Erros Avançado**
**Prioridade:** ⚠️ Média  
**Duração:** 2-3 dias  
**Objetivo:** Melhorar tratamento e categorização de erros

### Tarefas:
1. Expandir `utils/errorHandler.js`
   - Categorização de erros (API, validação, sistema, rate limit)
   - Códigos de status HTTP apropriados
   - Logging estruturado de erros
2. Criar classes de erro customizadas
   - `ApiError` - Erros de APIs externas
   - `ValidationError` - Erros de validação
   - `RateLimitError` - Erros de rate limit
3. Middleware de tratamento de erros global
   - Capturar erros não tratados
   - Formatar resposta de erro
   - Logging automático

### Critérios de Aceite:
- [x] Erros categorizados corretamente
- [x] Mensagens amigáveis ao usuário
- [x] Logs estruturados para debug
- [x] Middleware de erro funcionando

### Arquivos a Criar/Modificar:
- `server/utils/errorHandler.js` (expandir)
- `server/utils/errors.js` (novo - classes de erro)
- `server/middleware/errorHandler.js` (novo)
- `server/index.js` (adicionar middleware)

---

## 🎯 **SPRINT 6: Documentação e JSDoc**
**Prioridade:** ⚠️ Média  
**Duração:** 1-2 dias  
**Objetivo:** Documentar código com JSDoc

### Tarefas:
1. Adicionar JSDoc em todas as funções principais
   - Parâmetros e tipos
   - Valores de retorno
   - Exemplos de uso
   - Possíveis erros
2. Documentar módulos e serviços
   - Descrição de propósito
   - Dependências
   - Exemplos de uso
3. Criar `README.md` no servidor
   - Estrutura do projeto
   - Como adicionar novo provider
   - Como testar localmente

### Critérios de Aceite:
- [x] Todas as funções principais documentadas
- [x] JSDoc completo e consistente
- [x] README.md criado e útil
- [x] Documentação clara para novos desenvolvedores

### Arquivos a Criar/Modificar:
- `server/README.md` (novo)
- Todos os arquivos de utils, services, middleware (adicionar JSDoc)

---

## 🎯 **SPRINT 7: Testes Básicos**
**Prioridade:** ⚠️ Média  
**Duração:** 3-4 dias  
**Objetivo:** Adicionar testes unitários e de integração

### Tarefas:
1. Configurar ambiente de testes
   - Instalar Vitest ou Jest
   - Configurar setup e teardown
   - Mocks para APIs externas
2. Testes para utils
   - `rateLimiter.test.js`
   - `errorHandler.test.js`
   - `parseJsonResponse.test.js`
   - `envValidation.test.js`
3. Testes para services
   - `groqService.test.js` (com mocks)
   - `googleService.test.js` (com mocks)
   - `anthropicService.test.js` (com mocks)
4. Testes de integração
   - Endpoint `/api/generate-menu`
   - Health check
   - Rate limiting

### Critérios de Aceite:
- [x] Ambiente de testes configurado
- [x] Cobertura mínima de 60% em utils
- [x] Testes de integração funcionando
- [ ] CI/CD configurado (opcional)

### Arquivos a Criar/Modificar:
- `server/vitest.config.js` (novo)
- `server/utils/__tests__/*.test.js` (novos)
- `server/services/__tests__/*.test.js` (novos)
- `server/__tests__/integration.test.js` (novo)
- `server/package.json` (adicionar scripts de teste)

---

## 🎯 **SPRINT 8: Melhorias de Rate Limiting**
**Prioridade:** ⚠️ Baixa  
**Duração:** 2-3 dias  
**Objetivo:** Melhorar rate limiting com limpeza automática

### Tarefas:
1. Adicionar limpeza periódica de registros expirados
   - Intervalo configurável
   - Remover registros antigos automaticamente
   - Prevenir memory leaks
2. Melhorar detecção de IP
   - Suporte a proxies reversos
   - Headers confiáveis
3. Adicionar métricas (opcional)
   - Contador de requisições
   - IPs bloqueados
   - Estatísticas de uso

### Critérios de Aceite:
- [x] Limpeza automática funcionando
- [x] Sem memory leaks
- [x] Detecção de IP melhorada
- [x] Rate limiting mais robusto

### Arquivos a Criar/Modificar:
- `server/utils/rateLimiter.js` (melhorar)
- `server/index.js` (ajustar se necessário)

---

## 📊 **Resumo das Sprints**

| Sprint | Foco | Prioridade | Duração |
|--------|------|------------|---------|
| 1 | Logging e Constantes | 🔥 Crítica | 2-3 dias |
| 2 | Modularização - Utils | 🔥 Alta | 2-3 dias |
| 3 | Modularização - Services | 🔥 Alta | 2-3 dias |
| 4 | Validação e Segurança | 🔥 Alta | 2-3 dias |
| 5 | Tratamento de Erros | ⚠️ Média | 2-3 dias |
| 6 | Documentação | ⚠️ Média | 1-2 dias |
| 7 | Testes | ⚠️ Média | 3-4 dias |
| 8 | Rate Limiting Avançado | ⚠️ Baixa | 2-3 dias |

**Total estimado:** 17-25 dias de trabalho

---

## 🎯 **Ordem Recomendada de Execução**

1. **Sprint 1** - Base fundamental
2. **Sprint 2** - Utils e Config (depende de Sprint 1)
3. **Sprint 3** - Services (depende de Sprint 2)
4. **Sprint 4** - Validação (pode ser paralelo a Sprint 3)
5. **Sprint 5** - Erros (depende de Sprint 2)
6. **Sprint 6** - Documentação (pode ser feito em paralelo)
7. **Sprint 7** - Testes (depende de Sprints anteriores)
8. **Sprint 8** - Melhorias finais (opcional)

---

## ✅ **Checklist de Conclusão**

Após todas as sprints:
- [ ] Código modularizado e organizado
- [ ] Sistema de logging implementado
- [ ] Validação robusta de entrada
- [ ] Tratamento de erros centralizado
- [ ] Documentação completa
- [ ] Testes com boa cobertura
- [ ] Servidor mais manutenível e escalável

---

**Pronto para começar?** 🚀
