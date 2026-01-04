import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Debug logging
console.log('Supabase URL:', supabaseUrl ? 'Set ✓' : 'MISSING ✗');
console.log('Supabase Key:', supabaseAnonKey ? 'Set ✓' : 'MISSING ✗');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types matching the Supabase schema
export interface DbTrip {
    id: string;
    user_id: string | null;
    name: string;
    destination: string;
    description: string | null;
    start_date: string;
    end_date: string;
    created_at: string;
    updated_at: string;
}

export interface DbTripBudget {
    id: string;
    trip_id: string;
    transport: number;
    accommodation: number;
    food: number;
    activities: number;
    budget_analysis: object | null;
}

export interface DbItineraryDay {
    id: string;
    trip_id: string;
    day_number: number;
    title: string;
    activities: string[];
}
