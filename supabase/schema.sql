-- =============================================
-- SCHEMA DO CARDÁPIO FAMILIAR INTELIGENTE
-- Execute este SQL no Supabase SQL Editor
-- =============================================

-- Habilitar extensão para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TABELA: families (Famílias/Grupos)
-- =============================================
CREATE TABLE IF NOT EXISTS families (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- TABELA: profiles (Membros da Família)
-- =============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id UUID REFERENCES families(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  age INTEGER,
  sex VARCHAR(20),
  weight DECIMAL(5,2),
  height DECIMAL(5,2),
  body_type VARCHAR(50),
  restrictions TEXT,
  goals TEXT,
  health_conditions TEXT,
  medications TEXT,
  activity_level VARCHAR(50),
  meal_times TEXT,
  cooking_skill VARCHAR(50),
  routine TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- TABELA: weekly_assessments (Avaliações Semanais)
-- =============================================
CREATE TABLE IF NOT EXISTS weekly_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  stress VARCHAR(50),
  stress_time VARCHAR(50),
  sleep VARCHAR(50),
  sleep_hours VARCHAR(50),
  sleep_problem VARCHAR(50),
  energy VARCHAR(50),
  appetite VARCHAR(50),
  appetite_time VARCHAR(50),
  symptoms TEXT,
  preferences TEXT,
  followed_plan VARCHAR(50),
  not_followed_reason VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- TABELA: weekly_contexts (Contexto Semanal da Família)
-- =============================================
CREATE TABLE IF NOT EXISTS weekly_contexts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id UUID REFERENCES families(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  busy VARCHAR(50),
  budget VARCHAR(50),
  grocery_trips VARCHAR(50),
  cooking_time VARCHAR(50),
  cooking_reality VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- TABELA: menus (Cardápios Gerados)
-- =============================================
CREATE TABLE IF NOT EXISTS menus (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id UUID REFERENCES families(id) ON DELETE CASCADE,
  weekly_context_id UUID REFERENCES weekly_contexts(id) ON DELETE SET NULL,
  week_start DATE NOT NULL,
  menu_data JSONB NOT NULL,
  weekly_tips TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- TABELA: menu_feedback (Feedback dos Cardápios)
-- =============================================
CREATE TABLE IF NOT EXISTS menu_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  menu_id UUID REFERENCES menus(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  day_index INTEGER,
  meal_type VARCHAR(20), -- breakfast, lunch, dinner, snack
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ÍNDICES PARA PERFORMANCE
-- =============================================
CREATE INDEX IF NOT EXISTS idx_profiles_family ON profiles(family_id);
CREATE INDEX IF NOT EXISTS idx_assessments_profile ON weekly_assessments(profile_id);
CREATE INDEX IF NOT EXISTS idx_assessments_week ON weekly_assessments(week_start);
CREATE INDEX IF NOT EXISTS idx_contexts_family ON weekly_contexts(family_id);
CREATE INDEX IF NOT EXISTS idx_menus_family ON menus(family_id);
CREATE INDEX IF NOT EXISTS idx_menus_week ON menus(week_start);

-- =============================================
-- POLÍTICAS DE SEGURANÇA (RLS)
-- Por enquanto desabilitado para desenvolvimento
-- Habilitar quando implementar autenticação
-- =============================================

-- Habilitar RLS nas tabelas (mas sem políticas restritivas por enquanto)
ALTER TABLE families ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_contexts ENABLE ROW LEVEL SECURITY;
ALTER TABLE menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_feedback ENABLE ROW LEVEL SECURITY;

-- Políticas permissivas para desenvolvimento (REMOVER EM PRODUÇÃO)
CREATE POLICY "Allow all for families" ON families FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for profiles" ON profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for weekly_assessments" ON weekly_assessments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for weekly_contexts" ON weekly_contexts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for menus" ON menus FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for menu_feedback" ON menu_feedback FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- FUNÇÃO PARA ATUALIZAR updated_at
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_families_updated_at
  BEFORE UPDATE ON families
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- DADOS INICIAIS (opcional)
-- =============================================
-- Criar uma família de exemplo para testes
-- INSERT INTO families (name) VALUES ('Família Teste');
