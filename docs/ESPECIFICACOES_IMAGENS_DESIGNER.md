# Especificações de imagens — NURI (Nutrição Inteligente)

Documento para a designer: tamanhos, formatos e uso de cada arte/logo do site.

---

## 1. Logo / Favicon (aba do navegador)

| Arquivo        | Tamanho recomendado | Formato | Uso |
|----------------|----------------------|--------|-----|
| **favicon.svg** | Desenho em **quadrado** (ex.: 32×32 ou 64×64 na área de arte) | **SVG** | Ícone na aba do navegador. SVG é vetorial; o navegador redimensiona. Manter simples (funciona bem em tamanhos pequenos). |
| **favicon.ico** (opcional) | 32×32 px (e 16×16 se quiser) | ICO ou PNG | Fallback para navegadores antigos. Pode ser exportado a partir do PNG. |

**Dica:** A logo deve ser legível em ~16×16 px. Evitar muitos detalhes.

---

## 2. Apple Touch Icon (iPhone/iPad “Adicionar à tela inicial”)

| Arquivo               | Tamanho   | Formato | Uso |
|-----------------------|-----------|--------|-----|
| **apple-touch-icon.png** | **180×180 px** | PNG | Ícone quando o usuário salva o site na tela inicial no iOS. Fundo pode ser transparente ou cor sólida (ex.: #f0fdf4). |

---

## 3. Imagem para redes sociais (Open Graph / Twitter)

| Arquivo        | Tamanho      | Formato | Uso |
|----------------|---------------|--------|-----|
| **og-image**   | **1200×630 px** | PNG ou JPG | Aparece quando o link do site é compartilhado no Facebook, LinkedIn, WhatsApp, Twitter/X etc. |

**Recomendações:**
- Proporção **1,91∶1** (ex.: 1200×630).
- Área segura: manter texto e logo importantes **no centro**; as bordas podem ser cortadas em alguns apps.
- Resolução: 72 dpi é suficiente para web.
- Tamanho do arquivo: idealmente **abaixo de 1 MB** (melhor para carregamento).

**Conteúdo sugerido:** Logo NURI + frase “Nutrição Inteligente” + fundo ou arte alinhada à identidade visual.

---

## 4. Ícones PWA (instalação no celular / “Adicionar à tela inicial”)

Usados quando o usuário instala o site como app no Android ou em “Adicionar à tela inicial” em outros dispositivos.

| Arquivo        | Tamanho     | Formato | Uso |
|----------------|-------------|--------|-----|
| **icon-192.png** | **192×192 px** | PNG | Ícone em listas de apps e em alguns dispositivos. |
| **icon-512.png** | **512×512 px** | PNG | Ícone em splash screen e em telas de maior resolução. |

**Maskable:** O sistema pode aplicar máscara circular ou com cantos arredondados. Deixar uma **margem de segurança** em volta da logo (cerca de 20% de cada lado) para nada importante ser cortado.

---

## 5. Screenshots (opcional — vitrines de PWA / lojas de app)

Não são “arte” da marca, mas podem ser pedidos em algum momento para store listings de PWA.

| Arquivo                | Tamanho     | Formato | Uso |
|------------------------|-------------|--------|-----|
| **screenshot-mobile.png**  | **390×844 px**  | PNG | Preview em formato celular. |
| **screenshot-desktop.png** | **1280×720 px** | PNG | Preview em formato desktop. |

Podem ser feitos depois, com capturas de tela do próprio site.

---

## Resumo rápido para a designer

| Arte              | Tamanho      | Formato |
|-------------------|-------------|--------|
| Logo / Favicon    | Quadrado (ex. 64×64 área de arte) | **SVG** |
| Apple Touch Icon  | **180×180 px** | PNG |
| Redes sociais     | **1200×630 px** | PNG ou JPG |
| Ícone PWA pequeno | **192×192 px** | PNG |
| Ícone PWA grande  | **512×512 px** | PNG |

---

## Onde cada arquivo fica no projeto

Todos os arquivos listados ficam na pasta **`public/`** na raiz do projeto:

- `public/favicon.svg`
- `public/apple-touch-icon.png`
- `public/og-image.png` (ou .jpg; hoje está como og-image.svg)
- `public/icon-192.png`
- `public/icon-512.png`

Quando a designer entregar as artes, basta colocar os arquivos nessa pasta (e atualizar o `index.html` se o nome do arquivo da imagem de redes sociais mudar, por exemplo de `og-image.svg` para `og-image.png`).

---

**Dúvidas:** wernekdev@gmail.com
