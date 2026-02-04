# Google Search Console — Configuração

Configure o Google Search Console para o NURI receber dados de indexação e desempenho no Google.

## 1. Acessar o Search Console

1. Acesse **[Google Search Console](https://search.google.com/search-console)** e entre com a conta Google do projeto.
2. Clique em **Adicionar propriedade** (ou **Adicionar recurso**).

## 2. Adicionar a propriedade do site

- **Domínio** (recomendado): informe `nuri.app.br` para cobrir `www` e sem `www`.
- **Prefixo de URL**: se preferir, use `https://www.nuri.app.br` (ou a URL exata do site).

Siga a verificação indicada (DNS ou arquivo HTML).

- **Arquivo HTML:** se o Google pedir para fazer upload de um arquivo (ex.: `googleXXXXXXXX.html`), coloque-o na pasta **`public/`** do projeto (não na raiz). O Vite copia tudo de `public/` para a raiz do site no build, então o endereço ficará `https://seu-dominio.com/googleXXXXXXXX.html`. Depois faça deploy (push para main) e clique em **Verificar** no Search Console.

## 3. Enviar o Sitemap

Depois da propriedade verificada:

1. No menu lateral: **Sitemaps**.
2. Em **Adicionar um novo sitemap**, informe:
   ```
   sitemap.xml
   ```
   (o endereço completo será `https://www.nuri.app.br/sitemap.xml`).
3. Clique em **Enviar**.

O sitemap é gerado no build e inclui: `/`, `/como-funciona`, `/para-quem-e`, `/blog`, `/blog/cardapio-semanal-economico`, `/blog/planejamento-alimentar-familiar`, `/apoie`.

## 4. Conferir depois de alguns dias

- **Cobertura** (ou **Páginas**): quantas URLs foram indexadas.
- **Desempenho**: cliques, impressões e CTR por busca.
- **Inspeção de URL**: teste uma URL (ex.: `/blog`) para ver se está indexável.

## 5. Dicas

- Novos artigos no blog entram no `sitemap.xml` na próxima build; para incluí-los no script, edite `scripts/generate-sitemap.js`.
- Mantenha a **Site URL** no Supabase e a **VITE_APP_URL** no Vercel iguais à URL que você verificou no Search Console.
