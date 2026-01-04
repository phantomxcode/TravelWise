
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Trip, ItineraryDay, TripBudget, BudgetAnalysis } from '../types';
import { generateItinerary, analyzeBudget } from '../services/geminiService';
import { deleteTrip } from '../services/tripService';
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
  const [deleting, setDeleting] = useState(false);
  const [analyzingBudget, setAnalyzingBudget] = useState(false);
  const [budgetAnalysis, setBudgetAnalysis] = useState<BudgetAnalysis | null>(null);
  const [editingDayIdx, setEditingDayIdx] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<{ title: string, activities: string }>({ title: '', activities: '' });

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

  const handleAnalyzeBudget = async () => {
    if (!trip) return;

    setAnalyzingBudget(true);
    try {
      const start = new Date(trip.startDate);
      const end = new Date(trip.endDate);
      const duration = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)));

      const analysis = await analyzeBudget(trip.destination, duration, trip.budget);
      if (analysis) {
        setBudgetAnalysis(analysis);
        // Update trip with analysis
        const updatedTrip = { ...trip, budgetAnalysis: analysis };
        onUpdateTrip(updatedTrip);
        setTrip(updatedTrip);
      }
    } catch (error) {
      alert("Budget analysis failed. Check your API configuration.");
    } finally {
      setAnalyzingBudget(false);
    }
  };

  const handleDeleteTrip = async () => {
    if (!trip) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${trip.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeleting(true);
    try {
      const success = await deleteTrip(trip.id);
      if (success) {
        navigate('/trips');
      } else {
        alert('Failed to delete trip. Please try again.');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete trip. Please try again.');
    } finally {
      setDeleting(false);
    }
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
              <button
                onClick={handleDeleteTrip}
                disabled={deleting}
                className="ml-3 bg-red-500/80 hover:bg-red-600 backdrop-blur text-white px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-50 flex items-center gap-2"
                title="Delete Trip"
              >
                {deleting ? (
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                )}
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
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
                <p className="text-3xl font-extrabold text-blue-600">₹{calculateTotalBudget().toLocaleString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Transport</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
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
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
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
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
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
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
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

            {/* Analyze Budget Button */}
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleAnalyzeBudget}
                disabled={analyzingBudget || calculateTotalBudget() === 0}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-teal-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-200"
              >
                {analyzingBudget ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    AI Analyze Budget
                  </>
                )}
              </button>
            </div>

            {/* Budget Analysis Results */}
            {(budgetAnalysis || trip.budgetAnalysis) && (
              <div className="mt-8 bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl p-6 border border-blue-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-blue-900">AI Budget Analysis</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-blue-600">Score:</span>
                    <span className={`text-2xl font-bold ${(budgetAnalysis?.overallScore || trip.budgetAnalysis?.overallScore || 0) >= 70 ? 'text-green-600' :
                      (budgetAnalysis?.overallScore || trip.budgetAnalysis?.overallScore || 0) >= 50 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                      {budgetAnalysis?.overallScore || trip.budgetAnalysis?.overallScore}/100
                    </span>
                  </div>
                </div>

                <p className="text-slate-700 mb-4">{budgetAnalysis?.summary || trip.budgetAnalysis?.summary}</p>

                {/* Category Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {(budgetAnalysis?.categoryBreakdown || trip.budgetAnalysis?.categoryBreakdown)?.map((cat, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-xl border border-blue-100">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-slate-800">{cat.category}</span>
                        <span className={`text-xs px-2 py-1 rounded-full font-bold ${cat.assessment.toLowerCase().includes('good') ? 'bg-green-100 text-green-700' :
                          cat.assessment.toLowerCase().includes('high') ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                          {cat.percentage}% - {cat.assessment}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600">{cat.tip}</p>
                    </div>
                  ))}
                </div>

                {/* Savings Tips */}
                {(budgetAnalysis?.savingsTips || trip.budgetAnalysis?.savingsTips)?.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-bold text-green-700 mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Money-Saving Tips
                    </h4>
                    <ul className="space-y-1">
                      {(budgetAnalysis?.savingsTips || trip.budgetAnalysis?.savingsTips)?.map((tip, idx) => (
                        <li key={idx} className="text-sm text-slate-600 flex items-start">
                          <span className="text-green-500 mr-2">✓</span> {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Warnings */}
                {(budgetAnalysis?.warnings || trip.budgetAnalysis?.warnings)?.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                    <h4 className="font-bold text-amber-700 mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      Warnings
                    </h4>
                    <ul className="space-y-1">
                      {(budgetAnalysis?.warnings || trip.budgetAnalysis?.warnings)?.map((warning, idx) => (
                        <li key={idx} className="text-sm text-amber-800 flex items-start">
                          <span className="text-amber-500 mr-2">⚠</span> {warning}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
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
                            onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Day Title"
                          />
                          <textarea
                            value={editFormData.activities}
                            onChange={(e) => setEditFormData({ ...editFormData, activities: e.target.value })}
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
