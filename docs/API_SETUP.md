# Guia de Configuração da API

Este projeto suporta duas APIs de IA para gerar os cardápios. Recomendamos usar o **Google Gemini** por ser gratuito e ter limites generosos.

## 🟢 Google Gemini API (Recomendado)

### Por que usar?
- ✅ **100% Gratuito** - Sem necessidade de cartão de crédito
- ✅ **Limites generosos**: 200 requests/dia, 1 milhão de tokens por request
- ✅ **Fácil de configurar**: Apenas precisa de uma conta Google
- ✅ **Suporte a JSON mode**: Respostas estruturadas perfeitas

### Como obter a chave:

1. **Acesse o Google AI Studio**
   - Vá para: https://aistudio.google.com/apikey
   - Faça login com sua conta Google

2. **Crie uma API Key**
   - Clique no botão "Create API Key"
   - Selecione ou crie um projeto Google Cloud
   - A chave será gerada automaticamente

3. **Copie a chave**
   - A chave aparecerá no formato: `AIza...`
   - **Importante**: Copie imediatamente, ela só aparece uma vez!

4. **Configure no projeto**
   - Crie o arquivo `.env` na raiz do projeto
   - Adicione: `VITE_GOOGLE_API_KEY=sua_chave_aqui`
   - Reinicie o servidor de desenvolvimento

### Limites do tier gratuito:
- **Gemini 2.0 Flash**: 15 requests/min, 200 requests/dia
- **Tokens**: 1 milhão de tokens por request
- **Sem custo**: Totalmente gratuito

---

## 🔵 Anthropic Claude API (Alternativa)

### Quando usar?
- Se você já tem uma conta Claude
- Se precisar de mais requests/dia
- Se preferir o modelo Claude

### Como obter a chave:

1. **Acesse o Anthropic Console**
   - Vá para: https://console.anthropic.com/
   - Crie uma conta ou faça login

2. **Gere uma API Key**
   - Vá em "API Keys"
   - Clique em "Create Key"
   - Copie a chave gerada

3. **Configure no projeto**
   - Adicione no `.env`: `VITE_ANTHROPIC_API_KEY=sua_chave_aqui`
   - **Nota**: Se `VITE_GOOGLE_API_KEY` também estiver configurada, o Google terá prioridade

---

## 🔄 Como o projeto escolhe a API?

O projeto usa a seguinte ordem de prioridade:

1. **Primeiro**: Verifica se `VITE_GOOGLE_API_KEY` existe → usa Google Gemini
2. **Segundo**: Verifica se `VITE_ANTHROPIC_API_KEY` existe → usa Claude
3. **Erro**: Se nenhuma estiver configurada, mostra erro ao tentar gerar cardápio

---

## 🧪 Testando a configuração

Após configurar a API key:

1. Inicie o projeto: `npm run dev`
2. Preencha os perfis e questionários
3. Tente gerar um cardápio
4. Se funcionar, você verá o cardápio sendo gerado
5. Se der erro, verifique:
   - Se a chave está correta no `.env`
   - Se reiniciou o servidor após adicionar a chave
   - Se a chave não expirou ou foi revogada

---

## 📊 Comparação das APIs

| Recurso | Google Gemini | Anthropic Claude |
|---------|--------------|------------------|
| **Custo** | Gratuito | Pago (após créditos) |
| **Requests/dia (gratuito)** | 200 | Limitado |
| **Tokens por request** | 1M | 200K |
| **JSON Mode** | ✅ Sim | ✅ Sim |
| **Facilidade** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

---

## 🆘 Problemas Comuns

### "Erro na API: 401"
- **Causa**: Chave API inválida ou expirada
- **Solução**: Gere uma nova chave e atualize o `.env`

### "Erro na API: 429"
- **Causa**: Limite de requests excedido
- **Solução**: Aguarde alguns minutos ou use a outra API

### "Resposta da API não contém conteúdo válido"
- **Causa**: Formato de resposta inesperado
- **Solução**: Verifique se a API key está correta e se o modelo está disponível

---

## 🔐 Segurança

⚠️ **IMPORTANTE**: Nunca commite o arquivo `.env` no Git!

O arquivo `.env` já está no `.gitignore`, mas sempre verifique antes de fazer commit.

Para compartilhar o projeto:
- Use `.env.example` como template
- Não inclua chaves reais
- Instrua outros desenvolvedores a criar suas próprias chaves
