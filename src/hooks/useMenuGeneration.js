import { useState } from 'react';
import { generateWeeklyPriorities, generateInsights } from '../utils/menuLogic';

/**
 * Hook para geração de cardápio com IA
 */
export const useMenuGeneration = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateMenu = async (profiles, individualAnswers, weeklyContext) => {
    setLoading(true);
    setError(null);

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

      const priorities = generateWeeklyPriorities(profiles, individualAnswers, weeklyContext);
      const insights = generateInsights(profiles, individualAnswers);

      const prompt = buildPrompt(profilesWithAnswers, weeklyContext, priorities, insights);

      // Em produção (Vercel), usa caminho relativo. Em dev, usa localhost
      const isProduction = import.meta.env.PROD;
      const apiUrl = isProduction ? '' : (import.meta.env.VITE_API_URL || 'http://localhost:3001');
      
      console.log('📡 Enviando requisição para:', `${apiUrl}/api/generate-menu`);
      console.log('📝 Prompt gerado (primeiros 500 chars):', prompt.substring(0, 500));
      console.log('🌐 Ambiente:', isProduction ? 'Produção' : 'Desenvolvimento');
      
      const response = await fetch(`${apiUrl}/api/generate-menu`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt })
      });

      console.log('📥 Resposta recebida, status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Erro na resposta:', errorData);
        throw new Error(errorData.error || `Erro ao gerar cardápio: ${response.status}`);
      }

      const menuJson = await response.json();
      console.log('✅ JSON parseado com sucesso');
      
      return menuJson;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { generateMenu, loading, error };
};

/**
 * Calcula IMC (importado de utils)
 */
const calculateBMI = (weight, height) => {
  if (!weight || !height) return null;
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  return bmi.toFixed(1);
};

/**
 * Constrói o prompt para a IA
 */
const buildPrompt = (profilesWithAnswers, weeklyContext, priorities, insights) => {
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
• Nível de correria: ${weeklyContext.busy}
• Orçamento: ${weeklyContext.budget}
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
};
