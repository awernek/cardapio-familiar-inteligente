import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Log de requisições
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path}`);
  next();
});

// Rota para gerar cardápio com Google Gemini
app.post('/api/generate-menu', async (req, res) => {
  console.log('🚀 Iniciando geração do cardápio...');
  
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      console.error('❌ Prompt não fornecido');
      return res.status(400).json({ error: 'Prompt não fornecido' });
    }
    
    console.log('📝 Prompt recebido (primeiros 200 chars):', prompt.substring(0, 200));
    
    // Prioridade: Groq (gratuito) > Google > Anthropic
    const groqKey = process.env.GROQ_API_KEY;
    const googleKey = process.env.GOOGLE_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    
    const apiKey = groqKey || googleKey || anthropicKey;
    const provider = groqKey ? 'groq' : (googleKey ? 'google' : 'anthropic');
    
    console.log('🔑 Usando API:', provider.toUpperCase());
    console.log('🔑 API Key configurada:', apiKey ? 'Sim (primeiros 10 chars: ' + apiKey.substring(0, 10) + '...)' : 'NÃO!');

    if (!apiKey) {
      return res.status(400).json({ 
        error: 'API key não configurada. Configure GROQ_API_KEY, GOOGLE_API_KEY ou ANTHROPIC_API_KEY no servidor.' 
      });
    }

    // ========== GROQ API (Gratuito e Rápido) ==========
    if (provider === 'groq') {
      console.log('🚀 Usando Groq API com Llama...');
      
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

      console.log(`📥 Resposta Groq: status ${response.status}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Erro Groq:', errorData);
        throw new Error(`Erro na API Groq: ${response.status} - ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      
      console.log(`📄 Conteúdo Groq recebido: ${content ? content.substring(0, 100) + '...' : 'VAZIO'}`);
      
      if (!content) {
        throw new Error('Resposta da API Groq não contém conteúdo válido');
      }
      
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      console.log('🔧 Parseando JSON...');
      const menuJson = JSON.parse(cleanContent);
      
      console.log('✅ Cardápio gerado com sucesso via Groq!');
      return res.json(menuJson);
    }

    // ========== GOOGLE GEMINI API ==========
    if (provider === 'google') {
      // Google Gemini API - modelos atualizados para 2025/2026
      const models = [
        'gemini-2.0-flash',           // Modelo estável mais recente
        'gemini-1.5-flash-latest',    // Versão latest do 1.5
        'gemini-pro'                  // Fallback para modelo original
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

          console.log(`📥 Resposta do ${model}: status ${response.status}`);

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error(`❌ Erro no ${model}:`, errorData);
            lastError = new Error(`Erro na API Google (${model}): ${response.status} - ${errorData.error?.message || response.statusText}`);
            
            // Se for erro 404 (modelo não encontrado) ou 429 (rate limit), tenta próximo modelo
            if ((response.status === 404 || response.status === 429) && models.indexOf(model) < models.length - 1) {
              console.log(`⏭️ Modelo ${model} com erro ${response.status}, tentando próximo...`);
              continue;
            }
            
            throw lastError;
          }

          const data = await response.json();
          const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
          
          console.log(`📄 Conteúdo recebido: ${content ? content.substring(0, 100) + '...' : 'VAZIO'}`);
          
          if (!content) {
            if (models.indexOf(model) < models.length - 1) {
              console.log(`⏭️ Conteúdo vazio no ${model}, tentando próximo...`);
              continue;
            }
            throw new Error('Resposta da API não contém conteúdo válido');
          }
          
          // Limpar e parsear JSON
          const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
          
          console.log('🔧 Parseando JSON...');
          const menuJson = JSON.parse(cleanContent);
          
          console.log('✅ Cardápio gerado com sucesso!');
          return res.json(menuJson);
        } catch (err) {
          console.error(`❌ Erro no modelo ${model}:`, err.message);
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
      
      // Limpar e parsear JSON
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const menuJson = JSON.parse(cleanContent);
      
      return res.json(menuJson);
    }
  } catch (error) {
    console.error('Erro ao gerar cardápio:', error);
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
});
