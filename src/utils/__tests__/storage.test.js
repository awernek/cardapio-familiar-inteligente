import { describe, it, expect, beforeEach } from 'vitest';
import { listStorageKeys, getStorageItem, setStorageItem, removeStorageItem } from '../storage';

describe('Storage Utils', () => {
  beforeEach(() => {
    // Limpa localStorage antes de cada teste
    localStorage.clear();
  });

  describe('setStorageItem', () => {
    it('deve salvar item no localStorage', async () => {
      const key = 'test:item';
      const value = { name: 'Test', age: 30 };
      
      await setStorageItem(key, value);
      
      const stored = localStorage.getItem(key);
      expect(stored).toBeTruthy();
      expect(JSON.parse(stored)).toEqual(value);
    });

    it('deve converter objetos para JSON', async () => {
      const key = 'test:object';
      const value = { nested: { data: 'test' } };
      
      await setStorageItem(key, value);
      
      const stored = JSON.parse(localStorage.getItem(key));
      expect(stored).toEqual(value);
    });

    it('deve salvar strings diretamente', async () => {
      const key = 'test:string';
      const value = 'simple string';
      
      await setStorageItem(key, value);
      
      expect(localStorage.getItem(key)).toBe('"simple string"');
    });
  });

  describe('getStorageItem', () => {
    it('deve recuperar item do localStorage', async () => {
      const key = 'test:item';
      const value = { name: 'Test', age: 30 };
      
      localStorage.setItem(key, JSON.stringify(value));
      
      const retrieved = await getStorageItem(key);
      expect(retrieved).toEqual(value);
    });

    it('deve retornar null quando item não existe', async () => {
      const retrieved = await getStorageItem('test:nonexistent');
      expect(retrieved).toBeNull();
    });

    it('deve lidar com JSON inválido graciosamente', async () => {
      const key = 'test:invalid';
      localStorage.setItem(key, 'invalid json{');
      
      // Deve retornar null ou lançar erro tratado
      const retrieved = await getStorageItem(key);
      expect(retrieved).toBeNull();
    });
  });

  describe('listStorageKeys', () => {
    it('deve listar chaves com prefixo', async () => {
      await setStorageItem('week-history:1', { data: 'test1' });
      await setStorageItem('week-history:2', { data: 'test2' });
      await setStorageItem('other:key', { data: 'test3' });
      
      const keys = await listStorageKeys('week-history:');
      
      expect(keys.length).toBe(2);
      expect(keys).toContain('week-history:1');
      expect(keys).toContain('week-history:2');
      expect(keys).not.toContain('other:key');
    });

    it('deve retornar array vazio quando não há chaves', async () => {
      const keys = await listStorageKeys('nonexistent:');
      expect(keys).toEqual([]);
    });

    it('deve usar prefixo padrão quando não especificado', async () => {
      await setStorageItem('week-history:test', { data: 'test' });
      
      const keys = await listStorageKeys();
      expect(keys.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('removeStorageItem', () => {
    it('deve remover item do localStorage', async () => {
      const key = 'test:item';
      await setStorageItem(key, { data: 'test' });
      
      expect(localStorage.getItem(key)).toBeTruthy();
      
      await removeStorageItem(key);
      
      expect(localStorage.getItem(key)).toBeNull();
    });

    it('deve lidar graciosamente com remoção de item inexistente', async () => {
      await expect(removeStorageItem('test:nonexistent')).resolves.not.toThrow();
    });
  });

  describe('Integração', () => {
    it('deve salvar, recuperar e remover item corretamente', async () => {
      const key = 'test:integration';
      const value = { test: 'data', number: 42 };
      
      // Salvar
      await setStorageItem(key, value);
      expect(localStorage.getItem(key)).toBeTruthy();
      
      // Recuperar
      const retrieved = await getStorageItem(key);
      expect(retrieved).toEqual(value);
      
      // Remover
      await removeStorageItem(key);
      expect(localStorage.getItem(key)).toBeNull();
    });
  });
});
