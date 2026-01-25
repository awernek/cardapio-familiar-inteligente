/**
 * Lógica para gerar prioridades e insights do cardápio
 */

/**
 * Gera prioridades nutricionais da semana
 */
export const generateWeeklyPriorities = (profiles, individualAnswers, weeklyContext) => {
  const priorities = [];
  
  // Analisa todos os perfis para definir prioridades
  const hasHighStress = profiles.some(p => {
    const answers = individualAnswers[p.id] || {};
    return answers.stress && ['alto', 'muito-alto'].includes(answers.stress);
  });
  
  const hasBadSleep = profiles.some(p => {
    const answers = individualAnswers[p.id] || {};
    return answers.sleep && ['ruim', 'péssimo'].includes(answers.sleep);
  });
  
  const hasLowAppetite = profiles.some(p => {
    const answers = individualAnswers[p.id] || {};
    return answers.appetite && ['diminuído', 'sem-apetite'].includes(answers.appetite);
  });
  
  const hasLowEnergy = profiles.some(p => {
    const answers = individualAnswers[p.id] || {};
    return answers.energy && ['baixa', 'muito-baixa'].includes(answers.energy);
  });
  
  const hasTimeIssues = profiles.some(p => {
    const answers = individualAnswers[p.id] || {};
    return answers.notFollowedReason === 'falta-tempo';
  }) || weeklyContext.busy === 'caótica' || weeklyContext.cookingTime === 'mínimo';
  
  const hasWeightGoals = profiles.some(p => 
    p.goals?.toLowerCase().includes('ganhar peso') || 
    p.goals?.toLowerCase().includes('emagrecer') ||
    p.goals?.toLowerCase().includes('perder peso')
  );
  
  // Define prioridades baseado na análise
  if (hasHighStress && hasBadSleep) {
    priorities.push('Reduzir ansiedade e melhorar qualidade do sono através de alimentos calmantes (magnésio, triptofano, ômega-3)');
  } else if (hasHighStress) {
    priorities.push('Manter energia estável sem estimular ansiedade (evitar picos de cafeína e açúcar)');
  } else if (hasBadSleep) {
    priorities.push('Melhorar qualidade do sono com alimentos indutores (triptofano, vitamina B6, magnésio)');
  }
  
  if (hasLowAppetite) {
    priorities.push('Garantir ingestão calórica e nutricional adequada mesmo com apetite baixo (refeições densas, pequenas porções)');
  }
  
  if (hasLowEnergy) {
    priorities.push('Restaurar níveis de energia com alimentos ricos em ferro, vitaminas do complexo B e carboidratos complexos');
  }
  
  if (hasTimeIssues) {
    priorities.push('Praticidade máxima - receitas rápidas (10-20min) e aproveitamento de sobras');
  }
  
  if (hasWeightGoals) {
    const person = profiles.find(p => 
      p.goals?.toLowerCase().includes('ganhar peso') || 
      p.goals?.toLowerCase().includes('emagrecer')
    );
    if (person?.goals?.toLowerCase().includes('ganhar peso')) {
      priorities.push(`Favorecer ganho de peso saudável para ${person.name} (densidade calórica, frequência alimentar)`);
    } else {
      priorities.push(`Apoiar emagrecimento saudável com saciedade e nutrição adequada`);
    }
  }
  
  // Se não identificou nenhuma prioridade crítica, usa padrão
  if (priorities.length === 0) {
    priorities.push('Manter alimentação equilibrada e nutritiva para toda a família');
    priorities.push('Variedade de nutrientes e prazer alimentar');
  }
  
  // Limita a 3 prioridades principais
  return priorities.slice(0, 3);
};

/**
 * Gera insights automáticos para cada pessoa
 */
export const generateInsights = (profiles, individualAnswers) => {
  const insights = [];
  
  profiles.forEach(profile => {
    const answers = individualAnswers[profile.id] || {};
    const personalInsights = [];
    
    // Insight: Sono + Estresse
    if (answers.sleep && ['ruim', 'péssimo'].includes(answers.sleep) && 
        answers.stress && ['alto', 'muito-alto'].includes(answers.stress)) {
      personalInsights.push('Sono ruim + ansiedade alta → evitar picos de cafeína e priorizar alimentos calmantes');
    }
    
    // Insight: Apetite baixo
    if (answers.appetite && ['diminuído', 'sem-apetite'].includes(answers.appetite)) {
      personalInsights.push('Apetite baixo → priorizar refeições densas e nutritivas em pequenas porções');
    }
    
    // Insight: Estresse alto
    if (answers.stress && ['alto', 'muito-alto'].includes(answers.stress)) {
      if (answers.stressTime === 'manha') {
        personalInsights.push('Estresse alto pela manhã → café rico em triptofano e magnésio');
      } else if (answers.stressTime === 'noite') {
        personalInsights.push('Estresse alto à noite → jantar leve com alimentos calmantes');
      } else {
        personalInsights.push('Estresse alto → inserir alimentos calmantes diariamente (magnésio, ômega-3)');
      }
    }
    
    // Insight: Sono problema
    if (answers.sleepProblem === 'dificuldade-dormir') {
      personalInsights.push('Dificuldade para dormir → evitar estimulantes após 15h, priorizar triptofano no jantar');
    } else if (answers.sleepProblem === 'acorda-cansado') {
      personalInsights.push('Acorda cansado → revisar qualidade nutricional e considerar suplementação de vitaminas B');
    }
    
    // Insight: Energia baixa
    if (answers.energy && ['baixa', 'muito-baixa'].includes(answers.energy)) {
      personalInsights.push('Energia baixa → priorizar ferro, vitamina C e carboidratos complexos');
    }
    
    // Insight: Feedback semana passada
    if (answers.notFollowedReason === 'falta-tempo') {
      personalInsights.push('Não seguiu por falta de tempo → cardápio extra-prático esta semana');
    } else if (answers.notFollowedReason === 'enjoou') {
      personalInsights.push('Enjoou da comida → aumentar variedade e experimentar novos sabores');
    } else if (answers.notFollowedReason === 'nao-ajudou') {
      personalInsights.push('Não ajudou emocionalmente → revisar alimentos para saúde mental');
    }
    
    if (personalInsights.length > 0) {
      insights.push({
        name: profile.name,
        insights: personalInsights
      });
    }
  });
  
  return insights;
};

/**
 * Compara com semana anterior
 */
export const compareWithLastWeek = (profiles, individualAnswers, lastWeekData) => {
  if (!lastWeekData || !lastWeekData.profiles) return null;
  
  const comparisons = [];
  
  profiles.forEach(profile => {
    const currentAnswers = individualAnswers[profile.id] || {};
    const lastProfile = lastWeekData.profiles.find(p => p.name === profile.name);
    
    if (!lastProfile) return;
    
    const lastAnswers = lastProfile.answers || {};
    const changes = [];
    
    // Compara estresse
    const stressLevels = { 'baixo': 1, 'normal': 2, 'alto': 3, 'muito-alto': 4 };
    const currentStress = stressLevels[currentAnswers.stress] || 0;
    const lastStress = stressLevels[lastAnswers.stress] || 0;
    
    if (currentStress < lastStress) changes.push('Estresse melhorou ✅');
    else if (currentStress > lastStress) changes.push('Estresse piorou ⚠️');
    
    // Compara sono
    const sleepLevels = { 'ótimo': 4, 'bom': 3, 'ruim': 2, 'péssimo': 1 };
    const currentSleep = sleepLevels[currentAnswers.sleep] || 0;
    const lastSleep = sleepLevels[lastAnswers.sleep] || 0;
    
    if (currentSleep > lastSleep) changes.push('Sono melhorou ✅');
    else if (currentSleep < lastSleep) changes.push('Sono piorou ⚠️');
    
    // Compara energia
    const energyLevels = { 'alta': 4, 'normal': 3, 'baixa': 2, 'muito-baixa': 1 };
    const currentEnergy = energyLevels[currentAnswers.energy] || 0;
    const lastEnergy = energyLevels[lastAnswers.energy] || 0;
    
    if (currentEnergy > lastEnergy) changes.push('Energia melhorou ✅');
    else if (currentEnergy < lastEnergy) changes.push('Energia diminuiu ⚠️');
    
    if (changes.length > 0) {
      comparisons.push({
        name: profile.name,
        changes
      });
    }
  });
  
  return comparisons.length > 0 ? comparisons : null;
};
