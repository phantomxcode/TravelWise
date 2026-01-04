-- ============================================
-- RLS FIX: Allow public access (no authentication)
-- Run this in Supabase SQL Editor if trips are not being saved
-- ============================================

-- Option 1: Disable RLS entirely (simplest for development)
ALTER TABLE trips DISABLE ROW LEVEL SECURITY;
ALTER TABLE trip_budgets DISABLE ROW LEVEL SECURITY;
ALTER TABLE itinerary_days DISABLE ROW LEVEL SECURITY;

-- OR Option 2: Create permissive policies for anonymous access
-- (Use this if you want RLS enabled but allow anyone to CRUD)
/*
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view own trips" ON trips;
DROP POLICY IF EXISTS "Users can insert own trips" ON trips;
DROP POLICY IF EXISTS "Users can update own trips" ON trips;
DROP POLICY IF EXISTS "Users can delete own trips" ON trips;
DROP POLICY IF EXISTS "Users can manage own trip budgets" ON trip_budgets;
DROP POLICY IF EXISTS "Users can manage own itinerary days" ON itinerary_days;

-- Create permissive policies for all operations
CREATE POLICY "Allow all operations on trips" ON trips FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on trip_budgets" ON trip_budgets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on itinerary_days" ON itinerary_days FOR ALL USING (true) WITH CHECK (true);
*/
