// Vercel Serverless Function para gerar cardápio
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

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

    if (!apiKey) {
      return res.status(400).json({
        error: 'API key não configurada. Configure GROQ_API_KEY, GOOGLE_API_KEY ou ANTHROPIC_API_KEY nas variáveis de ambiente.'
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

      if (!content) {
        throw new Error('Resposta da API Groq não contém conteúdo válido');
      }

      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const menuJson = JSON.parse(cleanContent);

      console.log('✅ Cardápio gerado com sucesso via Groq!');
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
        console.log(`🤖 Tentando modelo: ${model}`);

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
            const errorData = await response.json().catch(() => ({}));
            lastError = new Error(`Erro na API Google (${model}): ${response.status}`);

            if ((response.status === 404 || response.status === 429) && models.indexOf(model) < models.length - 1) {
              continue;
            }
            throw lastError;
          }

          const data = await response.json();
          const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

          if (!content) {
            if (models.indexOf(model) < models.length - 1) continue;
            throw new Error('Resposta da API não contém conteúdo válido');
          }

          const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
          const menuJson = JSON.parse(cleanContent);

          console.log('✅ Cardápio gerado com sucesso!');
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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Erro na API Anthropic: ${response.status}`);
      }

      const data = await response.json();
      const content = data.content[0].text;
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const menuJson = JSON.parse(cleanContent);

      return res.status(200).json(menuJson);
    }

  } catch (error) {
    console.error('Erro ao gerar cardápio:', error);
    return res.status(500).json({
      error: error.message || 'Erro ao gerar cardápio. Tente novamente.'
    });
  }
}
