-- Fix unique constraint for trip_budgets upsert
-- Run this in Supabase SQL Editor

-- First, delete any duplicate entries (keep the latest)
DELETE FROM trip_budgets a
USING trip_budgets b
WHERE a.trip_id = b.trip_id
AND a.id < b.id;

-- Add unique constraint on trip_id
ALTER TABLE trip_budgets
ADD CONSTRAINT trip_budgets_trip_id_unique UNIQUE (trip_id);

-- Verify
SELECT constraint_name FROM information_schema.table_constraints 
WHERE table_name = 'trip_budgets' AND constraint_type = 'UNIQUE';
