-- =====================================================
-- ADD BUDGET ANALYSIS COLUMN
-- Run this in Supabase SQL Editor after initial setup
-- =====================================================

-- Add budget_analysis column to trip_budgets table
ALTER TABLE trip_budgets 
ADD COLUMN IF NOT EXISTS budget_analysis JSONB DEFAULT NULL;

-- Add a comment for documentation
COMMENT ON COLUMN trip_budgets.budget_analysis IS 'AI-generated budget analysis from Gemini API';
