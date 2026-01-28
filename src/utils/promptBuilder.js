/**
 * Utilitário para construção de prompts para geração de cardápio com IA
 */

/**
 * Calcula IMC
 * @param {number|string} weight - Peso em kg
 * @param {number|string} height - Altura em cm
 * @returns {string|null} IMC calculado ou null
 */
const calculateBMI = (weight, height) => {
  if (!weight || !height) return null;
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  return bmi.toFixed(1);
};

/**
 * Converte nível de orçamento para descrição detalhada
 * @param {string} budget - Nível de orçamento
 * @returns {string} Descrição do orçamento
 */
const getBudgetDescription = (budget) => {
  const descriptions = {
    'bem_apertado': 'Bem apertado (priorizar ingredientes baratos, evitar proteínas caras)',
    'controlado': 'Controlado (equilibrar custo-benefício, proteínas em dias alternados)',
    'confortavel': 'Confortável (pode variar ingredientes, proteínas diárias)',
    'livre': 'Livre (sem restrição financeira)',
    // Valores antigos para compatibilidade
    'apertado': 'Apertado (priorizar ingredientes baratos)',
    'normal': 'Normal (equilibrado)',
    'flexível': 'Flexível (pode variar)'
  };
  return descriptions[budget] || budget;
};

/**
 * Constrói o prompt completo para a IA gerar o cardápio
 * 
 * @param {Array} profilesWithAnswers - Array de perfis com respostas do questionário
 * @param {Object} weeklyContext - Contexto semanal (orçamento, tempo, etc.)
 * @param {Array} priorities - Prioridades nutricionais da semana
 * @param {Array} insights - Insights acionáveis para cada pessoa
 * @returns {string} Prompt formatado para a IA
 */
export const buildPrompt = (profilesWithAnswers, weeklyContext, priorities, insights) => {
  return `Você é um nutricionista especializado em cardápios familiares personalizados e saúde emocional.

PERFIS DA FAMÍLIA COM STATUS INDIVIDUAL:
${profilesWithAnswers.map(p => `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 ${p.name} (${p.age} anos - ${p.sex})

📊 DADOS FÍSICOS:
   • Peso: ${p.weight} kg
   • Altura: ${p.height} cm
   • IMC: ${p.bmi}
   • Biotipo: ${p.bodyType}

🎯 OBJETIVOS E RESTRIÇÕES:
   • Objetivos: ${p.goals}
   • Restrições: ${p.restrictions || 'Nenhuma'}

📋 STATUS DESTA SEMANA:
   • Nível de estresse: ${p.weeklyStatus?.stress || 'Não informado'}${p.weeklyStatus?.stressTime ? ` (piora: ${p.weeklyStatus.stressTime})` : ''}
   • Qualidade do sono: ${p.weeklyStatus?.sleep || 'Não informado'}${p.weeklyStatus?.sleepHours ? ` (${p.weeklyStatus.sleepHours})` : ''}${p.weeklyStatus?.sleepProblem ? ` - problema: ${p.weeklyStatus.sleepProblem}` : ''}
   • Nível de energia: ${p.weeklyStatus?.energy || 'Não informado'}
   • Apetite: ${p.weeklyStatus?.appetite || 'Não informado'}${p.weeklyStatus?.appetiteTime ? ` (menor em: ${p.weeklyStatus.appetiteTime})` : ''}
   • Sintomas específicos: ${p.weeklyStatus?.symptoms || 'Nenhum'}
   • Preferências/aversões: ${p.weeklyStatus?.preferences || 'Nenhuma'}
   • Seguiu plano anterior: ${p.weeklyStatus?.followedPlan || 'Primeira vez'}${p.weeklyStatus?.notFollowedReason ? ` (motivo: ${p.weeklyStatus.notFollowedReason})` : ''}

${p.healthConditions || p.medications || p.activityLevel || p.routine ? `
📋 INFORMAÇÕES ADICIONAIS:
${p.healthConditions ? `   • Condições de saúde: ${p.healthConditions}` : ''}
${p.medications ? `   • Medicamentos: ${p.medications}` : ''}
${p.activityLevel ? `   • Atividade física: ${p.activityLevel}` : ''}
${p.routine ? `   • Rotina: ${p.routine}` : ''}
${p.mealTimes ? `   • Horários: ${p.mealTimes}` : ''}
${p.cookingSkill ? `   • Habilidade culinária: ${p.cookingSkill}` : ''}
` : ''}
`).join('\n')}

CONTEXTO GERAL DA SEMANA:
${weeklyContext.location?.city && weeklyContext.location?.state ? `• Localização: ${weeklyContext.location.city}, ${weeklyContext.location.state} (considere ingredientes regionais e preços locais)` : ''}
• Nível de correria: ${weeklyContext.busy}
• Orçamento: ${getBudgetDescription(weeklyContext.budget)}
• Tempo disponível para cozinhar: ${weeklyContext.cookingTime}
• Idas ao mercado: ${weeklyContext.groceryTrips}
• Realidade da semana: ${weeklyContext.cookingReality}

🔮 PRIORIDADES NUTRICIONAIS DA SEMANA (use como diretriz central):
${priorities.map((p, i) => `${i + 1}. ${p}`).join('\n')}

🔍 INSIGHTS ACIONÁVEIS (use para decisões específicas):
${insights.map(item => `
${item.name}:
${item.insights.map(insight => `  • ${insight}`).join('\n')}
`).join('\n')}

TAREFA:
Crie um cardápio semanal (7 dias) que seja ALTAMENTE ACIONÁVEL baseado nas PRIORIDADES e insights acima.

REGRAS CRÍTICAS DE PERSONALIZAÇÃO:

0. **REALIDADE BRASILEIRA - INGREDIENTES ACESSÍVEIS:**
   - Todas as receitas e ingredientes DEVEM ser adequados à realidade alimentar brasileira
   - Use APENAS ingredientes encontrados facilmente em supermercados, feiras e atacarejos do Brasil
   - EVITE: ingredientes importados, gourmet, orgânicos caros ou pouco comuns no dia a dia
   - PRIORIZE: arroz, feijão, macarrão, frango, carne moída, ovos, legumes da estação, frutas comuns
   - Exemplos de ingredientes a EVITAR: quinoa, amaranto, tofu (a menos que pedido), cogumelos especiais, queijos importados, azeite trufado, temperos exóticos
   - Exemplos de ingredientes a USAR: arroz, feijão, batata, cenoura, chuchu, abobrinha, frango, carne, ovo, banana, maçã, laranja, leite, queijo mussarela, requeijão

1. **PRIORIDADES SÃO LEI - TODO O CARDÁPIO DEVE SERVIR ÀS PRIORIDADES:**
   - Leia as prioridades acima e use como DIRETRIZ CENTRAL
   - Cada refeição deve contribuir para pelo menos uma prioridade
   - Explique nas observações como está atendendo as prioridades

2. **USE OS INSIGHTS PARA DECISÕES ESPECÍFICAS:**
   - Se "evitar picos de cafeína" → máximo 1 café pela manhã, chás descafeinados
   - Se "estresse piora à noite" → jantar com alimentos calmantes (magnésio, triptofano)
   - Se "apetite baixo manhã" → café reforçado, almoço mais calórico
   - Se "dificuldade para dormir" → zero estimulantes após 15h
   - Se "não seguiu por falta de tempo" → receitas EXTRA rápidas (10-15min)
   - Se "enjoou" → variedade máxima, sabores diferentes

3. **ADAPTE POR MOMENTO DO DIA:**
   - Estresse manhã → café calmante
   - Fome baixa manhã → café denso e pequeno
   - Problemas de sono → jantar leve, anti-estimulante

4. **CONSIDERE LOGÍSTICA REAL:**
   - ${weeklyContext.groceryTrips === '1' ? 'Uma ida ao mercado → priorize alimentos duráveis, planeje sobras' : 'Múltiplas idas → pode usar alimentos frescos'}
   - ${weeklyContext.cookingReality === 'prefere-pratico' ? 'Prefere prático → use semi-prontos, monte rápido' : weeklyContext.cookingReality === 'improviso' ? 'Improviso → receitas flexíveis, ingredientes básicos' : 'Consegue cozinhar → pode ser mais elaborado'}

5. **APRENDA COM O PASSADO:**
   ${profilesWithAnswers.some(p => p.weeklyStatus?.notFollowedReason === 'falta-tempo') ? '→ Alguém não seguiu por falta de tempo: cardápio EXTRA prático esta semana' : ''}
   ${profilesWithAnswers.some(p => p.weeklyStatus?.notFollowedReason === 'enjoou') ? '→ Alguém enjoou: MÁXIMA variedade e novidade' : ''}
   ${profilesWithAnswers.some(p => p.weeklyStatus?.notFollowedReason === 'nao-ajudou') ? '→ Não ajudou emocionalmente: foco em alimentos para saúde mental' : ''}

6. **INCLUA PORÇÕES E QUANTIDADES:**
   - SEMPRE inclua a quantidade/porção por pessoa em cada refeição
   - Use medidas práticas: gramas (g), xícaras, colheres, unidades
   - Exemplos: "Frango grelhado (150g por pessoa)", "Arroz (1 xícara por pessoa)", "2 ovos por pessoa"
   - Na lista de compras, calcule a quantidade total necessária para ${profilesWithAnswers.length} pessoa(s) x 7 dias
   - Arredonde para cima para evitar faltar ingredientes

FORMATO DA RESPOSTA (JSON):
{
  "days": [
    {
      "day": "Segunda-feira",
      "breakfast": {
        "base": "Pão integral (2 fatias) com queijo branco (30g) e café com leite (200ml)",
        "adaptations": {
          "Nome da Pessoa": "Adaptação específica com porções ajustadas"
        }
      },
      "lunch": {
        "base": "Arroz (1 xícara) + Feijão (1 concha) + Frango grelhado (150g) + Salada de alface e tomate (à vontade)",
        "adaptations": {}
      },
      "dinner": {
        "base": "Sopa de legumes (1 tigela grande ~400ml) com torradas (3 unidades)",
        "adaptations": {}
      },
      "individualSnacks": {
        "Nome da Pessoa": {
          "snack1": "1 banana + 3 castanhas",
          "snack2": "Iogurte natural (170g) com granola (2 colheres de sopa)"
        }
      },
      "dayTip": "Dica específica do dia baseada nos insights"
    }
  ],
  "shoppingList": {
    "frutas_vegetais": ["Banana (14 unidades)", "Tomate (1kg)", "Alface (2 unidades)"],
    "proteinas": ["Peito de frango (1,5kg)", "Ovos (2 dúzias)", "Carne moída (800g)"],
    "graos_cereais": ["Arroz (2kg)", "Feijão (1kg)", "Pão integral (2 pacotes)"],
    "laticinios": ["Leite (4 litros)", "Queijo branco (300g)", "Iogurte natural (4 unidades)"],
    "temperos_outros": ["Óleo (1 unidade)", "Sal", "Alho (1 cabeça)"]
  },
  "weeklyTips": "Dicas gerais considerando os insights específicos de cada pessoa",
  "individualNotes": {
    "Nome da Pessoa": "Como este cardápio atende aos insights específicos desta pessoa"
  },
  "costEstimate": {
    "min": 150,
    "max": 250,
    "currency": "BRL",
    "disclaimer": "Valores estimados para a região informada. Preços podem variar conforme estabelecimento e sazonalidade.",
    "tips": "Dica para economizar: compre frutas da estação e aproveite promoções de proteínas."
  }
}

IMPORTANTE SOBRE A ESTIMATIVA DE CUSTO:
- Baseie-se na localização informada (${weeklyContext.location?.city || 'não informada'}, ${weeklyContext.location?.state || ''})
- Considere o número de pessoas: ${profilesWithAnswers.length}
- Considere o orçamento informado: ${weeklyContext.budget}
- Dê um intervalo realista (min-max) em reais
- Inclua uma dica de economia relevante
- O disclaimer deve alertar sobre variações regionais

Responda APENAS com o JSON, sem explicações adicionais.`;
};

/**
 * Calcula IMC para um perfil
 * @param {number|string} weight - Peso em kg
 * @param {number|string} height - Altura em cm
 * @returns {string|null} IMC calculado ou null
 */
export { calculateBMI };
