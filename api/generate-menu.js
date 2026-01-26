// Vercel Serverless Function para gerar cardápio
// Com melhorias de segurança: CORS restrito, rate limiting, logs limpos

// Rate limiting simples em memória (por IP)
// Nota: Em produção com múltiplas instâncias, usar Redis ou Upstash
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

// Domínios permitidos para CORS
const ALLOWED_ORIGINS = [
  'https://cardapio-familiar-inteligente.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173'
];

function getCorsOrigin(requestOrigin) {
  if (ALLOWED_ORIGINS.includes(requestOrigin)) {
    return requestOrigin;
  }
  // Em desenvolvimento, permite qualquer localhost
  if (requestOrigin && requestOrigin.includes('localhost')) {
    return requestOrigin;
  }
  return ALLOWED_ORIGINS[0]; // Default para produção
}

export default async function handler(req, res) {
  const origin = req.headers.origin || req.headers.referer || '';
  const corsOrigin = getCorsOrigin(origin);
  
  // CORS headers - restrito aos domínios permitidos
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', corsOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  // Rate limiting
  const clientIp = req.headers['x-forwarded-for']?.split(',')[0] || 
                   req.headers['x-real-ip'] || 
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

    // Validação básica do prompt (evita payloads muito grandes)
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
        error: 'Serviço temporariamente indisponível. Tente novamente mais tarde.'
      });
    }

    // ========== GROQ API (Gratuito e Rápido) ==========
    if (provider === 'groq') {
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
        throw new Error(`Erro ao gerar cardápio: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error('Resposta inválida do serviço');
      }

      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const menuJson = JSON.parse(cleanContent);

      return res.status(200).json(menuJson);
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
        try {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${googleKey}`,
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
            lastError = new Error(`Erro na API: ${response.status}`);
            if ((response.status === 404 || response.status === 429) && models.indexOf(model) < models.length - 1) {
              continue;
            }
            throw lastError;
          }

          const data = await response.json();
          const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

          if (!content) {
            if (models.indexOf(model) < models.length - 1) continue;
            throw new Error('Resposta inválida do serviço');
          }

          const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
          const menuJson = JSON.parse(cleanContent);

          return res.status(200).json(menuJson);
        } catch (err) {
          lastError = err;
          if (models.indexOf(model) < models.length - 1) continue;
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
          "x-api-key": anthropicKey,
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
        throw new Error(`Erro ao gerar cardápio: ${response.status}`);
      }

      const data = await response.json();
      const content = data.content[0].text;
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const menuJson = JSON.parse(cleanContent);

      return res.status(200).json(menuJson);
    }

  } catch (error) {
    // Log genérico sem detalhes sensíveis
    console.error('Erro na geração de cardápio');
    return res.status(500).json({
      error: 'Erro ao gerar cardápio. Tente novamente em alguns segundos.'
    });
  }
}
