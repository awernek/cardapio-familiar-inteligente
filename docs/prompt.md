# PROMPT PARA CURSOR AGENT - MELHORIAS NURI

## ALINHAMENTOS COM O CÓDIGO ATUAL (evitar quebrar)

- **Roteamento:** Feito em `src/main.jsx` por `window.location.pathname` (sem react-router). Rotas estáticas: `/`, `/apoie`, `/como-funciona`, `/para-quem-e`. O restante cai no app (AuthProvider + App).
- **MenuActions vs MealActions:** Já existe `src/components/steps/MenuStep/MenuActions.jsx` para ações do **cardápio inteiro** (Imprimir/PDF, WhatsApp, Expandir, Ver Progresso). O prompt sugere **MealActions** por **refeição** (Não gostei/trocar, Repetir semana que vem, Sugerir variação) — é um componente novo, por prato.
- **SEO já implementado (Sprint 1-2 parcial):** `src/utils/seo.js` (generateMetaTags, applyMetaTags), `src/components/seo/SEOPage.jsx`, páginas `/como-funciona` e `/para-quem-e`, `scripts/generate-sitemap.js` (rodado no build). Sitemap em `public/sitemap.xml`. Links no footer da Landing.
- **Páginas de conteúdo/blog e biblioteca de receitas** ainda não existem; ao implementar, usar o mesmo padrão de rota em `main.jsx` e SEOPage para meta tags.

---

## CONTEXTO DO PROJETO

Você está trabalhando no **NURI (Nutrição Inteligente)**, uma aplicação web React que gera cardápios semanais personalizados usando IA para famílias brasileiras.

**Stack atual:**
- Frontend: React 18 + Vite + Tailwind CSS
- Backend: Node.js/Express (dev) + Vercel Serverless (prod)
- IA: Groq (Llama 3.3 70B) → Google Gemini → Anthropic Claude
- Banco: Supabase (PostgreSQL + Auth)
- Deploy: Vercel

**Estrutura relevante:**
```
src/
├── components/
│   ├── auth/
│   ├── gamification/
│   └── steps/          # Fluxo: PROFILES → QUESTIONNAIRE → WEEKLY_CONTEXT → REPORT → MENU → PROGRESS
├── hooks/              # useMenuGeneration, useHistory, useProfiles, etc.
├── services/           # menuService.js (Supabase)
├── utils/              # promptBuilder, menuLogic, reportGenerator, storage
└── App.jsx             # Lógica central de navegação e estado

api/
├── generate-menu.js    # Serverless endpoint (prod)
└── health.js

server/
└── index.js            # Express backend (dev)
```

---

## OBJETIVO PRINCIPAL

Implementar melhorias **priorizadas e pragmáticas** para:
1. **SEO e descoberta** (urgente - base para crescimento)
2. **Valor percebido** (micro-ajustes que aumentam retenção)
3. **Conteúdo indexável** (biblioteca de receitas)
4. **Indicação orgânica** (crescimento sustentável)

**Princípio norteador:** Simplicidade > Features complexas. Cada implementação deve ter **alto impacto com baixo esforço**.

---

## SPRINT 1-2: FUNDAÇÃO SEO (URGENTE)

### Tarefa 1.1: Páginas Estáticas Indexáveis

**Objetivo:** Criar páginas que o Google possa indexar, com conteúdo real e semântico.

**Páginas essenciais:**
```
/como-funciona          → Explicação do produto
/para-quem-e           → Persona e casos de uso
/receitas              → Biblioteca pública de receitas
/blog                  → Hub de artigos
/blog/cardapio-semanal-economico
/blog/planejamento-alimentar-familiar
/blog/receitas-rapidas-30min
/blog/economia-mercado
```

**Implementação:**
1. Criar componente `<SEOPage>` que:
   - Aceita `title`, `description`, `keywords`, `canonical`
   - Renderiza meta tags corretas
   - Adiciona Schema.org (Organization, FAQPage)
   - Inclui Open Graph para compartilhamento

2. Criar roteamento para páginas estáticas no `App.jsx` ou criar arquivo de rotas dedicado

3. Cada página deve ter:
   - URL semântica
   - H1 único e descritivo
   - Conteúdo mínimo de 500 palavras
   - CTAs claros para "Experimentar grátis"

**Tom de copy:**
```markdown
❌ Evitar: "Gere cardápios personalizados com IA"
✅ Usar: "Acabou a correria de decidir 'o que fazer pra janta'"

❌ Evitar: "Planejamento alimentar inteligente"
✅ Usar: "Sua semana organizada. Sem stress, sem desperdício."
```

**Exemplo de estrutura para /como-funciona:**
```jsx
<SEOPage
  title="Como funciona o NURI - Cardápio Semanal Automático"
  description="Planeje suas refeições em 5 minutos. Cardápio personalizado, lista de compras e economia garantida."
  keywords="cardápio semanal, planejamento alimentar, lista de compras, economia"
>
  <Hero>
    <h1>Como funciona o NURI</h1>
    <p>Sua semana organizada em 3 passos simples</p>
  </Hero>
  
  <Steps>
    <Step number="1">
      <h2>Cadastre sua família</h2>
      <p>Idade, restrições, objetivos de cada pessoa</p>
    </Step>
    {/* ... */}
  </Steps>
  
  <FAQ schema={faqSchema}>
    {/* Perguntas frequentes com Schema.org */}
  </FAQ>
  
  <CTA>Experimentar grátis</CTA>
</SEOPage>
```

---

### Tarefa 1.2: Meta Tags Dinâmicas

**Objetivo:** Cada rota deve ter meta tags únicas e otimizadas.

**Criar arquivo:** `src/utils/seo.js`
```javascript
export const generateMetaTags = ({ title, description, image, url }) => ({
  // Title
  title: `${title} | NURI - Nutrição Inteligente`,
  
  // Meta básico
  description,
  keywords: 'cardápio semanal, planejamento alimentar, lista de compras, receitas familiares, economia mercado',
  
  // Open Graph (Facebook, WhatsApp)
  'og:title': title,
  'og:description': description,
  'og:image': image || '/og-image.png',
  'og:url': url,
  'og:type': 'website',
  
  // Twitter
  'twitter:card': 'summary_large_image',
  'twitter:title': title,
  'twitter:description': description,
  'twitter:image': image || '/og-image.png',
  
  // Canonical
  canonical: url
});
```

**Usar em cada página:**
```jsx
import { Helmet } from 'react-helmet-async';
import { generateMetaTags } from '@/utils/seo';

function ComoFunciona() {
  const meta = generateMetaTags({
    title: 'Como funciona o NURI',
    description: 'Planeje suas refeições em 5 minutos. Cardápio personalizado, lista de compras e economia garantida.',
    url: 'https://nuri.app.br/como-funciona'
  });
  
  return (
    <>
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        {/* ... outros meta tags */}
      </Helmet>
      
      {/* Conteúdo da página */}
    </>
  );
}
```

---

### Tarefa 1.3: Schema.org (Structured Data)

**Objetivo:** Permitir rich snippets no Google.

**Schemas prioritários:**
1. **Organization** (home)
2. **FAQPage** (páginas de conteúdo)
3. **Recipe** (biblioteca de receitas)
4. **Article** (blog posts)

**Exemplo - Schema de Receita:**
```javascript
// src/utils/recipeSchema.js
export const generateRecipeSchema = (recipe) => ({
  "@context": "https://schema.org",
  "@type": "Recipe",
  "name": recipe.name,
  "description": recipe.description,
  "prepTime": `PT${recipe.prepTime}M`,
  "cookTime": `PT${recipe.cookTime}M`,
  "totalTime": `PT${recipe.totalTime}M`,
  "recipeYield": recipe.servings,
  "recipeCategory": recipe.category,
  "recipeCuisine": "Brasileira",
  "recipeIngredient": recipe.ingredients,
  "recipeInstructions": recipe.instructions.map((step, i) => ({
    "@type": "HowToStep",
    "position": i + 1,
    "text": step
  })),
  "nutrition": {
    "@type": "NutritionInformation",
    "calories": `${recipe.calories} calories`
  }
});
```

**Injetar no HTML:**
```jsx
<Helmet>
  <script type="application/ld+json">
    {JSON.stringify(recipeSchema)}
  </script>
</Helmet>
```

---

### Tarefa 1.4: Sitemap.xml Automático

**Objetivo:** Facilitar indexação pelo Google.

**Opção 1: Gerar estaticamente (build time)**
```javascript
// scripts/generate-sitemap.js
import { writeFileSync } from 'fs';

const baseUrl = 'https://nuri.app.br';
const routes = [
  { url: '/', priority: 1.0, changefreq: 'weekly' },
  { url: '/como-funciona', priority: 0.8, changefreq: 'monthly' },
  { url: '/receitas', priority: 0.9, changefreq: 'daily' },
  // ... adicionar todas as rotas
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${routes.map(route => `
    <url>
      <loc>${baseUrl}${route.url}</loc>
      <priority>${route.priority}</priority>
      <changefreq>${route.changefreq}</changefreq>
    </url>
  `).join('')}
</urlset>`;

writeFileSync('public/sitemap.xml', sitemap);
```

**Adicionar em package.json:**
```json
"scripts": {
  "build": "node scripts/generate-sitemap.js && vite build"
}
```

---

## SPRINT 3-4: VALOR PERCEBIDO (MICRO-AJUSTES)

### Tarefa 2.1: Ajustes Finos no Cardápio

**Objetivo:** Dar sensação de controle ao usuário sem refazer tudo.

**Implementação:**

**1. Criar componente `<MealActions>`:**
```jsx
// src/components/steps/menu/MealActions.jsx
import { ThumbsDown, Repeat, Shuffle } from 'lucide-react';

export function MealActions({ meal, onReplace, onRepeat, onVariation }) {
  return (
    <div className="flex gap-2 mt-3">
      <button
        onClick={() => onReplace(meal.id)}
        className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
      >
        <ThumbsDown size={16} />
        Não gostei, trocar
      </button>
      
      <button
        onClick={() => onRepeat(meal.id)}
        className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700"
      >
        <Repeat size={16} />
        Repetir semana que vem
      </button>
      
      <button
        onClick={() => onVariation(meal.id)}
        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
      >
        <Shuffle size={16} />
        Sugerir variação
      </button>
    </div>
  );
}
```

**2. Adicionar lógica no hook de menu:**
```javascript
// src/hooks/useMenuAdjustments.js
import { useState } from 'react';

export function useMenuAdjustments(currentMenu) {
  const [adjustments, setAdjustments] = useState([]);
  
  const replaceMeal = async (mealId) => {
    // Chama API com prompt: "Substitua [prato X] por algo similar, mas diferente"
    const newMeal = await apiService.replaceMeal(mealId, currentMenu);
    setAdjustments(prev => [...prev, { type: 'replace', mealId, newMeal }]);
  };
  
  const markForRepeat = (mealId) => {
    // Salva no localStorage/Supabase: "usuário gostou deste prato"
    localStorage.setItem(`repeat_${mealId}`, JSON.stringify({ mealId, liked: true }));
    setAdjustments(prev => [...prev, { type: 'repeat', mealId }]);
  };
  
  const requestVariation = async (mealId) => {
    // Prompt: "Crie 3 variações de [prato X] com mesma base nutricional"
    const variations = await apiService.getVariations(mealId);
    return variations;
  };
  
  return { replaceMeal, markForRepeat, requestVariation, adjustments };
}
```

**3. Integrar no MenuDisplay:**
```jsx
// src/components/steps/menu/MenuDisplay.jsx
import { useMenuAdjustments } from '@/hooks/useMenuAdjustments';

function MenuDisplay({ menu }) {
  const { replaceMeal, markForRepeat, requestVariation } = useMenuAdjustments(menu);
  
  return (
    <div>
      {menu.days.map(day => (
        <DayCard key={day.date}>
          {day.meals.map(meal => (
            <MealCard key={meal.id}>
              <MealInfo meal={meal} />
              <MealActions
                meal={meal}
                onReplace={replaceMeal}
                onRepeat={markForRepeat}
                onVariation={requestVariation}
              />
            </MealCard>
          ))}
        </DayCard>
      ))}
    </div>
  );
}
```

---

### Tarefa 2.2: Feedback Visual Simples

**Objetivo:** Mostrar progresso e conquistas de forma clara e motivadora.

**Criar componente `<WeeklyProgress>`:**
```jsx
// src/components/progress/WeeklyProgress.jsx
import { Flame, TrendingUp, DollarSign } from 'lucide-react';

export function WeeklyProgress({ streak, improvements, savings }) {
  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4">Seu progresso</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Streak */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
            <Flame className="text-orange-600" size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-orange-600">{streak}</p>
            <p className="text-sm text-gray-600">semanas seguidas</p>
          </div>
        </div>
        
        {/* Melhoria */}
        {improvements.map(improvement => (
          <div key={improvement.metric} className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">+{improvement.percentage}%</p>
              <p className="text-sm text-gray-600">{improvement.metric}</p>
            </div>
          </div>
        ))}
        
        {/* Economia */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <DollarSign className="text-blue-600" size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">R$ {savings}</p>
            <p className="text-sm text-gray-600">economizados este mês</p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Calcular métricas no hook:**
```javascript
// src/hooks/useProgressMetrics.js
export function useProgressMetrics(userId) {
  const [metrics, setMetrics] = useState({
    streak: 0,
    improvements: [],
    savings: 0
  });
  
  useEffect(() => {
    async function calculateMetrics() {
      // Buscar histórico do Supabase
      const history = await menuService.getHistory(userId);
      
      // Calcular streak
      const streak = calculateStreak(history);
      
      // Comparar questionários (sono, energia, etc.)
      const improvements = compareAssessments(history);
      
      // Calcular economia (orçamento previsto vs gasto real)
      const savings = calculateSavings(history);
      
      setMetrics({ streak, improvements, savings });
    }
    
    calculateMetrics();
  }, [userId]);
  
  return metrics;
}
```

---

## SPRINT 5-6: BIBLIOTECA DE RECEITAS

### Tarefa 3.1: Modelo de Dados para Receitas Públicas

**Objetivo:** Transformar receitas geradas em conteúdo indexável.

**Schema do Supabase:**
```sql
-- supabase/migrations/add_public_recipes.sql
CREATE TABLE public_recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  prep_time INTEGER, -- em minutos
  cook_time INTEGER,
  servings INTEGER,
  ingredients JSONB NOT NULL,
  instructions JSONB NOT NULL,
  tags TEXT[] DEFAULT '{}',
  category TEXT,
  difficulty TEXT CHECK (difficulty IN ('fácil', 'médio', 'difícil')),
  calories INTEGER,
  cost_estimate DECIMAL(10,2),
  
  -- SEO
  meta_description TEXT,
  meta_keywords TEXT[],
  
  -- Engajamento
  view_count INTEGER DEFAULT 0,
  save_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  
  -- Origem
  source TEXT CHECK (source IN ('ai_generated', 'community', 'curated')),
  created_by UUID REFERENCES auth.users(id),
  
  -- Controle
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_public_recipes_slug ON public_recipes(slug);
CREATE INDEX idx_public_recipes_tags ON public_recipes USING GIN(tags);
CREATE INDEX idx_public_recipes_category ON public_recipes(category);
CREATE INDEX idx_public_recipes_published ON public_recipes(is_published) WHERE is_published = true;

-- RLS (Row Level Security)
ALTER TABLE public_recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Receitas públicas são visíveis para todos"
  ON public_recipes FOR SELECT
  USING (is_published = true);

CREATE POLICY "Apenas admin pode criar/editar receitas"
  ON public_recipes FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');
```

---

### Tarefa 3.2: Página de Biblioteca de Receitas

**Criar rota:** `/receitas`

**Componente principal:**
```jsx
// src/pages/ReceitasPage.jsx
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { RecipeCard } from '@/components/recipes/RecipeCard';
import { RecipeFilters } from '@/components/recipes/RecipeFilters';
import { generateMetaTags } from '@/utils/seo';
import { Helmet } from 'react-helmet-async';

export function ReceitasPage() {
  const [recipes, setRecipes] = useState([]);
  const [filters, setFilters] = useState({
    category: null,
    tags: [],
    difficulty: null
  });
  
  useEffect(() => {
    async function fetchRecipes() {
      let query = supabase
        .from('public_recipes')
        .select('*')
        .eq('is_published', true)
        .order('view_count', { ascending: false });
      
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      
      if (filters.tags.length > 0) {
        query = query.contains('tags', filters.tags);
      }
      
      if (filters.difficulty) {
        query = query.eq('difficulty', filters.difficulty);
      }
      
      const { data, error } = await query;
      if (!error) setRecipes(data);
    }
    
    fetchRecipes();
  }, [filters]);
  
  const meta = generateMetaTags({
    title: 'Receitas Saudáveis e Econômicas',
    description: 'Mais de 500 receitas práticas para o dia a dia. Organize suas refeições e economize tempo e dinheiro.',
    url: 'https://nuri.app.br/receitas'
  });
  
  return (
    <>
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-2">Receitas</h1>
        <p className="text-gray-600 mb-8">
          Pratique, saudáveis e econômicas para o seu dia a dia
        </p>
        
        <RecipeFilters filters={filters} onChange={setFilters} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {recipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </div>
    </>
  );
}
```

---

### Tarefa 3.3: Página Individual de Receita

**Rota:** `/receita/[slug]`

**Componente:**
```jsx
// src/pages/ReceitaDetailPage.jsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { generateRecipeSchema } from '@/utils/recipeSchema';
import { Helmet } from 'react-helmet-async';
import { Clock, Users, ChefHat, DollarSign } from 'lucide-react';

export function ReceitaDetailPage() {
  const { slug } = useParams();
  const [recipe, setRecipe] = useState(null);
  
  useEffect(() => {
    async function fetchRecipe() {
      const { data, error } = await supabase
        .from('public_recipes')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();
      
      if (!error) {
        setRecipe(data);
        // Incrementar visualizações
        await supabase
          .from('public_recipes')
          .update({ view_count: data.view_count + 1 })
          .eq('id', data.id);
      }
    }
    
    fetchRecipe();
  }, [slug]);
  
  if (!recipe) return <div>Carregando...</div>;
  
  const recipeSchema = generateRecipeSchema(recipe);
  
  return (
    <>
      <Helmet>
        <title>{recipe.title} | NURI Receitas</title>
        <meta name="description" content={recipe.meta_description || recipe.description} />
        <script type="application/ld+json">
          {JSON.stringify(recipeSchema)}
        </script>
      </Helmet>
      
      <article className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{recipe.title}</h1>
          <p className="text-xl text-gray-600 mb-6">{recipe.description}</p>
          
          {/* Meta info */}
          <div className="flex flex-wrap gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Clock size={18} />
              <span>{recipe.prep_time + recipe.cook_time} min</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={18} />
              <span>{recipe.servings} porções</span>
            </div>
            <div className="flex items-center gap-2">
              <ChefHat size={18} />
              <span>{recipe.difficulty}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign size={18} />
              <span>~R$ {recipe.cost_estimate?.toFixed(2)}</span>
            </div>
          </div>
        </header>
        
        {/* Ingredientes */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Ingredientes</h2>
          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>{ingredient}</span>
              </li>
            ))}
          </ul>
        </section>
        
        {/* Modo de preparo */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Modo de preparo</h2>
          <ol className="space-y-4">
            {recipe.instructions.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold">
                  {i + 1}
                </span>
                <p className="pt-1">{step}</p>
              </li>
            ))}
          </ol>
        </section>
        
        {/* Ações */}
        <section className="flex gap-4">
          <button className="btn-primary">
            Adicionar ao meu cardápio
          </button>
          <button className="btn-secondary">
            Compartilhar
          </button>
        </section>
      </article>
    </>
  );
}
```

---

## SPRINT 7-8: INDICAÇÃO ORGÂNICA

### Tarefa 4.1: Sistema de Compartilhamento

**Objetivo:** Facilitar que usuários indiquem o app naturalmente.

**Criar componente `<SharePrompt>`:**
```jsx
// src/components/share/SharePrompt.jsx
import { Share2, MessageCircle, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export function SharePrompt({ onClose }) {
  const [copied, setCopied] = useState(false);
  
  const shareUrl = 'https://nuri.app.br';
  const shareText = `Oi! Achei esse app que me salvou na correria da semana. Gera cardápio + lista de compras em 5min. É grátis: ${shareUrl}`;
  
  const handleWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleNativeShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: 'NURI - Nutrição Inteligente',
        text: shareText,
        url: shareUrl
      });
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <h3 className="text-2xl font-bold mb-2">Sua semana está organizada! 🎉</h3>
        <p className="text-gray-600 mb-6">
          Conhece alguém que também vive corrido? Compartilhe o NURI!
        </p>
        
        <div className="space-y-3">
          {/* WhatsApp */}
          <button
            onClick={handleWhatsApp}
            className="w-full flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition"
          >
            <MessageCircle size={20} />
            Compartilhar no WhatsApp
          </button>
          
          {/* Compartilhamento nativo (mobile) */}
          {navigator.share && (
            <button
              onClick={handleNativeShare}
              className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition"
            >
              <Share2 size={20} />
              Compartilhar
            </button>
          )}
          
          {/* Copiar link */}
          <button
            onClick={handleCopy}
            className="w-full flex items-center justify-center gap-3 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg transition"
          >
            {copied ? <Check size={20} className="text-green-600" /> : <Copy size={20} />}
            {copied ? 'Copiado!' : 'Copiar mensagem'}
          </button>
        </div>
        
        <button
          onClick={onClose}
          className="w-full mt-4 text-gray-500 hover:text-gray-700 py-2"
        >
          Agora não
        </button>
      </div>
    </div>
  );
}
```

**Gatilho após gerar cardápio:**
```jsx
// src/components/steps/menu/MenuDisplay.jsx
import { useState, useEffect } from 'react';
import { SharePrompt } from '@/components/share/SharePrompt';

function MenuDisplay({ menu }) {
  const [showSharePrompt, setShowSharePrompt] = useState(false);
  
  useEffect(() => {
    // Mostrar após 5 segundos que o cardápio foi gerado
    const timer = setTimeout(() => {
      // Só mostrar se não foi mostrado nesta sessão
      if (!sessionStorage.getItem('share_prompt_shown')) {
        setShowSharePrompt(true);
        sessionStorage.setItem('share_prompt_shown', 'true');
      }
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <>
      {/* Cardápio */}
      <div>...</div>
      
      {/* Prompt de compartilhamento */}
      {showSharePrompt && (
        <SharePrompt onClose={() => setShowSharePrompt(false)} />
      )}
    </>
  );
}
```

---

### Tarefa 4.2: Sistema de Referral (Opcional)

**Objetivo:** Gamificar indicações com recompensas.

**Schema:**
```sql
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID REFERENCES auth.users(id),
  referred_email TEXT,
  referred_id UUID REFERENCES auth.users(id),
  status TEXT CHECK (status IN ('pending', 'converted', 'rewarded')),
  reward_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  converted_at TIMESTAMPTZ,
  rewarded_at TIMESTAMPTZ
);
```

**Hook:**
```javascript
// src/hooks/useReferral.js
export function useReferral(userId) {
  const [referralCode, setReferralCode] = useState('');
  const [referrals, setReferrals] = useState([]);
  
  useEffect(() => {
    async function loadReferrals() {
      const { data } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_id', userId);
      
      setReferrals(data || []);
    }
    
    loadReferrals();
  }, [userId]);
  
  const rewards = calculateRewards(referrals);
  
  return { referralCode, referrals, rewards };
}
```

---

## CHECKLIST DE IMPLEMENTAÇÃO

**Última atualização:** fev/2026 — Sprints reorganizados por estado (feito / próximo / backlog).

---

### ✅ SPRINT SEO — CONCLUÍDO
- [x] Criar componente `<SEOPage>` com meta tags (react-helmet-async)
- [x] Implementar página `/como-funciona`
- [x] Implementar página `/para-quem-e`
- [x] Criar estrutura de `/blog` (listagem + `/blog/[slug]`)
- [x] Escrever 5 artigos de blog iniciais (cardápio econômico, planejamento familiar, receitas 30min, economia mercado, lista compras)
- [x] Configurar sitemap.xml automático (scripts/generate-sitemap.js no build)
- [x] Adicionar Schema.org FAQPage em `/como-funciona`; Article nos posts do blog
- [x] Configurar Open Graph por página (SEOPage + Helmet)
- [x] Criar robots.txt (public/robots.txt)
- [x] Configurar Google Search Console (verificação + sitemap)
- [x] Configurar Google Analytics 4 no código (variável `VITE_GA_MEASUREMENT_ID` no Vercel)
- [ ] Testar compartilhamento no WhatsApp/Facebook (manual)

---

### 🔄 PRÓXIMO: Valor percebido no cardápio (Prioridade 1)
- [x] Criar componente por refeição (MealItemActions: Trocar, Repetir, Variação)
- [x] Ação "Repetir semana que vem" (salva no localStorage)
- [ ] Implementar **Trocar** de verdade (endpoint ou reuso generate-menu para substituir 1 refeição)
- [ ] Implementar **Sugerir variação** de verdade
- [ ] Usar pratos "Repetir" (localStorage) na próxima geração de cardápio
- [ ] (Opcional) Extrair lógica para hook `useMenuAdjustments`
- [ ] Criar componente `<WeeklyProgress>` (streak, melhorias, economia)
- [ ] Implementar hook `useProgressMetrics` e métricas (streak, comparação sono/energia, economia mensal)

---

### 📋 PRIORIDADE 2: Indicação orgânica
- [ ] Criar componente `<SharePrompt>`
- [ ] Implementar compartilhamento WhatsApp + copiar link + share nativo (mobile)
- [ ] Adicionar gatilho após geração de cardápio (ex.: 5s depois, 1x por sessão)
- [ ] (Opcional) Sistema de referral e recompensas

---

### 📋 PRIORIDADE 3: Biblioteca de receitas (maior esforço)
- [ ] Criar tabela `public_recipes` no Supabase + RLS
- [ ] Criar página `/receitas` (listagem) + `<RecipeCard>`, `<RecipeFilters>`
- [ ] Implementar rota `/receita/[slug]` (detalhe)
- [ ] Schema.org Recipe, contador de visualizações, botão "Salvar receita", busca

---

## MÉTRICAS DE SUCESSO

**Após 2 meses, validar:**

### SEO
- [ ] 500+ acessos orgânicos/mês (Google Search Console)
- [ ] 3+ palavras-chave no top 20 do Google
- [ ] 10+ páginas indexadas
- [ ] Taxa de cliques (CTR) > 2% no Search Console

### Engajamento
- [ ] 20%+ de usuários geram 2+ cardápios
- [ ] Tempo médio de sessão > 5 minutos
- [ ] Taxa de conclusão do fluxo > 40%

### Crescimento
- [ ] 5%+ taxa de indicação orgânica
- [ ] 100+ receitas visualizadas/mês
- [ ] 10%+ de usuários salvam receitas

---

## ORIENTAÇÕES TÉCNICAS PARA O CURSOR

### Princípios de código:
1. **Componentes pequenos e focados** (máx 200 linhas)
2. **Hooks customizados para lógica complexa**
3. **Priorizar legibilidade** sobre otimizações prematuras
4. **Testes unitários** para lógica crítica
5. **TypeScript ou JSDoc** para melhor DX

### Padrões de código:
```javascript
// ✅ BOM - Componente simples e focado
export function RecipeCard({ recipe }) {
  return (
    <article className="...">
      <h3>{recipe.title}</h3>
      <RecipeMeta recipe={recipe} />
      <RecipeActions recipe={recipe} />
    </article>
  );
}

// ❌ EVITAR - Componente com muita lógica
export function RecipeCard({ recipe }) {
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState(false);
  // ... 50 linhas de lógica
  return <div>...</div>;
}
```

### Estrutura de commits:
```
feat(seo): adicionar meta tags dinâmicas
fix(menu): corrigir bug ao substituir refeição
docs(readme): atualizar instruções de SEO
refactor(recipes): extrair lógica para hook customizado
```

---

## COMANDOS ÚTEIS

```bash
# Iniciar dev
npm run dev

# Build de produção
npm run build

# Testes
npm test
npm run test:coverage

# Gerar sitemap
node scripts/generate-sitemap.js

# Deploy
vercel --prod
```

---

## PRÓXIMOS PASSOS APÓS IMPLEMENTAÇÃO

1. **Monitorar Google Search Console**
   - Verificar quais páginas estão sendo indexadas
   - Identificar palavras-chave que estão rankeando
   - Corrigir erros de rastreamento

2. **A/B Testing (futuro)**
   - Testar diferentes CTAs
   - Testar posicionamento do SharePrompt
   - Testar copy das páginas

3. **Análise de comportamento**
   - Google Analytics 4 (eventos customizados)
   - Hotjar ou similar para heatmaps
   - Identificar pontos de abandono no fluxo

4. **Iteração baseada em dados**
   - Quais receitas são mais visualizadas?
   - Quais ajustes no cardápio são mais usados?
   - Qual conteúdo traz mais tráfego orgânico?

---

**IMPORTANTE:** Este prompt deve ser usado como guia. Implemente uma tarefa por vez, teste, valide com usuários reais e itere. Não tente implementar tudo de uma vez.