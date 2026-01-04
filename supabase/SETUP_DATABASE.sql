-- =====================================================
-- TRAVELWISE DATABASE SETUP - RUN THIS IN SUPABASE SQL EDITOR
-- =====================================================
-- Go to: https://supabase.com/dashboard/project/olidrbzhbgpsaqzkxlym/sql
-- Copy and paste this entire file, then click "Run"
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- STEP 1: CREATE TABLES
-- =====================================================

-- Create trips table
CREATE TABLE IF NOT EXISTS trips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  name TEXT NOT NULL,
  destination TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create trip_budgets table
CREATE TABLE IF NOT EXISTS trip_budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  transport NUMERIC DEFAULT 0,
  accommodation NUMERIC DEFAULT 0,
  food NUMERIC DEFAULT 0,
  activities NUMERIC DEFAULT 0
);

-- Create itinerary_days table
CREATE TABLE IF NOT EXISTS itinerary_days (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  activities TEXT[] DEFAULT '{}'
);

-- =====================================================
-- STEP 2: CREATE INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trip_budgets_trip_id ON trip_budgets(trip_id);
CREATE INDEX IF NOT EXISTS idx_itinerary_days_trip_id ON itinerary_days(trip_id);

-- =====================================================
-- STEP 3: DISABLE ROW LEVEL SECURITY (for anonymous access)
-- =====================================================

ALTER TABLE trips DISABLE ROW LEVEL SECURITY;
ALTER TABLE trip_budgets DISABLE ROW LEVEL SECURITY;
ALTER TABLE itinerary_days DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- DONE! Your database is now ready.
-- Refresh your TravelWise app and create a trip!
-- =====================================================
