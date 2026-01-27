📌 OBJETIVO

Evoluir o app Cardápio Familiar Inteligente a partir do feedback real de usuários, sem quebrar o MVP, mantendo simplicidade e foco em adesão.

🔥 PRIORIZAÇÃO GERAL (ordem recomendada)

1️⃣ Fluxo em formato de conversa (UX)
2️⃣ Orçamento alimentar explícito + estimativa de custo
3️⃣ Progresso semanal (comparação simples)
4️⃣ Gamificação leve familiar

1️⃣ Fluxo Conversacional (Substituir “formulário frio”)
🎯 Objetivo

Aumentar engajamento e reduzir abandono no preenchimento.

📐 Decisão

✔ Manter steps atuais
✔ Trocar linguagem + apresentação
❌ NÃO usar chat livre

🛠️ Escopo técnico

Refatorar componentes em src/components/steps/

Cada step:

pergunta em linguagem humana

resposta curta (botões, sliders, selects)

microfeedback explicando impacto

🧩 Exemplo de instrução para o agent

Transformar os formulários atuais em um fluxo guiado com linguagem conversacional.
Visualmente manter steps, mas cada pergunta deve parecer parte de uma conversa, com textos explicativos curtos.

✅ Critério de aceite

Fluxo completo sem digitação livre

Menos campos por tela

Linguagem informal e clara

2️⃣ Orçamento Alimentar + Estimativa de Custo
🎯 Objetivo

Alinhar cardápio e lista de compras à realidade financeira.

📐 Decisão

✔ Usar faixas de orçamento
❌ NÃO pedir valores exatos
❌ NÃO integrar APIs externas agora

🛠️ Escopo técnico

Novo campo no contexto semanal:

budget_level:

very_low

controlled

comfortable

free

Nova saída da IA:

Estimativa de custo semanal (range)

🧩 Prompt pro agent

Adicionar campo de orçamento semanal baseado em faixas.
Ajustar prompt de geração para retornar uma estimativa de custo semanal em formato de intervalo, com aviso de variação regional.

✅ Critério de aceite

Estimativa aparece no relatório final

Texto deixa claro que é valor médio estimado

3️⃣ Progresso Semanal (Histórico simples)
🎯 Objetivo

Permitir comparação e senso de evolução.

📐 Decisão

✔ Comparação qualitativa
✔ Histórico semanal simples
❌ Nada de gráficos complexos agora

🛠️ Escopo técnico

Salvar por semana:

peso (opcional)

sono (bom / médio / ruim)

energia

adesão ao plano

Tela nova:

“Histórico semanal”

comparação última semana x atual

🧩 Prompt pro agent

Implementar armazenamento semanal básico e tela de comparação simples entre semanas, priorizando percepção de progresso e não métricas clínicas.

✅ Critério de aceite

Usuário consegue ver evolução

Não exige preencher tudo

4️⃣ Gamificação Familiar (Leve)
🎯 Objetivo

Aumentar uso contínuo sem infantilizar.

📐 Decisão

✔ Gamificação simbólica
❌ Nada competitivo ou infantil

🛠️ Escopo técnico

Missões semanais simples:

“Seguir o plano 3 dias”

“Fazer a lista de compras”

Conquistas automáticas:

1ª semana

3 semanas seguidas

🧩 Prompt pro agent

Implementar sistema simples de missões semanais e conquistas visuais, sem pontos ou rankings.

✅ Critério de aceite

Feedback visual positivo

Sem rankings ou pressão

🧠 ARQUITETURA / IMPACTO (baixo risco)

✔ Não quebra o backend
✔ Pouca mudança no prompt principal
✔ Evolução incremental
✔ Fácil rollback

📦 SUGESTÃO DE ENTREGAS (sprints)

Sprint 1

Fluxo conversacional

Orçamento por faixa

Sprint 2

Estimativa de custo

Histórico semanal

Sprint 3

Gamificação leve

Ajustes de copy