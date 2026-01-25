-- =============================================
-- ATUALIZAÇÃO DE RLS PARA SEGURANÇA POR USUÁRIO
-- Execute este SQL no Supabase SQL Editor
-- =============================================

-- 1. Adicionar coluna user_id na tabela families
ALTER TABLE families ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. Criar índice para user_id
CREATE INDEX IF NOT EXISTS idx_families_user ON families(user_id);

-- 3. Remover políticas antigas permissivas
DROP POLICY IF EXISTS "Allow all for families" ON families;
DROP POLICY IF EXISTS "Allow all for profiles" ON profiles;
DROP POLICY IF EXISTS "Allow all for weekly_assessments" ON weekly_assessments;
DROP POLICY IF EXISTS "Allow all for weekly_contexts" ON weekly_contexts;
DROP POLICY IF EXISTS "Allow all for menus" ON menus;
DROP POLICY IF EXISTS "Allow all for menu_feedback" ON menu_feedback;

-- =============================================
-- NOVAS POLÍTICAS DE SEGURANÇA
-- =============================================

-- FAMILIES: Usuário só vê/edita suas próprias famílias
CREATE POLICY "Users can view own families"
  ON families FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own families"
  ON families FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own families"
  ON families FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own families"
  ON families FOR DELETE
  USING (auth.uid() = user_id);

-- PROFILES: Usuário só vê perfis das suas famílias
CREATE POLICY "Users can view profiles of own families"
  ON profiles FOR SELECT
  USING (
    family_id IN (
      SELECT id FROM families WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert profiles in own families"
  ON profiles FOR INSERT
  WITH CHECK (
    family_id IN (
      SELECT id FROM families WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update profiles in own families"
  ON profiles FOR UPDATE
  USING (
    family_id IN (
      SELECT id FROM families WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete profiles in own families"
  ON profiles FOR DELETE
  USING (
    family_id IN (
      SELECT id FROM families WHERE user_id = auth.uid()
    )
  );

-- MENUS: Usuário só vê cardápios das suas famílias
CREATE POLICY "Users can view menus of own families"
  ON menus FOR SELECT
  USING (
    family_id IN (
      SELECT id FROM families WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert menus in own families"
  ON menus FOR INSERT
  WITH CHECK (
    family_id IN (
      SELECT id FROM families WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update menus in own families"
  ON menus FOR UPDATE
  USING (
    family_id IN (
      SELECT id FROM families WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete menus in own families"
  ON menus FOR DELETE
  USING (
    family_id IN (
      SELECT id FROM families WHERE user_id = auth.uid()
    )
  );

-- WEEKLY_CONTEXTS: Usuário só vê contextos das suas famílias
CREATE POLICY "Users can view weekly_contexts of own families"
  ON weekly_contexts FOR SELECT
  USING (
    family_id IN (
      SELECT id FROM families WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert weekly_contexts in own families"
  ON weekly_contexts FOR INSERT
  WITH CHECK (
    family_id IN (
      SELECT id FROM families WHERE user_id = auth.uid()
    )
  );

-- WEEKLY_ASSESSMENTS: Usuário só vê avaliações dos perfis das suas famílias
CREATE POLICY "Users can view weekly_assessments of own profiles"
  ON weekly_assessments FOR SELECT
  USING (
    profile_id IN (
      SELECT p.id FROM profiles p
      JOIN families f ON p.family_id = f.id
      WHERE f.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert weekly_assessments in own profiles"
  ON weekly_assessments FOR INSERT
  WITH CHECK (
    profile_id IN (
      SELECT p.id FROM profiles p
      JOIN families f ON p.family_id = f.id
      WHERE f.user_id = auth.uid()
    )
  );

-- MENU_FEEDBACK: Usuário só vê feedback dos seus cardápios
CREATE POLICY "Users can view menu_feedback of own menus"
  ON menu_feedback FOR SELECT
  USING (
    menu_id IN (
      SELECT m.id FROM menus m
      JOIN families f ON m.family_id = f.id
      WHERE f.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert menu_feedback in own menus"
  ON menu_feedback FOR INSERT
  WITH CHECK (
    menu_id IN (
      SELECT m.id FROM menus m
      JOIN families f ON m.family_id = f.id
      WHERE f.user_id = auth.uid()
    )
  );

-- =============================================
-- FUNÇÃO PARA EXCLUIR TODOS OS DADOS DO USUÁRIO
-- =============================================
CREATE OR REPLACE FUNCTION delete_user_data(target_user_id UUID)
RETURNS void AS $$
BEGIN
  -- Deletar famílias (cascata deleta perfis, menus, etc.)
  DELETE FROM families WHERE user_id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Permitir que usuário execute a função para seus próprios dados
-- (em produção, isso seria feito via Edge Function)
