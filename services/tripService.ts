import { supabase, DbTrip, DbTripBudget, DbItineraryDay } from './supabaseClient';
import { Trip, ItineraryDay, TripBudget, BudgetAnalysis } from '../types';

// Convert database format to app format
const dbToTrip = (
    dbTrip: DbTrip,
    dbBudget: DbTripBudget | null,
    dbItinerary: DbItineraryDay[]
): Trip => ({
    id: dbTrip.id,
    name: dbTrip.name,
    destination: dbTrip.destination,
    description: dbTrip.description || undefined,
    startDate: dbTrip.start_date,
    endDate: dbTrip.end_date,
    budget: dbBudget ? {
        transport: Number(dbBudget.transport),
        accommodation: Number(dbBudget.accommodation),
        food: Number(dbBudget.food),
        activities: Number(dbBudget.activities),
    } : { transport: 0, accommodation: 0, food: 0, activities: 0 },
    itinerary: dbItinerary.map(day => ({
        dayNumber: day.day_number,
        title: day.title,
        activities: day.activities,
    })),
    budgetAnalysis: dbBudget?.budget_analysis as BudgetAnalysis | null,
});

// Fetch all trips
export const fetchTrips = async (): Promise<Trip[]> => {
    const { data: trips, error } = await supabase
        .from('trips')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching trips:', error);
        return [];
    }

    // Fetch budgets and itineraries for all trips
    const tripIds = trips.map(t => t.id);

    const { data: budgets } = await supabase
        .from('trip_budgets')
        .select('*')
        .in('trip_id', tripIds);

    const { data: itineraries } = await supabase
        .from('itinerary_days')
        .select('*')
        .in('trip_id', tripIds)
        .order('day_number');

    return trips.map(trip => {
        const budget = budgets?.find(b => b.trip_id === trip.id) || null;
        const itinerary = itineraries?.filter(i => i.trip_id === trip.id) || [];
        return dbToTrip(trip, budget, itinerary);
    });
};

// Fetch single trip by ID
export const fetchTripById = async (id: string): Promise<Trip | null> => {
    const { data: trip, error } = await supabase
        .from('trips')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !trip) {
        console.error('Error fetching trip:', error);
        return null;
    }

    const { data: budget } = await supabase
        .from('trip_budgets')
        .select('*')
        .eq('trip_id', id)
        .single();

    const { data: itinerary } = await supabase
        .from('itinerary_days')
        .select('*')
        .eq('trip_id', id)
        .order('day_number');

    return dbToTrip(trip, budget, itinerary || []);
};

// Create a new trip
export const createTrip = async (trip: Omit<Trip, 'id'>): Promise<Trip | null> => {
    // Insert trip
    const { data: newTrip, error: tripError } = await supabase
        .from('trips')
        .insert({
            name: trip.name,
            destination: trip.destination,
            description: trip.description || null,
            start_date: trip.startDate,
            end_date: trip.endDate,
        })
        .select()
        .single();

    if (tripError || !newTrip) {
        console.error('Error creating trip:', tripError);
        return null;
    }

    // Insert budget
    const { error: budgetError } = await supabase
        .from('trip_budgets')
        .insert({
            trip_id: newTrip.id,
            transport: trip.budget.transport,
            accommodation: trip.budget.accommodation,
            food: trip.budget.food,
            activities: trip.budget.activities,
        });

    if (budgetError) {
        console.error('Error creating budget:', budgetError);
    }

    // Insert itinerary days
    if (trip.itinerary.length > 0) {
        const { error: itineraryError } = await supabase
            .from('itinerary_days')
            .insert(
                trip.itinerary.map(day => ({
                    trip_id: newTrip.id,
                    day_number: day.dayNumber,
                    title: day.title,
                    activities: day.activities,
                }))
            );

        if (itineraryError) {
            console.error('Error creating itinerary:', itineraryError);
        }
    }

    return fetchTripById(newTrip.id);
};

// Update an existing trip
export const updateTrip = async (trip: Trip): Promise<Trip | null> => {
    // Update trip
    const { error: tripError } = await supabase
        .from('trips')
        .update({
            name: trip.name,
            destination: trip.destination,
            description: trip.description || null,
            start_date: trip.startDate,
            end_date: trip.endDate,
        })
        .eq('id', trip.id);

    if (tripError) {
        console.error('Error updating trip:', tripError);
        return null;
    }

    // Update budget
    const { error: budgetError } = await supabase
        .from('trip_budgets')
        .upsert({
            trip_id: trip.id,
            transport: trip.budget.transport,
            accommodation: trip.budget.accommodation,
            food: trip.budget.food,
            activities: trip.budget.activities,
            budget_analysis: trip.budgetAnalysis || null,
        }, { onConflict: 'trip_id' });

    if (budgetError) {
        console.error('Error updating budget:', budgetError);
    }

    // Delete old itinerary and insert new
    await supabase
        .from('itinerary_days')
        .delete()
        .eq('trip_id', trip.id);

    if (trip.itinerary.length > 0) {
        const { error: itineraryError } = await supabase
            .from('itinerary_days')
            .insert(
                trip.itinerary.map(day => ({
                    trip_id: trip.id,
                    day_number: day.dayNumber,
                    title: day.title,
                    activities: day.activities,
                }))
            );

        if (itineraryError) {
            console.error('Error updating itinerary:', itineraryError);
        }
    }

    return fetchTripById(trip.id);
};

// Delete a trip
export const deleteTrip = async (id: string): Promise<boolean> => {
    const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting trip:', error);
        return false;
    }

    return true;
};
