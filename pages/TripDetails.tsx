
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Trip, ItineraryDay, TripBudget } from '../types';
import { generateItinerary } from '../services/geminiService';
import MapPreview from '../components/MapPreview';

interface TripDetailsProps {
  trips: Trip[];
  onUpdateTrip: (trip: Trip) => void;
}

const TripDetails: React.FC<TripDetailsProps> = ({ trips, onUpdateTrip }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(false);
  const [editingDayIdx, setEditingDayIdx] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<{title: string, activities: string}>({title: '', activities: ''});

  useEffect(() => {
    const foundTrip = trips.find(t => t.id === id);
    if (foundTrip) {
      setTrip(foundTrip);
    } else {
      navigate('/trips');
    }
  }, [id, trips, navigate]);

  const handleGenerateAI = async () => {
    if (!trip) return;
    
    setLoading(true);
    try {
      const start = new Date(trip.startDate);
      const end = new Date(trip.endDate);
      const duration = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)));
      
      const result = await generateItinerary(trip.destination, Math.min(duration, 7));
      const updatedTrip = { ...trip, itinerary: result };
      onUpdateTrip(updatedTrip);
      setTrip(updatedTrip);
    } catch (error) {
      alert("AI Generation failed. Check your API configuration.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddDay = () => {
    if (!trip) return;
    const nextDayNumber = trip.itinerary.length + 1;
    const newDay: ItineraryDay = {
      dayNumber: nextDayNumber,
      title: `Day ${nextDayNumber} Adventures`,
      activities: ['Explore the city']
    };
    const updatedTrip = { ...trip, itinerary: [...trip.itinerary, newDay] };
    onUpdateTrip(updatedTrip);
    setTrip(updatedTrip);
  };

  const startEditing = (idx: number) => {
    const day = trip?.itinerary[idx];
    if (day) {
      setEditingDayIdx(idx);
      setEditFormData({
        title: day.title,
        activities: day.activities.join('\n')
      });
    }
  };

  const saveEdit = () => {
    if (!trip || editingDayIdx === null) return;
    
    const updatedItinerary = [...trip.itinerary];
    updatedItinerary[editingDayIdx] = {
      ...updatedItinerary[editingDayIdx],
      title: editFormData.title,
      activities: editFormData.activities.split('\n').filter(a => a.trim() !== '')
    };

    const updatedTrip = { ...trip, itinerary: updatedItinerary };
    onUpdateTrip(updatedTrip);
    setTrip(updatedTrip);
    setEditingDayIdx(null);
  };

  const handleBudgetChange = (category: keyof TripBudget, value: string) => {
    if (!trip) return;
    const numValue = parseFloat(value) || 0;
    const updatedTrip = {
      ...trip,
      budget: {
        ...trip.budget,
        [category]: numValue
      }
    };
    setTrip(updatedTrip);
    onUpdateTrip(updatedTrip);
  };

  const calculateTotalBudget = () => {
    if (!trip) return 0;
    return (
      trip.budget.transport +
      trip.budget.accommodation +
      trip.budget.food +
      trip.budget.activities
    );
  };

  if (!trip) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <Link to="/trips" className="text-blue-600 font-semibold mb-6 inline-flex items-center hover:underline">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Trips
      </Link>

      <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm mb-8">
        <div className="relative h-64 md:h-80">
          <img 
            src={`https://picsum.photos/seed/${trip.destination}/1200/600`} 
            alt={trip.destination} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
            <div className="p-8 text-white w-full flex justify-between items-end">
              <div>
                <h1 className="text-4xl font-bold mb-2">{trip.name}</h1>
                <p className="flex items-center text-lg opacity-90">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  {trip.destination}
                </p>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-xl px-4 py-2 text-sm font-medium">
                {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Map Section */}
          <div className="mb-12">
            <MapPreview location={trip.destination} />
          </div>

          {/* Budget Section */}
          <div className="mb-12">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Budget Planner</h2>
                <p className="text-slate-500">Track your estimated expenses.</p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-1">Total Estimated</p>
                <p className="text-3xl font-extrabold text-blue-600">${calculateTotalBudget().toLocaleString()}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Transport</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    value={trip.budget.transport || ''}
                    onChange={(e) => handleBudgetChange('transport', e.target.value)}
                    className="w-full pl-7 pr-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Accommodation</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    value={trip.budget.accommodation || ''}
                    onChange={(e) => handleBudgetChange('accommodation', e.target.value)}
                    className="w-full pl-7 pr-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Food</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    value={trip.budget.food || ''}
                    onChange={(e) => handleBudgetChange('food', e.target.value)}
                    className="w-full pl-7 pr-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Activities</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    value={trip.budget.activities || ''}
                    onChange={(e) => handleBudgetChange('activities', e.target.value)}
                    className="w-full pl-7 pr-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-10">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Your Itinerary</h2>
              <div className="flex gap-3">
                <button 
                  onClick={handleAddDay}
                  className="flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all"
                >
                  + Add Day
                </button>
                <button 
                  onClick={handleGenerateAI}
                  disabled={loading}
                  className="flex items-center px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-md shadow-indigo-100"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      AI Suggest
                    </>
                  )}
                </button>
              </div>
            </div>

            {trip.itinerary.length === 0 ? (
              <div className="bg-slate-50 border border-slate-200 border-dashed rounded-2xl p-12 text-center">
                <p className="text-slate-500 font-medium">No plans yet. Add a day or let AI help you!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {trip.itinerary.map((day, idx) => (
                  <div key={idx} className="flex gap-6 group">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-lg">
                        {day.dayNumber}
                      </div>
                      {idx !== trip.itinerary.length - 1 && <div className="w-0.5 h-full bg-slate-200 my-2"></div>}
                    </div>
                    
                    <div className="flex-1 bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-200 transition-colors shadow-sm mb-2">
                      {editingDayIdx === idx ? (
                        <div className="space-y-4">
                          <input 
                            value={editFormData.title}
                            onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Day Title"
                          />
                          <textarea 
                            value={editFormData.activities}
                            onChange={(e) => setEditFormData({...editFormData, activities: e.target.value})}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                            placeholder="Enter activities (one per line)"
                          />
                          <div className="flex gap-2">
                            <button onClick={saveEdit} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold">Save</button>
                            <button onClick={() => setEditingDayIdx(null)} className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-bold">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="font-bold text-slate-900 text-xl">{day.title}</h3>
                            <button 
                              onClick={() => startEditing(idx)}
                              className="text-slate-400 hover:text-blue-600 transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                          </div>
                          <ul className="space-y-3">
                            {day.activities.map((activity, aIdx) => (
                              <li key={aIdx} className="flex items-start text-slate-600">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 mr-3 flex-shrink-0"></span>
                                <span className="text-md">{activity}</span>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetails;
