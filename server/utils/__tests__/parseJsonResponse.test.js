import { describe, it, expect } from 'vitest';
import { parseJsonResponse } from '../parseJsonResponse.js';

describe('parseJsonResponse', () => {
  it('deve fazer parse de JSON válido', () => {
    const content = '{"days": [{"day": "Segunda"}]}';
    const result = parseJsonResponse(content, { provider: 'Test' });
    
    expect(result).toEqual({ days: [{ day: 'Segunda' }] });
  });

  it('deve remover markdown code blocks', () => {
    const content = '```json\n{"days": []}\n```';
    const result = parseJsonResponse(content, { provider: 'Test' });
    
    expect(result).toEqual({ days: [] });
  });

  it('deve remover ```json do início', () => {
    const content = '```json\n{"test": true}';
    const result = parseJsonResponse(content, { provider: 'Test' });
    
    expect(result).toEqual({ test: true });
  });

  it('deve remover ``` do final', () => {
    const content = '{"test": true}\n```';
    const result = parseJsonResponse(content, { provider: 'Test' });
    
    expect(result).toEqual({ test: true });
  });

  it('deve lançar erro para JSON inválido', () => {
    const content = '{"invalid": json}';
    
    expect(() => {
      parseJsonResponse(content, { provider: 'Test' });
    }).toThrow();
  });

  it('deve lançar erro para conteúdo vazio', () => {
    expect(() => {
      parseJsonResponse('', { provider: 'Test' });
    }).toThrow();
  });

  it('deve lançar erro para null', () => {
    expect(() => {
      parseJsonResponse(null, { provider: 'Test' });
    }).toThrow();
  });

  it('deve fazer parse de JSON complexo', () => {
    const content = JSON.stringify({
      days: [
        { day: 'Segunda', meals: { breakfast: 'Ovos' } }
      ],
      shoppingList: ['Ovos', 'Pão']
    });
    
    const result = parseJsonResponse(content, { provider: 'Test' });
    
    expect(result.days).toHaveLength(1);
    expect(result.shoppingList).toHaveLength(2);
  });
});
