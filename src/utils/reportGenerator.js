/**
 * Gerador de relatórios em texto
 */

const stressMap = {
  'baixo': 'Baixo / tranquilo',
  'normal': 'Normal / controlável',
  'alto': 'Alto / tenso',
  'muito-alto': 'Muito alto / exaustivo'
};

const sleepMap = {
  'ótimo': 'Ótimo (dormindo bem)',
  'bom': 'Bom (dormindo razoável)',
  'ruim': 'Ruim (acordando cansado)',
  'péssimo': 'Péssimo (insônia/sono fragmentado)'
};

const energyMap = {
  'alta': 'Alta (disposto)',
  'normal': 'Normal',
  'baixa': 'Baixa (cansado)',
  'muito-baixa': 'Muito baixa (exausto)'
};

const appetiteMap = {
  'normal': 'Normal',
  'aumentado': 'Aumentado (muita fome)',
  'diminuído': 'Diminuído (pouca fome)',
  'sem-apetite': 'Sem apetite'
};

const busyMap = {
  'tranquila': 'Tranquila',
  'normal': 'Normal',
  'corrida': 'Corrida',
  'caótica': 'Caótica'
};

const budgetMap = {
  'flexível': 'Flexível',
  'normal': 'Normal',
  'apertado': 'Apertado'
};

const cookingTimeMap = {
  'muito-tempo': 'Mais de 1h (tempo para cozinhar)',
  'tempo-normal': '30min - 1h (tempo razoável)',
  'pouco-tempo': '15-30min (corrido)',
  'mínimo': 'Menos de 15min (só o básico)'
};

const bodyTypeMap = {
  'naturalmente-magro': 'Naturalmente magro (dificuldade para ganhar peso)',
  'peso-normal': 'Peso equilibrado (mantém peso facilmente)',
  'tendencia-ganhar': 'Tendência a ganhar peso (facilidade para engordar)'
};

const activityMap = {
  'sedentario': 'Sedentário (sem exercícios)',
  'leve': 'Levemente ativo (1-3x semana)',
  'moderado': 'Moderadamente ativo (3-5x semana)',
  'muito-ativo': 'Muito ativo (exercício intenso diário)'
};

/**
 * Gera o texto do relatório completo
 */
export const generateReportText = (profiles, individualAnswers, weeklyContext, generateWeeklyPriorities, generateInsights, calculateBMI, getBMICategory) => {
  const today = new Date().toLocaleDateString('pt-BR');
  const priorities = generateWeeklyPriorities();
  const insights = generateInsights();

  let report = `═══════════════════════════════════════════════════════════
   RELATÓRIO FAMILIAR - SEMANA DE ${today}
═══════════════════════════════════════════════════════════

📋 CONTEXTO GERAL DA SEMANA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Nível de correria: ${busyMap[weeklyContext.busy] || weeklyContext.busy}
• Orçamento: ${budgetMap[weeklyContext.budget] || weeklyContext.budget}
• Tempo disponível para cozinhar: ${cookingTimeMap[weeklyContext.cookingTime] || weeklyContext.cookingTime}
• Idas ao mercado: ${weeklyContext.groceryTrips === '1' ? '1 vez (compra grande)' : weeklyContext.groceryTrips === '2' ? '2 vezes' : '3 ou mais vezes'}
• Realidade da semana: ${weeklyContext.cookingReality === 'consegue-cozinhar' ? 'Consegue cozinhar normalmente' : weeklyContext.cookingReality === 'prefere-pratico' ? 'Prefere opções práticas' : 'Vai se virar no improviso'}

`;

  // Adicionar prioridades
  if (priorities.length > 0) {
    report += `
🔮 PRIORIDADES NUTRICIONAIS DA SEMANA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;
    priorities.forEach((priority, index) => {
      report += `${index + 1}. ${priority}
`;
    });
    report += `
`;
  }

  // Adicionar insights
  if (insights.length > 0) {
    report += `
🔍 INSIGHTS DA SEMANA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;
    insights.forEach(item => {
      report += `
${item.name}:
`;
      item.insights.forEach(insight => {
        report += `  • ${insight}
`;
      });
    });
    report += `
`;
  }

  // Adicionar perfis
  profiles.forEach(profile => {
    const answers = individualAnswers[profile.id] || {};
    const bmi = calculateBMI(profile.weight, profile.height);
    const bmiCategory = getBMICategory(bmi);
    
    report += `
👤 ${profile.name.toUpperCase()} (${profile.age} ANOS - ${profile.sex})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 DADOS FÍSICOS:
• Peso: ${profile.weight} kg
• Altura: ${profile.height} cm
• IMC: ${bmi} (${bmiCategory})
• Biotipo: ${bodyTypeMap[profile.bodyType] || profile.bodyType}

🎯 OBJETIVOS E RESTRIÇÕES:
• Objetivos nutricionais: ${profile.goals}
• Restrições alimentares: ${profile.restrictions || 'Nenhuma'}

📋 STATUS DESTA SEMANA:
• Nível de estresse: ${stressMap[answers.stress] || answers.stress || 'Não informado'}
• Qualidade do sono: ${sleepMap[answers.sleep] || answers.sleep || 'Não informado'}
• Nível de energia: ${energyMap[answers.energy] || answers.energy || 'Não informado'}
• Apetite: ${appetiteMap[answers.appetite] || answers.appetite || 'Não informado'}
• Sintomas específicos: ${answers.symptoms || 'Nenhum sintoma relatado'}
• Preferências/aversões: ${answers.preferences || 'Nenhuma preferência específica'}
`;

    // Informações avançadas
    if (profile.healthConditions || profile.medications || profile.activityLevel || profile.routine || profile.mealTimes || profile.cookingSkill) {
      report += `
📋 INFORMAÇÕES ADICIONAIS:`;
      
      if (profile.healthConditions) {
        report += `
• Condições de saúde: ${profile.healthConditions}`;
      }
      if (profile.medications) {
        report += `
• Medicamentos: ${profile.medications}`;
      }
      if (profile.activityLevel) {
        report += `
• Atividade física: ${activityMap[profile.activityLevel] || profile.activityLevel}`;
      }
      if (profile.routine) {
        report += `
• Rotina: ${profile.routine}`;
      }
      if (profile.mealTimes) {
        report += `
• Horários de refeições: ${profile.mealTimes}`;
      }
      if (profile.cookingSkill) {
        report += `
• Habilidade culinária: ${profile.cookingSkill}`;
      }
      report += `
`;
    }

    report += `
`;
  });

  report += `
═══════════════════════════════════════════════════════════
SUGESTÕES DE USO DESTE RELATÓRIO:
═══════════════════════════════════════════════════════════

1. Compartilhe com nutricionista para orientação profissional
2. Use como base para gerar cardápio em outra ferramenta de IA
3. Salve para acompanhar evolução semanal da família
4. Identifique padrões e tendências ao longo do tempo

Gerado por: NURI - Nutrição Inteligente
Data: ${today}
`;

  return report;
};
