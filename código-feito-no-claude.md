import React, { useState } from 'react';
import { User, Plus, Trash2, Calendar, ShoppingCart, Sparkles, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';

export default function FamilyMealPlanner() {
  const [step, setStep] = useState('profiles'); // profiles, questionnaire, menu
  const [profiles, setProfiles] = useState([]);
  const [currentQuestionnaireIndex, setCurrentQuestionnaireIndex] = useState(0);
  const [individualAnswers, setIndividualAnswers] = useState({});
  const [weeklyContext, setWeeklyContext] = useState({});
  const [menuData, setMenuData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedDay, setExpandedDay] = useState(null);
  const [weekHistory, setWeekHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Carregar histórico ao montar
  React.useEffect(() => {
    loadHistory();
  }, []);

  // Carregar histórico do storage
  const loadHistory = async () => {
    try {
      const keys = await window.storage.list('week-history:');
      if (keys && keys.keys) {
        const history = [];
        for (const key of keys.keys.slice(-4)) { // Últimas 4 semanas
          const data = await window.storage.get(key);
          if (data && data.value) {
            history.push(JSON.parse(data.value));
          }
        }
        setWeekHistory(history.sort((a, b) => new Date(b.date) - new Date(a.date)));
      }
    } catch (error) {
      console.log('Sem histórico anterior ou erro ao carregar:', error);
    }
  };

  // Salvar semana atual no histórico
  const saveWeekToHistory = async () => {
    const weekData = {
      date: new Date().toISOString(),
      dateLabel: new Date().toLocaleDateString('pt-BR'),
      profiles: profiles.map(p => ({
        name: p.name,
        age: p.age,
        weight: p.weight,
        answers: individualAnswers[p.id]
      })),
      weeklyContext,
      priorities: generateWeeklyPriorities(),
      insights: generateInsights()
    };

    try {
      const weekKey = `week-history:${Date.now()}`;
      await window.storage.set(weekKey, JSON.stringify(weekData));
      await loadHistory();
    } catch (error) {
      console.error('Erro ao salvar histórico:', error);
    }
  };

  // Comparar com semana anterior
  const compareWithLastWeek = () => {
    if (weekHistory.length === 0) return null;
    
    const lastWeek = weekHistory[0];
    const comparisons = [];
    
    profiles.forEach(profile => {
      const currentAnswers = individualAnswers[profile.id] || {};
      const lastProfile = lastWeek.profiles.find(p => p.name === profile.name);
      
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

  // Adicionar perfil
  const addProfile = () => {
    setProfiles([...profiles, {
      id: Date.now(),
      name: '',
      age: '',
      sex: '',
      weight: '',
      height: '',
      bodyType: '',
      restrictions: '',
      goals: '',
      // Campos avançados (opcionais)
      showAdvanced: false,
      healthConditions: '',
      medications: '',
      activityLevel: '',
      mealTimes: '',
      cookingSkill: '',
      routine: ''
    }]);
  };

  // Atualizar perfil
  const updateProfile = (id, field, value) => {
    setProfiles(profiles.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  // Remover perfil
  const removeProfile = (id) => {
    setProfiles(profiles.filter(p => p.id !== id));
  };

  // Calcular IMC
  const calculateBMI = (weight, height) => {
    if (!weight || !height) return null;
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };

  // Classificação do IMC
  const getBMICategory = (bmi) => {
    if (!bmi) return '';
    if (bmi < 18.5) return 'Abaixo do peso';
    if (bmi < 25) return 'Peso normal';
    if (bmi < 30) return 'Sobrepeso';
    return 'Obesidade';
  };

  // Toggle detalhes avançados
  const toggleAdvanced = (id) => {
    setProfiles(profiles.map(p => 
      p.id === id ? { ...p, showAdvanced: !p.showAdvanced } : p
    ));
  };

  // Salvar respostas individuais
  const saveIndividualAnswers = (profileId, answers) => {
    setIndividualAnswers(prev => ({
      ...prev,
      [profileId]: answers
    }));
  };

  // Avançar para próxima pessoa
  const nextQuestionnaire = () => {
    if (currentQuestionnaireIndex < profiles.length - 1) {
      setCurrentQuestionnaireIndex(currentQuestionnaireIndex + 1);
    } else {
      // Última pessoa - pedir contexto geral da semana
      setStep('weekly-context');
    }
  };

  // Voltar para pessoa anterior
  const prevQuestionnaire = () => {
    if (currentQuestionnaireIndex > 0) {
      setCurrentQuestionnaireIndex(currentQuestionnaireIndex - 1);
    } else {
      setStep('profiles');
    }
  };

  // Gerar cardápio com IA
  const generateMenu = async () => {
    setLoading(true);
    
    // Salva semana no histórico antes de gerar cardápio
    await saveWeekToHistory();
    
    try {
      const profilesWithAnswers = profiles.map(p => {
        const answers = individualAnswers[p.id] || {};
        const bmi = calculateBMI(p.weight, p.height);
        
        return {
          name: p.name,
          age: p.age,
          sex: p.sex,
          weight: p.weight,
          height: p.height,
          bmi: bmi,
          bodyType: p.bodyType,
          restrictions: p.restrictions,
          goals: p.goals,
          healthConditions: p.healthConditions,
          medications: p.medications,
          activityLevel: p.activityLevel,
          routine: p.routine,
          mealTimes: p.mealTimes,
          cookingSkill: p.cookingSkill,
          weeklyStatus: answers
        };
      });

      const prompt = `Você é um nutricionista especializado em cardápios familiares personalizados e saúde emocional.

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
• Nível de correria: ${weeklyContext.busy}
• Orçamento: ${weeklyContext.budget}
• Tempo disponível para cozinhar: ${weeklyContext.cookingTime}
• Idas ao mercado: ${weeklyContext.groceryTrips}
• Realidade da semana: ${weeklyContext.cookingReality}

🔮 PRIORIDADES NUTRICIONAIS DA SEMANA (use como diretriz central):
${generateWeeklyPriorities().map((p, i) => `${i + 1}. ${p}`).join('\n')}

🔍 INSIGHTS ACIONÁVEIS (use para decisões específicas):
${generateInsights().map(item => `
${item.name}:
${item.insights.map(insight => `  • ${insight}`).join('\n')}
`).join('\n')}

TAREFA:
Crie um cardápio semanal (7 dias) que seja ALTAMENTE ACIONÁVEL baseado nas PRIORIDADES e insights acima.

REGRAS CRÍTICAS DE PERSONALIZAÇÃO:

0. **PRIORIDADES SÃO LEI - TODO O CARDÁPIO DEVE SERVIR ÀS PRIORIDADES:**
   - Leia as prioridades acima e use como DIRETRIZ CENTRAL
   - Cada refeição deve contribuir para pelo menos uma prioridade
   - Explique nas observações como está atendendo as prioridades

1. **USE OS INSIGHTS PARA DECISÕES ESPECÍFICAS:**
   - Se "evitar picos de cafeína" → máximo 1 café pela manhã, chás descafeinados
   - Se "estresse piora à noite" → jantar com alimentos calmantes (magnésio, triptofano)
   - Se "apetite baixo manhã" → café reforçado, almoço mais calórico
   - Se "dificuldade para dormir" → zero estimulantes após 15h
   - Se "não seguiu por falta de tempo" → receitas EXTRA rápidas (10-15min)
   - Se "enjoou" → variedade máxima, sabores diferentes

2. **ADAPTE POR MOMENTO DO DIA:**
   - Estresse manhã → café calmante
   - Fome baixa manhã → café denso e pequeno
   - Problemas de sono → jantar leve, anti-estimulante

3. **CONSIDERE LOGÍSTICA REAL:**
   - ${weeklyContext.groceryTrips === '1' ? 'Uma ida ao mercado → priorize alimentos duráveis, planeje sobras' : 'Múltiplas idas → pode usar alimentos frescos'}
   - ${weeklyContext.cookingReality === 'prefere-pratico' ? 'Prefere prático → use semi-prontos, monte rápido' : weeklyContext.cookingReality === 'improviso' ? 'Improviso → receitas flexíveis, ingredientes básicos' : 'Consegue cozinhar → pode ser mais elaborado'}

4. **APRENDA COM O PASSADO:**
   ${profilesWithAnswers.some(p => p.weeklyStatus?.notFollowedReason === 'falta-tempo') ? '→ Alguém não seguiu por falta de tempo: cardápio EXTRA prático esta semana' : ''}
   ${profilesWithAnswers.some(p => p.weeklyStatus?.notFollowedReason === 'enjoou') ? '→ Alguém enjoou: MÁXIMA variedade e novidade' : ''}
   ${profilesWithAnswers.some(p => p.weeklyStatus?.notFollowedReason === 'nao-ajudou') ? '→ Não ajudou emocionalmente: foco em alimentos para saúde mental' : ''}

FORMATO DA RESPOSTA (JSON):
{
  "days": [
    {
      "day": "Segunda-feira",
      "breakfast": {
        "base": "Receita base para todos",
        "adaptations": {
          "Nome da Pessoa": "Adaptação específica baseada nos insights"
        }
      },
      "lunch": {
        "base": "Receita base do almoço",
        "adaptations": {}
      },
      "dinner": {
        "base": "Receita base do jantar",
        "adaptations": {}
      },
      "individualSnacks": {
        "Nome da Pessoa": {
          "snack1": "Lanche manhã (considere insights: estresse/fome/energia)",
          "snack2": "Lanche tarde (considere insights)"
        }
      },
      "dayTip": "Dica específica do dia baseada nos insights"
    }
  ],
  "shoppingList": {
    "frutas_vegetais": ["item1", "item2"],
    "proteinas": ["item1", "item2"],
    "graos_cereais": ["item1", "item2"],
    "laticinios": ["item1", "item2"],
    "temperos_outros": ["item1", "item2"]
  },
  "weeklyTips": "Dicas gerais considerando os insights específicos de cada pessoa",
  "individualNotes": {
    "Nome da Pessoa": "Como este cardápio atende aos insights específicos desta pessoa"
  }
}

Responda APENAS com o JSON, sem explicações adicionais.`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 6000,
          messages: [
            { role: "user", content: prompt }
          ],
        })
      });

      const data = await response.json();
      const content = data.content[0].text;
      
      // Limpar e parsear JSON
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const menuJson = JSON.parse(cleanContent);
      
      setMenuData(menuJson);
      setStep('menu');
    } catch (error) {
      console.error('Erro ao gerar cardápio:', error);
      alert('Erro ao gerar cardápio. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Gerar prioridades nutricionais da semana
  const generateWeeklyPriorities = () => {
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

  // Gerar insights automáticos
  const generateInsights = () => {
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

  // Gerar texto do relatório
  const generateReportText = () => {
    const today = new Date().toLocaleDateString('pt-BR');
    
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

    // Adicionar prioridades da semana
    const priorities = generateWeeklyPriorities();
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

    // Adicionar insights antes dos perfis
    const insights = generateInsights();
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

      // Adiciona informações avançadas se existirem
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

Gerado por: Cardápio Familiar Inteligente
Data: ${today}
`;

    return report;
  };

  // Copiar relatório
  const copyReport = () => {
    const report = generateReportText();
    navigator.clipboard.writeText(report);
    alert('✅ Relatório copiado! Cole onde quiser.');
  };

  // Baixar relatório como TXT
  const downloadReport = () => {
    const report = generateReportText();
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-familiar-${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const currentProfile = profiles[currentQuestionnaireIndex];
  const currentAnswers = individualAnswers[currentProfile?.id] || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="text-green-600" size={32} />
            <h1 className="text-3xl font-bold text-gray-800">Cardápio Familiar Inteligente</h1>
          </div>
          <p className="text-gray-600">Alimentação personalizada para cada membro da família</p>
          
          {/* Progress indicator */}
          {step !== 'menu' && (
            <div className="mt-4 flex items-center gap-2">
              <div className={`flex items-center gap-2 ${step === 'profiles' ? 'text-green-600 font-semibold' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'profiles' ? 'bg-green-600 text-white' : 'bg-gray-300'}`}>1</div>
                <span className="hidden sm:inline">Perfis</span>
              </div>
              <div className="flex-1 h-1 bg-gray-300 rounded"></div>
              <div className={`flex items-center gap-2 ${step === 'questionnaire' ? 'text-green-600 font-semibold' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'questionnaire' ? 'bg-green-600 text-white' : 'bg-gray-300'}`}>2</div>
                <span className="hidden sm:inline">Questionários</span>
              </div>
              <div className="flex-1 h-1 bg-gray-300 rounded"></div>
              <div className={`flex items-center gap-2 ${step === 'weekly-context' ? 'text-green-600 font-semibold' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'weekly-context' ? 'bg-green-600 text-white' : 'bg-gray-300'}`}>3</div>
                <span className="hidden sm:inline">Contexto</span>
              </div>
            </div>
          )}
        </div>

        {/* Step: Perfis */}
        {step === 'profiles' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <User className="text-blue-600" size={24} />
              <h2 className="text-2xl font-bold text-gray-800">Perfis da Família</h2>
            </div>

            {profiles.map((profile, index) => (
              <div key={profile.id} className="bg-gray-50 rounded-xl p-4 mb-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-gray-700">Pessoa {index + 1}</h3>
                  <button onClick={() => removeProfile(profile.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 size={20} />
                  </button>
                </div>
                
                {/* CAMPOS BÁSICOS */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="Nome *"
                      value={profile.name}
                      onChange={(e) => updateProfile(profile.id, 'name', e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      placeholder="Idade *"
                      value={profile.age}
                      onChange={(e) => updateProfile(profile.id, 'age', e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <select
                      value={profile.sex || ''}
                      onChange={(e) => updateProfile(profile.id, 'sex', e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Sexo *</option>
                      <option value="masculino">Masculino</option>
                      <option value="feminino">Feminino</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <input
                        type="number"
                        placeholder="Peso (kg) *"
                        value={profile.weight}
                        onChange={(e) => updateProfile(profile.id, 'weight', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        placeholder="Altura (cm) *"
                        value={profile.height}
                        onChange={(e) => updateProfile(profile.id, 'height', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      {profile.weight && profile.height && (
                        <div className="px-4 py-2 bg-blue-50 rounded-lg text-center">
                          <p className="text-xs text-gray-600">IMC</p>
                          <p className="font-bold text-blue-900">{calculateBMI(profile.weight, profile.height)}</p>
                          <p className="text-xs text-gray-600">{getBMICategory(calculateBMI(profile.weight, profile.height))}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <select
                    value={profile.bodyType || ''}
                    onChange={(e) => updateProfile(profile.id, 'bodyType', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Como é seu corpo naturalmente? *</option>
                    <option value="naturalmente-magro">Naturalmente magro (dificuldade para ganhar peso)</option>
                    <option value="peso-normal">Peso equilibrado (mantém peso facilmente)</option>
                    <option value="tendencia-ganhar">Tendência a ganhar peso (facilidade para engordar)</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Alergias ou restrições alimentares (ex: lactose, glúten, frutos do mar)"
                    value={profile.restrictions}
                    onChange={(e) => updateProfile(profile.id, 'restrictions', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />

                  <input
                    type="text"
                    placeholder="Objetivos principais *"
                    value={profile.goals}
                    onChange={(e) => updateProfile(profile.id, 'goals', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />

                  {/* TOGGLE AVANÇADO */}
                  <button
                    type="button"
                    onClick={() => toggleAdvanced(profile.id)}
                    className="w-full py-2 text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-2"
                  >
                    {profile.showAdvanced ? (
                      <>
                        <ChevronUp size={20} />
                        Ocultar detalhes avançados
                      </>
                    ) : (
                      <>
                        <ChevronDown size={20} />
                        ➕ Adicionar detalhes avançados (opcional)
                      </>
                    )}
                  </button>

                  {/* CAMPOS AVANÇADOS */}
                  {profile.showAdvanced && (
                    <div className="space-y-4 pt-4 border-t border-gray-200">
                      <p className="text-sm font-semibold text-gray-600">📋 Detalhes Avançados</p>
                      
                      <input
                        type="text"
                        placeholder="Condições de saúde (ex: ansiedade, diabetes, hipertensão)"
                        value={profile.healthConditions}
                        onChange={(e) => updateProfile(profile.id, 'healthConditions', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />

                      <input
                        type="text"
                        placeholder="Medicamentos de uso contínuo"
                        value={profile.medications}
                        onChange={(e) => updateProfile(profile.id, 'medications', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />

                      <select
                        value={profile.activityLevel || ''}
                        onChange={(e) => updateProfile(profile.id, 'activityLevel', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="">Nível de atividade física</option>
                        <option value="sedentario">Sedentário (sem exercícios)</option>
                        <option value="leve">Levemente ativo (1-3x semana)</option>
                        <option value="moderado">Moderadamente ativo (3-5x semana)</option>
                        <option value="muito-ativo">Muito ativo (exercício intenso diário)</option>
                      </select>

                      <input
                        type="text"
                        placeholder="Rotina diária (ex: home office, trabalho fora, estudo integral)"
                        value={profile.routine}
                        onChange={(e) => updateProfile(profile.id, 'routine', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />

                      <input
                        type="text"
                        placeholder="Horários das refeições (ex: café 7h, almoço 12h, jantar 20h)"
                        value={profile.mealTimes}
                        onChange={(e) => updateProfile(profile.id, 'mealTimes', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />

                      <select
                        value={profile.cookingSkill || ''}
                        onChange={(e) => updateProfile(profile.id, 'cookingSkill', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="">Habilidade na cozinha</option>
                        <option value="iniciante">Iniciante (só o básico)</option>
                        <option value="intermediario">Intermediário (receitas simples)</option>
                        <option value="avancado">Avançado (domina técnicas)</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            ))}

            <button
              onClick={addProfile}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-green-500 hover:text-green-600 transition-colors flex items-center justify-center gap-2 mb-6"
            >
              <Plus size={20} />
              Adicionar Pessoa
            </button>

            <button
              onClick={() => {
                setStep('questionnaire');
                setCurrentQuestionnaireIndex(0);
              }}
              disabled={profiles.length === 0 || profiles.some(p => !p.name || !p.age || !p.sex || !p.weight || !p.height || !p.bodyType || !p.goals)}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Continuar para Questionários Individuais
            </button>
          </div>
        )}

        {/* Step: Relatório */}
        {step === 'report' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="text-blue-600" size={24} />
              <h2 className="text-2xl font-bold text-gray-800">Relatório Familiar Completo</h2>
            </div>

            {/* Prioridades da Semana - DESTAQUE PRINCIPAL */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl p-6 mb-6">
              <h3 className="font-bold text-2xl mb-3 flex items-center gap-2">
                🔮 Prioridades Nutricionais da Semana
              </h3>
              <div className="space-y-2">
                {generateWeeklyPriorities().map((priority, index) => (
                  <div key={index} className="flex items-start gap-3 bg-white/10 backdrop-blur rounded-lg p-3">
                    <span className="font-bold text-xl">{index + 1}.</span>
                    <p className="text-lg">{priority}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Comparação com semana anterior */}
            {compareWithLastWeek() && (
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl p-6 mb-6">
                <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
                  📊 Comparação com semana anterior
                </h3>
                <div className="space-y-3">
                  {compareWithLastWeek().map((comp, index) => (
                    <div key={index} className="bg-white/10 backdrop-blur rounded-lg p-3">
                      <p className="font-semibold mb-1">{comp.name}</p>
                      <ul className="space-y-1 text-sm">
                        {comp.changes.map((change, i) => (
                          <li key={i}>• {change}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Histórico toggle */}
            {weekHistory.length > 0 && (
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="w-full mb-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium text-gray-700 flex items-center justify-center gap-2"
              >
                <Calendar size={20} />
                {showHistory ? 'Ocultar' : 'Ver'} Histórico ({weekHistory.length} {weekHistory.length === 1 ? 'semana' : 'semanas'})
              </button>
            )}

            {/* Histórico de semanas */}
            {showHistory && weekHistory.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <h3 className="font-bold text-lg mb-4">📅 Histórico de Semanas</h3>
                <div className="space-y-3">
                  {weekHistory.map((week, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <p className="font-semibold text-gray-800 mb-2">{week.dateLabel}</p>
                      {week.priorities && (
                        <div className="mb-2">
                          <p className="text-sm font-medium text-gray-600 mb-1">Prioridades:</p>
                          <ul className="text-sm text-gray-700 space-y-1">
                            {week.priorities.slice(0, 2).map((p, i) => (
                              <li key={i} className="text-xs">• {p}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {week.profiles && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {week.profiles.map((p, i) => (
                            <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {p.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Insights em destaque */}
            {generateInsights().length > 0 && (
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl p-6 mb-6">
                <h3 className="font-bold text-xl mb-4">🔍 Insights da Semana</h3>
                <div className="space-y-4">
                  {generateInsights().map((item, index) => (
                    <div key={index} className="bg-white/10 backdrop-blur rounded-lg p-4">
                      <p className="font-semibold mb-2">{item.name}</p>
                      <ul className="space-y-1 text-sm">
                        {item.insights.map((insight, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="mt-1">•</span>
                            <span>{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-gray-50 p-6 rounded-lg mb-6 font-mono text-sm overflow-x-auto whitespace-pre-wrap">
              {generateReportText()}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <button
                onClick={copyReport}
                className="bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Calendar size={20} />
                Copiar Relatório
              </button>
              <button
                onClick={downloadReport}
                className="bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart size={20} />
                Baixar como TXT
              </button>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="font-semibold text-blue-900 mb-2">💡 Como usar este relatório:</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>✅ Compartilhe com seu nutricionista para análise profissional</li>
                <li>✅ Cole no ChatGPT, Claude ou outra IA para gerar cardápios alternativos</li>
                <li>✅ Salve semanalmente para acompanhar evolução da família</li>
                <li>✅ Use para identificar padrões de sono, estresse e alimentação</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep('weekly-context')}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
              >
                ← Voltar
              </button>
              <button
                onClick={() => {
                  setStep('weekly-context');
                  // Rolar para cima para ver o botão de gerar cardápio
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
              >
                Continuar para Gerar Cardápio →
              </button>
            </div>
          </div>
        )}

        {/* Step: Questionário Individual */}
        {step === 'questionnaire' && currentProfile && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="text-blue-600" size={24} />
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Como está {currentProfile.name}?</h2>
                <p className="text-sm text-gray-500">Pessoa {currentQuestionnaireIndex + 1} de {profiles.length}</p>
              </div>
            </div>

            {/* Perfil resumido */}
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div>
                  <p className="text-gray-600">Idade</p>
                  <p className="font-semibold text-gray-800">{currentProfile.age} anos</p>
                </div>
                <div>
                  <p className="text-gray-600">Peso/Altura</p>
                  <p className="font-semibold text-gray-800">{currentProfile.weight}kg / {currentProfile.height}cm</p>
                </div>
                <div>
                  <p className="text-gray-600">IMC</p>
                  <p className="font-semibold text-gray-800">{calculateBMI(currentProfile.weight, currentProfile.height)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Biotipo</p>
                  <p className="font-semibold text-gray-800 text-xs">
                    {currentProfile.bodyType === 'naturalmente-magro' ? 'Magro natural' : 
                     currentProfile.bodyType === 'peso-normal' ? 'Equilibrado' : 'Ganha peso fácil'}
                  </p>
                </div>
              </div>
              {currentProfile.restrictions && (
                <p className="text-sm text-gray-700 mt-2"><strong>Restrições:</strong> {currentProfile.restrictions}</p>
              )}
              {currentProfile.healthConditions && (
                <p className="text-sm text-gray-700 mt-1"><strong>Condições:</strong> {currentProfile.healthConditions}</p>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Como está o nível de estresse esta semana?</label>
                <select
                  value={currentAnswers.stress || ''}
                  onChange={(e) => saveIndividualAnswers(currentProfile.id, {...currentAnswers, stress: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Selecione...</option>
                  <option value="baixo">Baixo / tranquilo</option>
                  <option value="normal">Normal / controlável</option>
                  <option value="alto">Alto / tenso</option>
                  <option value="muito-alto">Muito alto / exaustivo</option>
                </select>
              </div>

              {/* NOVA: Quando o estresse piora */}
              {currentAnswers.stress && ['alto', 'muito-alto'].includes(currentAnswers.stress) && (
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Quando o estresse piora mais?</label>
                  <select
                    value={currentAnswers.stressTime || ''}
                    onChange={(e) => saveIndividualAnswers(currentProfile.id, {...currentAnswers, stressTime: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Selecione...</option>
                    <option value="manha">Manhã</option>
                    <option value="tarde">Tarde</option>
                    <option value="noite">Noite</option>
                    <option value="dia-inteiro">O dia inteiro</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-gray-700 font-medium mb-2">Como tem sido o sono?</label>
                <select
                  value={currentAnswers.sleep || ''}
                  onChange={(e) => saveIndividualAnswers(currentProfile.id, {...currentAnswers, sleep: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Selecione...</option>
                  <option value="ótimo">Ótimo (dormindo bem)</option>
                  <option value="bom">Bom (dormindo razoável)</option>
                  <option value="ruim">Ruim (acordando cansado)</option>
                  <option value="péssimo">Péssimo (insônia/sono fragmentado)</option>
                </select>
              </div>

              {/* NOVA: Horas de sono + tipo de problema */}
              {currentAnswers.sleep && ['ruim', 'péssimo'].includes(currentAnswers.sleep) && (
                <>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Quantas horas de sono, em média?</label>
                    <select
                      value={currentAnswers.sleepHours || ''}
                      onChange={(e) => saveIndividualAnswers(currentProfile.id, {...currentAnswers, sleepHours: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Selecione...</option>
                      <option value="menos-4">Menos de 4h</option>
                      <option value="4-6">4-6 horas</option>
                      <option value="6-7">6-7 horas</option>
                      <option value="7-mais">7 horas ou mais</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">O problema é mais:</label>
                    <select
                      value={currentAnswers.sleepProblem || ''}
                      onChange={(e) => saveIndividualAnswers(currentProfile.id, {...currentAnswers, sleepProblem: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Selecione...</option>
                      <option value="dificuldade-dormir">Dificuldade para dormir</option>
                      <option value="acorda-muito">Acordar várias vezes</option>
                      <option value="acorda-cansado">Acordar cansado</option>
                      <option value="tudo">Um pouco de tudo</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block text-gray-700 font-medium mb-2">Como está o nível de energia?</label>
                <select
                  value={currentAnswers.energy || ''}
                  onChange={(e) => saveIndividualAnswers(currentProfile.id, {...currentAnswers, energy: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Selecione...</option>
                  <option value="alta">Alta (disposto)</option>
                  <option value="normal">Normal</option>
                  <option value="baixa">Baixa (cansado)</option>
                  <option value="muito-baixa">Muito baixa (exausto)</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Como está o apetite?</label>
                <select
                  value={currentAnswers.appetite || ''}
                  onChange={(e) => saveIndividualAnswers(currentProfile.id, {...currentAnswers, appetite: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Selecione...</option>
                  <option value="normal">Normal</option>
                  <option value="aumentado">Aumentado (muita fome)</option>
                  <option value="diminuído">Diminuído (pouca fome)</option>
                  <option value="sem-apetite">Sem apetite</option>
                </select>
              </div>

              {/* NOVA: Quando a fome é menor */}
              {currentAnswers.appetite && ['diminuído', 'sem-apetite'].includes(currentAnswers.appetite) && (
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Quando a fome é menor?</label>
                  <select
                    value={currentAnswers.appetiteTime || ''}
                    onChange={(e) => saveIndividualAnswers(currentProfile.id, {...currentAnswers, appetiteTime: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Selecione...</option>
                    <option value="manha">Manhã</option>
                    <option value="almoco">Almoço</option>
                    <option value="noite">Noite</option>
                    <option value="sempre">O tempo todo</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-gray-700 font-medium mb-2">Sintomas específicos esta semana? (opcional)</label>
                <input
                  type="text"
                  value={currentAnswers.symptoms || ''}
                  onChange={(e) => saveIndividualAnswers(currentProfile.id, {...currentAnswers, symptoms: e.target.value})}
                  placeholder="Ex: dor de cabeça, enjoo, TPM, ansiedade piorou"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Preferências ou aversões alimentares? (opcional)</label>
                <input
                  type="text"
                  value={currentAnswers.preferences || ''}
                  onChange={(e) => saveIndividualAnswers(currentProfile.id, {...currentAnswers, preferences: e.target.value})}
                  placeholder="Ex: enjoou de frango, querendo comer doce, evitando lactose"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* NOVA: Feedback da semana passada */}
              <div className="bg-purple-50 p-4 rounded-lg space-y-4">
                <p className="font-semibold text-purple-900">📊 Sobre a semana passada:</p>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Conseguiu seguir o plano alimentar?</label>
                  <select
                    value={currentAnswers.followedPlan || ''}
                    onChange={(e) => saveIndividualAnswers(currentProfile.id, {...currentAnswers, followedPlan: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Primeira vez / Não se aplica</option>
                    <option value="sim">Sim</option>
                    <option value="parcialmente">Parcialmente</option>
                    <option value="nao">Não</option>
                  </select>
                </div>

                {currentAnswers.followedPlan && ['parcialmente', 'nao'].includes(currentAnswers.followedPlan) && (
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Principal motivo:</label>
                    <select
                      value={currentAnswers.notFollowedReason || ''}
                      onChange={(e) => saveIndividualAnswers(currentProfile.id, {...currentAnswers, notFollowedReason: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Selecione...</option>
                      <option value="falta-tempo">Falta de tempo</option>
                      <option value="falta-fome">Falta de fome/apetite</option>
                      <option value="enjoou">Enjoou da comida</option>
                      <option value="esqueceu">Esqueceu de seguir</option>
                      <option value="nao-ajudou">Não ajudou no emocional</option>
                      <option value="dificil-preparar">Difícil de preparar</option>
                      <option value="outro">Outro motivo</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={prevQuestionnaire}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
              >
                ← Voltar
              </button>
              <button
                onClick={nextQuestionnaire}
                disabled={!currentAnswers.stress || !currentAnswers.sleep || !currentAnswers.energy || !currentAnswers.appetite}
                className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {currentQuestionnaireIndex < profiles.length - 1 ? 'Próxima pessoa →' : 'Finalizar questionários →'}
              </button>
            </div>

            {/* Indicador de progresso */}
            <div className="mt-4 flex gap-2 justify-center">
              {profiles.map((p, i) => (
                <div
                  key={p.id}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    i === currentQuestionnaireIndex
                      ? 'bg-green-600'
                      : individualAnswers[p.id]?.stress
                      ? 'bg-green-300'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Step: Contexto Semanal */}
        {step === 'weekly-context' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="text-blue-600" size={24} />
              <h2 className="text-2xl font-bold text-gray-800">Contexto Geral da Semana</h2>
            </div>

            {/* Resumo das pessoas */}
            <div className="bg-green-50 p-4 rounded-lg mb-6">
              <p className="text-sm font-semibold text-green-900 mb-2">✅ Questionários individuais completos:</p>
              <div className="flex flex-wrap gap-2">
                {profiles.map(p => (
                  <span key={p.id} className="bg-white px-3 py-1 rounded-full text-sm text-gray-700 flex items-center gap-1">
                    <CheckCircle size={16} className="text-green-600" />
                    {p.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Botão Gerar Relatório */}
            <button
              onClick={() => setStep('report')}
              className="w-full mb-6 py-3 border-2 border-blue-500 text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
            >
              <Calendar size={20} />
              Ver Relatório Completo
            </button>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Nível de correria da família esta semana?</label>
                <select
                  value={weeklyContext.busy || ''}
                  onChange={(e) => setWeeklyContext({...weeklyContext, busy: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Selecione...</option>
                  <option value="tranquila">Tranquila</option>
                  <option value="normal">Normal</option>
                  <option value="corrida">Corrida</option>
                  <option value="caótica">Caótica</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Orçamento para compras esta semana?</label>
                <select
                  value={weeklyContext.budget || ''}
                  onChange={(e) => setWeeklyContext({...weeklyContext, budget: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Selecione...</option>
                  <option value="flexível">Flexível</option>
                  <option value="normal">Normal</option>
                  <option value="apertado">Apertado</option>
                </select>
              </div>

              {/* NOVA: Vai fazer mercado quantas vezes */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Vai fazer mercado quantas vezes esta semana?</label>
                <select
                  value={weeklyContext.groceryTrips || ''}
                  onChange={(e) => setWeeklyContext({...weeklyContext, groceryTrips: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Selecione...</option>
                  <option value="1">1 vez (compra grande)</option>
                  <option value="2">2 vezes</option>
                  <option value="3-mais">3 ou mais vezes</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Quanto tempo disponível para cozinhar por dia?</label>
                <select
                  value={weeklyContext.cookingTime || ''}
                  onChange={(e) => setWeeklyContext({...weeklyContext, cookingTime: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Selecione...</option>
                  <option value="muito-tempo">Mais de 1h (tempo para cozinhar)</option>
                  <option value="tempo-normal">30min - 1h (tempo razoável)</option>
                  <option value="pouco-tempo">15-30min (corrido)</option>
                  <option value="mínimo">Menos de 15min (só o básico)</option>
                </select>
              </div>

              {/* NOVA: Realidade da semana */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Nesta semana, você:</label>
                <select
                  value={weeklyContext.cookingReality || ''}
                  onChange={(e) => setWeeklyContext({...weeklyContext, cookingReality: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Selecione...</option>
                  <option value="consegue-cozinhar">Consegue cozinhar normalmente</option>
                  <option value="prefere-pratico">Prefere opções práticas/semi-prontas</option>
                  <option value="improviso">Vai se virar no improviso</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => {
                  setStep('questionnaire');
                  setCurrentQuestionnaireIndex(profiles.length - 1);
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
              >
                ← Voltar
              </button>
              <button
                onClick={generateMenu}
                disabled={!weeklyContext.busy || !weeklyContext.budget || !weeklyContext.cookingTime || !weeklyContext.groceryTrips || !weeklyContext.cookingReality || loading}
                className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Gerando cardápio personalizado...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Gerar Cardápio Semanal
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step: Cardápio */}
        {step === 'menu' && menuData && (
          <div className="space-y-6">
            {/* Prioridades da Semana */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-2xl mb-3">🔮 Prioridades Nutricionais da Semana</h3>
              <div className="space-y-2">
                {generateWeeklyPriorities().map((priority, index) => (
                  <div key={index} className="flex items-start gap-3 bg-white/10 backdrop-blur rounded-lg p-3">
                    <span className="font-bold text-xl">{index + 1}.</span>
                    <p className="text-lg">{priority}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Comparação com semana anterior */}
            {compareWithLastWeek() && (
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-xl mb-3">📊 Evolução vs Semana Anterior</h3>
                <div className="space-y-3">
                  {compareWithLastWeek().map((comp, index) => (
                    <div key={index} className="bg-white/10 backdrop-blur rounded-lg p-3">
                      <p className="font-semibold mb-1">{comp.name}</p>
                      <ul className="space-y-1 text-sm">
                        {comp.changes.map((change, i) => (
                          <li key={i}>• {change}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Dicas da Semana */}
            <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-xl mb-2">💡 Dicas para esta semana</h3>
              <p>{menuData.weeklyTips}</p>
            </div>

            {/* Observações Individuais */}
            {menuData.individualNotes && Object.keys(menuData.individualNotes).length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold text-lg mb-4 text-gray-800">👤 Observações Individuais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(menuData.individualNotes).map(([name, note]) => (
                    <div key={name} className="bg-purple-50 p-4 rounded-lg">
                      <p className="font-semibold text-purple-900 mb-1">{name}</p>
                      <p className="text-sm text-gray-700">{note}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cardápio por Dia */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <Calendar className="text-blue-600" size={24} />
                <h2 className="text-2xl font-bold text-gray-800">Cardápio Semanal</h2>
              </div>

              {menuData.days.map((day, index) => (
                <div key={index} className="border-b border-gray-200 last:border-0">
                  <button
                    onClick={() => setExpandedDay(expandedDay === index ? null : index)}
                    className="w-full py-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold text-gray-800">{day.day}</span>
                    {expandedDay === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                  
                  {expandedDay === index && (
                    <div className="pb-4 space-y-4">
                      {/* Café da Manhã */}
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <p className="font-medium text-yellow-900 mb-2">☀️ Café da manhã</p>
                        <p className="text-gray-700 mb-2">{day.breakfast.base}</p>
                        {day.breakfast.adaptations && Object.keys(day.breakfast.adaptations).length > 0 && (
                          <div className="mt-2 space-y-1">
                            {Object.entries(day.breakfast.adaptations).map(([name, adaptation]) => (
                              <p key={name} className="text-sm text-yellow-800">
                                <strong>{name}:</strong> {adaptation}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Almoço */}
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <p className="font-medium text-orange-900 mb-2">🍽️ Almoço</p>
                        <p className="text-gray-700 mb-2">{day.lunch.base}</p>
                        {day.lunch.adaptations && Object.keys(day.lunch.adaptations).length > 0 && (
                          <div className="mt-2 space-y-1">
                            {Object.entries(day.lunch.adaptations).map(([name, adaptation]) => (
                              <p key={name} className="text-sm text-orange-800">
                                <strong>{name}:</strong> {adaptation}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Jantar */}
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <p className="font-medium text-purple-900 mb-2">🌙 Jantar</p>
                        <p className="text-gray-700 mb-2">{day.dinner.base}</p>
                        {day.dinner.adaptations && Object.keys(day.dinner.adaptations).length > 0 && (
                          <div className="mt-2 space-y-1">
                            {Object.entries(day.dinner.adaptations).map(([name, adaptation]) => (
                              <p key={name} className="text-sm text-purple-800">
                                <strong>{name}:</strong> {adaptation}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Lanches Individuais */}
                      {day.individualSnacks && (
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="font-medium text-blue-900 mb-3">🥤 Lanches Personalizados</p>
                          <div className="space-y-3">
                            {Object.entries(day.individualSnacks).map(([name, snacks]) => (
                              <div key={name} className="bg-white p-3 rounded-lg">
                                <p className="font-semibold text-blue-800 mb-2">{name}</p>
                                <p className="text-sm text-gray-700"><strong>Manhã:</strong> {snacks.snack1}</p>
                                <p className="text-sm text-gray-700"><strong>Tarde:</strong> {snacks.snack2}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Dica do Dia */}
                      {day.dayTip && (
                        <div className="bg-pink-50 p-3 rounded-lg">
                          <p className="font-medium text-pink-900">💭 Dica do dia</p>
                          <p className="text-gray-700 text-sm">{day.dayTip}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Lista de Compras */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <ShoppingCart className="text-blue-600" size={24} />
                <h2 className="text-2xl font-bold text-gray-800">Lista de Compras</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(menuData.shoppingList).map(([category, items]) => (
                  <div key={category} className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-700 mb-2 capitalize">
                      {category.replace(/_/g, ' ')}
                    </h3>
                    <ul className="space-y-1">
                      {items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">✓</span>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setStep('profiles');
                setMenuData(null);
                setCurrentQuestionnaireIndex(0);
                setIndividualAnswers({});
                setWeeklyContext({});
              }}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
            >
              Criar Novo Cardápio
            </button>
          </div>
        )}
      </div>
    </div>
  );
}