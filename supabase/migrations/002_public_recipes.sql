-- =============================================
-- MIGRATION: Biblioteca de receitas (public_recipes + saved_recipes)
-- Execute no Supabase SQL Editor após o schema base
-- =============================================

-- Tabela de receitas públicas (catálogo)
CREATE TABLE IF NOT EXISTS public_recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  ingredients JSONB NOT NULL DEFAULT '[]',
  instructions TEXT NOT NULL DEFAULT '',
  prep_time_minutes INTEGER,
  cook_time_minutes INTEGER,
  servings INTEGER,
  category VARCHAR(100),
  tags TEXT[] DEFAULT '{}',
  view_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE public_recipes IS 'Receitas públicas da biblioteca NURI – leitura aberta';
COMMENT ON COLUMN public_recipes.ingredients IS 'Array de strings, ex: ["2 xícaras de arroz", "1 cebola"]';
COMMENT ON COLUMN public_recipes.category IS 'Ex: Prato principal, Sobremesa, Lanche, Café da manhã';

CREATE INDEX IF NOT EXISTS idx_public_recipes_slug ON public_recipes(slug);
CREATE INDEX IF NOT EXISTS idx_public_recipes_category ON public_recipes(category);
CREATE INDEX IF NOT EXISTS idx_public_recipes_tags ON public_recipes USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_public_recipes_created ON public_recipes(created_at DESC);

-- RLS: todos podem ler; escrita apenas via service role (admin/backend)
ALTER TABLE public_recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view public_recipes"
  ON public_recipes FOR SELECT
  USING (true);

-- Política de update apenas para incrementar view_count (qualquer anon/auth pode chamar uma function)
-- Inserção/edição de receitas: fazer via Dashboard ou Edge Function com service role

-- Tabela de receitas salvas pelo usuário (favoritos)
CREATE TABLE IF NOT EXISTS saved_recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipe_id UUID NOT NULL REFERENCES public_recipes(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, recipe_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_recipes_user ON saved_recipes(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_recipes_recipe ON saved_recipes(recipe_id);

ALTER TABLE saved_recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own saved_recipes"
  ON saved_recipes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved_recipes"
  ON saved_recipes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved_recipes"
  ON saved_recipes FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger para updated_at em public_recipes
CREATE TRIGGER update_public_recipes_updated_at
  BEFORE UPDATE ON public_recipes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para incrementar view_count (chamada pelo front com RPC ou UPDATE com policy)
-- Permitir que qualquer um incremente view_count (apenas essa coluna)
CREATE OR REPLACE FUNCTION increment_recipe_views(recipe_slug TEXT)
RETURNS void AS $$
BEGIN
  UPDATE public_recipes
  SET view_count = view_count + 1
  WHERE slug = recipe_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Permite anon e authenticated chamarem (só incrementa contador)
GRANT EXECUTE ON FUNCTION increment_recipe_views(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION increment_recipe_views(TEXT) TO authenticated;
