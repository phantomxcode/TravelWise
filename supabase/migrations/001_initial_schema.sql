-- TravelWise Database Schema for Supabase
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard → SQL Editor
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- ============================================
-- TRIPS TABLE
-- Stores basic trip information
-- ============================================
CREATE TABLE trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    name TEXT NOT NULL,
    destination TEXT NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
-- ============================================
-- TRIP BUDGETS TABLE
-- One-to-one with trips, stores budget categories
-- ============================================
CREATE TABLE trip_budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    transport NUMERIC DEFAULT 0,
    accommodation NUMERIC DEFAULT 0,
    food NUMERIC DEFAULT 0,
    activities NUMERIC DEFAULT 0
);
-- ============================================
-- ITINERARY DAYS TABLE
-- One-to-many with trips, stores daily plans
-- ============================================
CREATE TABLE itinerary_days (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    activities TEXT [] DEFAULT '{}'
);
-- ============================================
-- INDEXES
-- Improve query performance
-- ============================================
CREATE INDEX idx_trips_user_id ON trips(user_id);
CREATE INDEX idx_trip_budgets_trip_id ON trip_budgets(trip_id);
CREATE INDEX idx_itinerary_days_trip_id ON itinerary_days(trip_id);
-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- Users can only access their own data
-- ============================================
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE itinerary_days ENABLE ROW LEVEL SECURITY;
-- Trips policies
CREATE POLICY "Users can view own trips" ON trips FOR
SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own trips" ON trips FOR
INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own trips" ON trips FOR
UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own trips" ON trips FOR DELETE USING (auth.uid() = user_id);
-- Budget policies (cascade from trips)
CREATE POLICY "Users can manage own trip budgets" ON trip_budgets FOR ALL USING (
    trip_id IN (
        SELECT id
        FROM trips
        WHERE user_id = auth.uid()
    )
);
-- Itinerary policies (cascade from trips)
CREATE POLICY "Users can manage own itinerary days" ON itinerary_days FOR ALL USING (
    trip_id IN (
        SELECT id
        FROM trips
        WHERE user_id = auth.uid()
    )
);
-- ============================================
-- TRIGGER: Auto-update updated_at timestamp
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER update_trips_updated_at BEFORE
UPDATE ON trips FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();