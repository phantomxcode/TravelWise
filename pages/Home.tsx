
import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-blue-50">
      <div className="text-center max-w-3xl">
        <h1 className="text-5xl font-extrabold text-slate-900 sm:text-6xl tracking-tight mb-6">
          Your Next Adventure <br />
          <span className="text-blue-600">Starts Here.</span>
        </h1>
        <p className="mt-3 text-lg text-slate-500 sm:text-xl max-w-2xl mx-auto mb-10">
          TravelWise makes planning simple. Organize your trips, set dates, and get AI-powered itinerary suggestions for any destination in the world.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/create"
            className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 md:text-lg"
          >
            Create Your First Trip
          </Link>
          <Link
            to="/trips"
            className="inline-flex items-center justify-center px-8 py-4 border border-slate-200 text-base font-bold rounded-xl text-slate-700 bg-white hover:bg-slate-50 md:text-lg"
          >
            View My Trips
          </Link>
        </div>
      </div>
      
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Smart Scheduling</h3>
          <p className="text-slate-500">Keep track of your start and end dates effortlessly with our intuitive interface.</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">AI Itineraries</h3>
          <p className="text-slate-500">Let Gemini generate personalized daily activities based on your destination and stay length.</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Stay Organized</h3>
          <p className="text-slate-500">All your travel details stored in one clean, beautiful place for easy access anywhere.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
