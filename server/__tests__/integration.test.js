import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import express from 'express';

// Importar módulos do servidor
import { corsMiddleware } from '../config/cors.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { errorHandlerMiddleware, notFoundMiddleware } from '../middleware/errorHandler.js';
import { checkRateLimit } from '../utils/rateLimiter.js';
import { RATE_LIMIT, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../config/constants.js';

// Mock do generateMenu e hasApiKey
const mockGenerateMenu = vi.fn();
const mockHasApiKey = vi.fn(() => true);

vi.mock('../services/apiProvider.js', async () => {
  const actual = await vi.importActual('../services/apiProvider.js');
  return {
    ...actual,
    generateMenu: (...args) => mockGenerateMenu(...args),
    hasApiKey: () => mockHasApiKey(),
  };
});

describe('Integração - Endpoints', () => {
  let app;

  beforeEach(async () => {
    app = express();
    app.use(corsMiddleware);
    app.use(express.json({ limit: '1mb' }));

    const { generateMenu, hasApiKey: hasKey } = await import('../services/apiProvider.js');

    // Rota de teste
    app.post('/api/generate-menu', validateRequest, async (req, res) => {
      const clientIp = req.headers['x-forwarded-for']?.split(',')[0] || req.ip || 'unknown';
      const rateLimit = checkRateLimit(clientIp);

      res.setHeader('X-RateLimit-Limit', RATE_LIMIT.MAX_REQUESTS);
      res.setHeader('X-RateLimit-Remaining', rateLimit.remaining);

      if (!rateLimit.allowed) {
        return res.status(429).json({
          error: ERROR_MESSAGES.RATE_LIMIT_EXCEEDED,
          retryAfter: Math.ceil((rateLimit.resetAt - Date.now()) / 1000),
        });
      }

      try {
        const { prompt } = req.body;
        if (!hasKey()) {
          return res.status(400).json({
            error: ERROR_MESSAGES.API_KEY_NOT_CONFIGURED,
          });
        }

        const menuJson = await generateMenu(prompt);
        return res.json(menuJson);
      } catch (error) {
        return res.status(500).json({
          error: error.message || ERROR_MESSAGES.GENERIC_ERROR,
        });
      }
    });

    app.get('/api/health', (req, res) => {
      res.json({ status: 'ok', message: SUCCESS_MESSAGES.SERVER_RUNNING });
    });

    app.use(notFoundMiddleware);
    app.use(errorHandlerMiddleware);

    vi.clearAllMocks();
  });

  describe('GET /api/health', () => {
    it('deve retornar status ok', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body.status).toBe('ok');
      expect(response.body.message).toBe(SUCCESS_MESSAGES.SERVER_RUNNING);
    });
  });

  describe('POST /api/generate-menu', () => {
    it('deve gerar cardápio com prompt válido', async () => {
      const mockMenu = {
        days: [{ day: 'Segunda-feira', meals: {} }],
        shoppingList: [],
      };

      mockGenerateMenu.mockResolvedValueOnce(mockMenu);

      const response = await request(app)
        .post('/api/generate-menu')
        .send({ prompt: 'Gere um cardápio para família de 4 pessoas' })
        .expect(200);

      expect(response.body).toEqual(mockMenu);
      expect(mockGenerateMenu).toHaveBeenCalledWith('Gere um cardápio para família de 4 pessoas');
    });

    it('deve retornar 400 quando prompt não é fornecido', async () => {
      const response = await request(app)
        .post('/api/generate-menu')
        .send({})
        .expect(400);

      expect(response.body.error).toBeDefined();
    });

    it('deve retornar 400 quando prompt é muito curto', async () => {
      const response = await request(app)
        .post('/api/generate-menu')
        .send({ prompt: 'abc' })
        .expect(400);

      expect(response.body.error).toContain('curto');
    });

    it('deve retornar 400 quando prompt é muito grande', async () => {
      const longPrompt = 'a'.repeat(50001);

      const response = await request(app)
        .post('/api/generate-menu')
        .send({ prompt: longPrompt })
        .expect(400);

      expect(response.body.error).toBeDefined();
    });

    it('deve aplicar rate limiting', async () => {
      const ip = '192.168.1.100';
      const mockMenu = { days: [], shoppingList: [] };

      mockGenerateMenu.mockResolvedValue(mockMenu);

      // Fazer requisições até o limite
      for (let i = 0; i < RATE_LIMIT.MAX_REQUESTS; i++) {
        await request(app)
          .post('/api/generate-menu')
          .set('x-forwarded-for', ip)
          .send({ prompt: 'Teste ' + i });
      }

      // Próxima requisição deve ser bloqueada
      const response = await request(app)
        .post('/api/generate-menu')
        .set('x-forwarded-for', ip)
        .send({ prompt: 'Teste bloqueado' })
        .expect(429);

      expect(response.body.error).toContain('Muitas requisições');
      expect(response.body.retryAfter).toBeDefined();
    });

    it('deve sanitizar prompt', async () => {
      const mockMenu = { days: [], shoppingList: [] };
      mockGenerateMenu.mockResolvedValueOnce(mockMenu);

      const promptWithControlChars = 'Gere   um   cardápio\n\tcom\t\tespaços';
      
      await request(app)
        .post('/api/generate-menu')
        .send({ prompt: promptWithControlChars })
        .expect(200);

      // Verificar que o prompt foi sanitizado (sem caracteres de controle)
      const callArgs = mockGenerateMenu.mock.calls[0][0];
      expect(callArgs).not.toContain('\n');
      expect(callArgs).not.toContain('\t');
    });
  });

  describe('404 - Rota não encontrada', () => {
    it('deve retornar 404 para rota inexistente', async () => {
      const response = await request(app)
        .get('/api/rota-inexistente')
        .expect(404);

      expect(response.body.error).toBeDefined();
    });
  });
});
