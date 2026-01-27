import { describe, it, expect } from 'vitest';
import { generateWeeklyPriorities, generateInsights, compareWithLastWeek } from '../menuLogic';

describe('Menu Logic Utils', () => {
  const mockProfiles = [
    {
      id: 1,
      name: 'João',
      goals: 'emagrecer',
    },
    {
      id: 2,
      name: 'Maria',
      goals: 'ganhar peso',
    },
  ];

  const mockWeeklyContext = {
    busy: 'normal',
    budget: 'controlado',
    cookingTime: 'tempo-normal',
    groceryTrips: '2',
    cookingReality: 'consegue-cozinhar',
  };

  describe('generateWeeklyPriorities', () => {
    it('deve gerar prioridades padrão quando não há problemas identificados', () => {
      const individualAnswers = {};
      const priorities = generateWeeklyPriorities(mockProfiles, individualAnswers, mockWeeklyContext);
      
      expect(priorities).toBeInstanceOf(Array);
      expect(priorities.length).toBeGreaterThan(0);
      expect(priorities.length).toBeLessThanOrEqual(3);
    });

    it('deve identificar estresse alto e gerar prioridade apropriada', () => {
      const individualAnswers = {
        1: { stress: 'alto' },
      };
      const priorities = generateWeeklyPriorities(mockProfiles, individualAnswers, mockWeeklyContext);
      
      expect(priorities.some(p => p.includes('ansiedade') || p.includes('cafeína'))).toBe(true);
    });

    it('deve identificar sono ruim e gerar prioridade apropriada', () => {
      const individualAnswers = {
        1: { sleep: 'ruim' },
      };
      const priorities = generateWeeklyPriorities(mockProfiles, individualAnswers, mockWeeklyContext);
      
      expect(priorities.some(p => p.includes('sono') || p.includes('triptofano'))).toBe(true);
    });

    it('deve identificar apetite baixo e gerar prioridade apropriada', () => {
      const individualAnswers = {
        1: { appetite: 'diminuído' },
      };
      const priorities = generateWeeklyPriorities(mockProfiles, individualAnswers, mockWeeklyContext);
      
      expect(priorities.some(p => p.includes('apetite') || p.includes('calórica'))).toBe(true);
    });

    it('deve identificar problemas de tempo e gerar prioridade de praticidade', () => {
      const context = { ...mockWeeklyContext, busy: 'caótica', cookingTime: 'mínimo' };
      const priorities = generateWeeklyPriorities(mockProfiles, {}, context);
      
      expect(priorities.some(p => p.includes('praticidade') || p.includes('rápidas'))).toBe(true);
    });

    it('deve limitar a 3 prioridades', () => {
      const individualAnswers = {
        1: { stress: 'alto', sleep: 'ruim', appetite: 'diminuído', energy: 'baixa' },
      };
      const priorities = generateWeeklyPriorities(mockProfiles, individualAnswers, mockWeeklyContext);
      
      expect(priorities.length).toBeLessThanOrEqual(3);
    });

    it('deve lidar com perfis vazios', () => {
      const priorities = generateWeeklyPriorities([], {}, mockWeeklyContext);
      
      expect(priorities).toBeInstanceOf(Array);
      expect(priorities.length).toBeGreaterThan(0);
    });
  });

  describe('generateInsights', () => {
    it('deve gerar insights vazios quando não há problemas', () => {
      const individualAnswers = {};
      const insights = generateInsights(mockProfiles, individualAnswers);
      
      expect(insights).toBeInstanceOf(Array);
      expect(insights.length).toBe(0);
    });

    it('deve gerar insight para sono ruim + estresse alto', () => {
      const individualAnswers = {
        1: { sleep: 'ruim', stress: 'alto' },
      };
      const insights = generateInsights(mockProfiles, individualAnswers);
      
      expect(insights.length).toBeGreaterThan(0);
      expect(insights[0].name).toBe('João');
      expect(insights[0].insights.some(i => i.includes('cafeína') || i.includes('calmantes'))).toBe(true);
    });

    it('deve gerar insight para apetite baixo', () => {
      const individualAnswers = {
        1: { appetite: 'diminuído' },
      };
      const insights = generateInsights(mockProfiles, individualAnswers);
      
      expect(insights.length).toBeGreaterThan(0);
      expect(insights[0].insights.some(i => i.includes('apetite') || i.includes('densas'))).toBe(true);
    });

    it('deve gerar insight para estresse alto pela manhã', () => {
      const individualAnswers = {
        1: { stress: 'alto', stressTime: 'manha' },
      };
      const insights = generateInsights(mockProfiles, individualAnswers);
      
      expect(insights[0].insights.some(i => i.includes('manhã') || i.includes('café'))).toBe(true);
    });

    it('deve gerar insight para dificuldade para dormir', () => {
      const individualAnswers = {
        1: { sleepProblem: 'dificuldade-dormir' },
      };
      const insights = generateInsights(mockProfiles, individualAnswers);
      
      expect(insights[0].insights.some(i => i.includes('dormir') || i.includes('triptofano'))).toBe(true);
    });

    it('deve gerar insight para não seguiu por falta de tempo', () => {
      const individualAnswers = {
        1: { notFollowedReason: 'falta-tempo' },
      };
      const insights = generateInsights(mockProfiles, individualAnswers);
      
      expect(insights[0].insights.some(i => i.includes('tempo') || i.includes('prático'))).toBe(true);
    });

    it('deve retornar array vazio quando não há perfis', () => {
      const insights = generateInsights([], {});
      expect(insights).toEqual([]);
    });
  });

  describe('compareWithLastWeek', () => {
    const mockLastWeekData = {
      profiles: [
        {
          name: 'João',
          answers: {
            stress: 'alto',
            sleep: 'ruim',
            energy: 'baixa',
          },
        },
      ],
    };

    it('deve retornar null quando não há dados da semana anterior', () => {
      const comparison = compareWithLastWeek(mockProfiles, {}, null);
      expect(comparison).toBeNull();
    });

    it('deve detectar melhora no estresse', () => {
      const individualAnswers = {
        1: { stress: 'normal' },
      };
      const comparison = compareWithLastWeek(mockProfiles, individualAnswers, mockLastWeekData);
      
      expect(comparison).toBeInstanceOf(Array);
      expect(comparison[0].changes.some(c => c.includes('Estresse melhorou'))).toBe(true);
    });

    it('deve detectar piora no sono', () => {
      const individualAnswers = {
        1: { sleep: 'péssimo' },
      };
      const comparison = compareWithLastWeek(mockProfiles, individualAnswers, mockLastWeekData);
      
      expect(comparison[0].changes.some(c => c.includes('Sono piorou'))).toBe(true);
    });

    it('deve detectar melhora na energia', () => {
      const individualAnswers = {
        1: { energy: 'normal' },
      };
      const comparison = compareWithLastWeek(mockProfiles, individualAnswers, mockLastWeekData);
      
      expect(comparison[0].changes.some(c => c.includes('Energia melhorou'))).toBe(true);
    });

    it('deve retornar null quando não há mudanças', () => {
      const individualAnswers = {
        1: { stress: 'alto', sleep: 'ruim', energy: 'baixa' },
      };
      const comparison = compareWithLastWeek(mockProfiles, individualAnswers, mockLastWeekData);
      
      expect(comparison).toBeNull();
    });

    it('deve lidar com perfil não encontrado na semana anterior', () => {
      const newProfiles = [{ id: 3, name: 'Pedro' }];
      const individualAnswers = { 3: { stress: 'alto' } };
      const comparison = compareWithLastWeek(newProfiles, individualAnswers, mockLastWeekData);
      
      expect(comparison).toBeNull();
    });
  });
});
