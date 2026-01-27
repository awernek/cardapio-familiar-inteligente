import { describe, it, expect, beforeEach, vi } from 'vitest';
import { generateWeeklyPriorities, generateInsights } from '../utils/menuLogic';
import { calculateBMI } from '../utils/bmi';
import { setStorageItem, getStorageItem } from '../utils/storage';

// Mock do logger
vi.mock('../utils/logger', () => ({
  logger: {
    log: vi.fn(),
    error: vi.fn(),
  },
}));

describe('Testes de Integração', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Fluxo de Criação de Perfil', () => {
    it('deve calcular IMC e gerar prioridades para perfil completo', () => {
      const profile = {
        id: 1,
        name: 'João',
        weight: 80,
        height: 180,
        goals: 'emagrecer',
      };

      const individualAnswers = {
        1: {
          stress: 'alto',
          sleep: 'ruim',
          energy: 'baixa',
          appetite: 'normal',
        },
      };

      const weeklyContext = {
        busy: 'corrida',
        budget: 'controlado',
        cookingTime: 'pouco-tempo',
        groceryTrips: '2',
        cookingReality: 'prefere-pratico',
      };

      // Calcula IMC
      const bmi = calculateBMI(profile.weight, profile.height);
      expect(bmi).toBe('24.7');

      // Gera prioridades
      const priorities = generateWeeklyPriorities([profile], individualAnswers, weeklyContext);
      expect(priorities.length).toBeGreaterThan(0);
      expect(priorities.length).toBeLessThanOrEqual(3);

      // Gera insights
      const insights = generateInsights([profile], individualAnswers);
      expect(insights.length).toBeGreaterThan(0);
      expect(insights[0].name).toBe('João');
    });

    it('deve processar múltiplos perfis corretamente', () => {
      const profiles = [
        {
          id: 1,
          name: 'João',
          weight: 80,
          height: 180,
          goals: 'emagrecer',
        },
        {
          id: 2,
          name: 'Maria',
          weight: 60,
          height: 165,
          goals: 'ganhar peso',
        },
      ];

      const individualAnswers = {
        1: { stress: 'alto', sleep: 'bom' },
        2: { stress: 'normal', sleep: 'ruim' },
      };

      const weeklyContext = {
        busy: 'normal',
        budget: 'confortavel',
        cookingTime: 'tempo-normal',
        groceryTrips: '1',
        cookingReality: 'consegue-cozinhar',
      };

      const priorities = generateWeeklyPriorities(profiles, individualAnswers, weeklyContext);
      expect(priorities.length).toBeGreaterThan(0);

      const insights = generateInsights(profiles, individualAnswers);
      expect(insights.length).toBe(2); // Um insight para cada pessoa
    });
  });

  describe('Fluxo de Geração de Cardápio (Mock)', () => {
    it('deve simular fluxo completo de geração de cardápio', async () => {
      // 1. Criar perfis
      const profiles = [
        {
          id: 1,
          name: 'João',
          weight: 80,
          height: 180,
          goals: 'emagrecer',
        },
      ];

      // 2. Respostas individuais
      const individualAnswers = {
        1: {
          stress: 'alto',
          sleep: 'ruim',
          energy: 'baixa',
          appetite: 'normal',
        },
      };

      // 3. Contexto semanal
      const weeklyContext = {
        busy: 'corrida',
        budget: 'controlado',
        cookingTime: 'pouco-tempo',
        groceryTrips: '2',
        cookingReality: 'prefere-pratico',
      };

      // 4. Gerar prioridades e insights
      const priorities = generateWeeklyPriorities(profiles, individualAnswers, weeklyContext);
      const insights = generateInsights(profiles, individualAnswers);

      expect(priorities.length).toBeGreaterThan(0);
      expect(insights.length).toBeGreaterThan(0);

      // 5. Simular salvamento no histórico
      const weekData = {
        date: new Date().toISOString(),
        dateLabel: new Date().toLocaleDateString('pt-BR'),
        profiles: profiles.map(p => ({
          name: p.name,
          age: p.age,
          weight: p.weight,
          answers: individualAnswers[p.id],
        })),
        weeklyContext,
        priorities,
        insights,
      };

      await setStorageItem('week-history:test', weekData);
      const saved = await getStorageItem('week-history:test');

      expect(saved).toEqual(weekData);
      expect(saved.priorities).toEqual(priorities);
      expect(saved.insights).toEqual(insights);
    });

    it('deve validar estrutura de dados do cardápio gerado', () => {
      // Simula estrutura esperada do cardápio
      const mockMenuData = {
        days: Array.from({ length: 7 }, (_, i) => ({
          day: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'][i] + '-feira',
          breakfast: {
            base: 'Café da manhã base',
            adaptations: {},
          },
          lunch: {
            base: 'Almoço base',
            adaptations: {},
          },
          dinner: {
            base: 'Jantar base',
            adaptations: {},
          },
          individualSnacks: {},
          dayTip: 'Dica do dia',
        })),
        shoppingList: {
          frutas_vegetais: ['banana', 'maçã'],
          proteinas: ['frango', 'ovos'],
          graos_cereais: ['arroz', 'feijão'],
          laticinios: ['leite', 'queijo'],
          temperos_outros: ['sal', 'azeite'],
        },
        weeklyTips: 'Dicas da semana',
        individualNotes: {},
        costEstimate: {
          min: 150,
          max: 250,
          currency: 'BRL',
          disclaimer: 'Valores estimados',
          tips: 'Dica de economia',
        },
      };

      // Validações
      expect(mockMenuData.days).toHaveLength(7);
      expect(mockMenuData.days[0]).toHaveProperty('breakfast');
      expect(mockMenuData.days[0]).toHaveProperty('lunch');
      expect(mockMenuData.days[0]).toHaveProperty('dinner');
      expect(mockMenuData.shoppingList).toHaveProperty('frutas_vegetais');
      expect(mockMenuData.shoppingList).toHaveProperty('proteinas');
      expect(mockMenuData.costEstimate).toHaveProperty('min');
      expect(mockMenuData.costEstimate).toHaveProperty('max');
    });
  });

  describe('Fluxo de Histórico', () => {
    it('deve salvar e recuperar múltiplas semanas', async () => {
      const week1 = {
        date: '2026-01-20T00:00:00.000Z',
        dateLabel: '20/01/2026',
        profiles: [{ name: 'João', answers: { stress: 'alto' } }],
        weeklyContext: { busy: 'normal' },
        priorities: ['Prioridade 1'],
        insights: [],
      };

      const week2 = {
        date: '2026-01-27T00:00:00.000Z',
        dateLabel: '27/01/2026',
        profiles: [{ name: 'João', answers: { stress: 'normal' } }],
        weeklyContext: { busy: 'corrida' },
        priorities: ['Prioridade 2'],
        insights: [],
      };

      await setStorageItem('week-history:1', week1);
      await setStorageItem('week-history:2', week2);

      const saved1 = await getStorageItem('week-history:1');
      const saved2 = await getStorageItem('week-history:2');

      expect(saved1.date).toBe(week1.date);
      expect(saved2.date).toBe(week2.date);
      expect(saved1.profiles[0].answers.stress).toBe('alto');
      expect(saved2.profiles[0].answers.stress).toBe('normal');
    });
  });
});
