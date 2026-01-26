import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Rate limiting simples em memória
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hora
const RATE_LIMIT_MAX = 20; // máximo 20 requisições por hora por IP

function checkRateLimit(ip) {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }
  
  if (now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }
  
  if (record.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt };
  }
  
  record.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX - record.count };
}

// CORS configurado para desenvolvimento
const ALLOWED_ORIGINS = [
  'https://cardapio-familiar-inteligente.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173'
];

app.use(cors({
  origin: function(origin, callback) {
    // Permite requisições sem origin (ex: curl, Postman) em dev
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.includes(origin) || origin.includes('localhost')) {
      return callback(null, true);
    }
    return callback(new Error('Origem não permitida'), false);
  },
  credentials: true
}));

app.use(express.json({ limit: '1mb' })); // Limite reduzido para segurança

// Rota para gerar cardápio
app.post('/api/generate-menu', async (req, res) => {
  // Rate limiting
  const clientIp = req.headers['x-forwarded-for']?.split(',')[0] || 
                   req.ip || 
                   'unknown';
  
  const rateLimit = checkRateLimit(clientIp);
  
  res.setHeader('X-RateLimit-Limit', RATE_LIMIT_MAX);
  res.setHeader('X-RateLimit-Remaining', rateLimit.remaining);
  
  if (!rateLimit.allowed) {
    return res.status(429).json({ 
      error: 'Muitas requisições. Aguarde um momento antes de tentar novamente.',
      retryAfter: Math.ceil((rateLimit.resetAt - Date.now()) / 1000)
    });
  }

  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt não fornecido' });
    }

    // Validação do tamanho do prompt
    if (prompt.length > 50000) {
      return res.status(400).json({ error: 'Dados muito grandes' });
    }
    
    // Prioridade: Groq (gratuito) > Google > Anthropic
    const groqKey = process.env.GROQ_API_KEY;
    const googleKey = process.env.GOOGLE_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    
    const apiKey = groqKey || googleKey || anthropicKey;
    const provider = groqKey ? 'groq' : (googleKey ? 'google' : 'anthropic');

    if (!apiKey) {
      return res.status(400).json({ 
        error: 'API key não configurada. Configure GROQ_API_KEY, GOOGLE_API_KEY ou ANTHROPIC_API_KEY no servidor.' 
      });
    }

    // ========== GROQ API (Gratuito e Rápido) ==========
    if (provider === 'groq') {
      console.log('🚀 Gerando cardápio via Groq...');
      
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${groqKey}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { 
              role: "system", 
              content: "Você é um nutricionista especializado. SEMPRE responda APENAS com JSON válido, sem markdown, sem texto adicional."
            },
            { role: "user", content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 8000,
          response_format: { type: "json_object" }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Erro na API Groq: ${response.status} - ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      
      if (!content) {
        throw new Error('Resposta da API Groq não contém conteúdo válido');
      }
      
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const menuJson = JSON.parse(cleanContent);
      
      console.log('✅ Cardápio gerado com sucesso!');
      return res.json(menuJson);
    }

    // ========== GOOGLE GEMINI API ==========
    if (provider === 'google') {
      const models = [
        'gemini-2.0-flash',
        'gemini-1.5-flash-latest',
        'gemini-pro'
      ];
      
      let lastError = null;
      
      for (const model of models) {
        console.log(`🤖 Tentando modelo: ${model}`);
        
        try {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                contents: [{
                  parts: [{
                    text: prompt
                  }]
                }],
                generationConfig: {
                  temperature: 0.7,
                  topK: 40,
                  topP: 0.95,
                  maxOutputTokens: 8192,
                  responseMimeType: "application/json"
                }
              })
            }
          );

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            lastError = new Error(`Erro na API Google (${model}): ${response.status} - ${errorData.error?.message || response.statusText}`);
            
            if ((response.status === 404 || response.status === 429) && models.indexOf(model) < models.length - 1) {
              continue;
            }
            
            throw lastError;
          }

          const data = await response.json();
          const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
          
          if (!content) {
            if (models.indexOf(model) < models.length - 1) {
              continue;
            }
            throw new Error('Resposta da API não contém conteúdo válido');
          }
          
          const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
          const menuJson = JSON.parse(cleanContent);
          
          console.log('✅ Cardápio gerado com sucesso!');
          return res.json(menuJson);
        } catch (err) {
          lastError = err;
          if (models.indexOf(model) < models.length - 1) {
            continue;
          }
          throw err;
        }
      }
    }
    
    // ========== ANTHROPIC CLAUDE API ==========
    if (provider === 'anthropic') {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 6000,
          messages: [
            { role: "user", content: prompt }
          ],
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Erro na API Anthropic: ${response.status} - ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      const content = data.content[0].text;
      
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const menuJson = JSON.parse(cleanContent);
      
      return res.json(menuJson);
    }
  } catch (error) {
    console.error('Erro ao gerar cardápio:', error.message);
    return res.status(500).json({ 
      error: error.message || 'Erro ao gerar cardápio. Tente novamente.' 
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor funcionando' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  
  // Verificar qual API está configurada
  const groqKey = process.env.GROQ_API_KEY;
  const googleKey = process.env.GOOGLE_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  
  if (groqKey) {
    console.log(`✅ Usando API: Groq (Llama 3.3 70B)`);
  } else if (googleKey) {
    console.log(`✅ Usando API: Google Gemini`);
  } else if (anthropicKey) {
    console.log(`✅ Usando API: Anthropic Claude`);
  } else {
    console.log(`⚠️  Nenhuma API configurada! Configure GROQ_API_KEY, GOOGLE_API_KEY ou ANTHROPIC_API_KEY no .env`);
  }
  
  console.log(`🔒 Rate limit: ${RATE_LIMIT_MAX} requisições/hora por IP`);
});
