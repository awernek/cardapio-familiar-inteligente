-- =============================================
-- MIGRATION: Adicionar localização na tabela families
-- Execute este SQL no Supabase SQL Editor
-- =============================================

-- Adicionar campos de localização
ALTER TABLE families 
ADD COLUMN IF NOT EXISTS state VARCHAR(2),
ADD COLUMN IF NOT EXISTS city VARCHAR(100);

-- Comentários para documentação
COMMENT ON COLUMN families.state IS 'Sigla do estado brasileiro (ex: SP, RJ, MG)';
COMMENT ON COLUMN families.city IS 'Nome da cidade';

-- Índice para buscas por localização (opcional, útil para analytics futuro)
CREATE INDEX IF NOT EXISTS idx_families_location ON families(state, city);
