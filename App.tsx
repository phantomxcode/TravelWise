
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Trip, TripBudget } from './types';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Trips from './pages/Trips';
import CreateTrip from './pages/CreateTrip';
import TripDetails from './pages/TripDetails';
import { fetchTrips, createTrip, updateTrip as updateTripService } from './services/tripService';

const App: React.FC = () => {
  const defaultBudget: TripBudget = {
    transport: 0,
    accommodation: 0,
    food: 0,
    activities: 0,
  };

  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  // Load trips from Supabase on mount
  useEffect(() => {
    const loadTrips = async () => {
      setLoading(true);
      const data = await fetchTrips();
      if (data.length > 0) {
        setTrips(data);
      } else {
        // Fallback sample data if no trips in DB
        setTrips([
          {
            id: '1',
            name: 'Summer in Tokyo',
            destination: 'Tokyo, Japan',
            startDate: '2024-07-15',
            endDate: '2024-07-25',
            itinerary: [
              {
                dayNumber: 1,
                title: 'Arrival and Shibuya Crossing',
                activities: ['Check in to hotel', 'Explore Shibuya', 'Dinner at an Izakaya']
              }
            ],
            budget: {
              transport: 1200,
              accommodation: 2500,
              food: 800,
              activities: 500,
            }
          },
          {
            id: '2',
            name: 'Parisian Escapade',
            destination: 'Paris, France',
            startDate: '2024-09-10',
            endDate: '2024-09-17',
            itinerary: [],
            budget: { ...defaultBudget }
          }
        ]);
      }
      setLoading(false);
    };
    loadTrips();
  }, []);

  const handleAddTrip = async (newTrip: Omit<Trip, 'id'>) => {
    const tripWithDefaults = {
      ...newTrip,
      itinerary: [],
      budget: { ...defaultBudget }
    };

    // Try to save to Supabase
    const savedTrip = await createTrip(tripWithDefaults);
    if (savedTrip) {
      setTrips(prev => [savedTrip, ...prev]);
    } else {
      // Fallback to local state if Supabase fails
      const localTrip: Trip = {
        ...tripWithDefaults,
        id: Date.now().toString()
      };
      setTrips(prev => [localTrip, ...prev]);
    }
  };

  const handleUpdateTrip = async (updatedTrip: Trip) => {
    // Optimistically update local state
    setTrips(prev => prev.map(t => t.id === updatedTrip.id ? updatedTrip : t));

    // Persist to Supabase
    await updateTripService(updatedTrip);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trips" element={<Trips trips={trips} />} />
          <Route
            path="/create"
            element={
              <CreateTrip onAddTrip={handleAddTrip} />
            }
          />
          <Route path="/trip/:id" element={<TripDetails trips={trips} onUpdateTrip={handleUpdateTrip} />} />
        </Routes>
      </main>
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm font-medium">
            © {new Date().getFullYear()} TravelWise. Built for adventurers.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
