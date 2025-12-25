
import React from 'react';
import { Link } from 'react-router-dom';
import { Trip } from '../types';

interface TripCardProps {
  trip: Trip;
}

const TripCard: React.FC<TripCardProps> = ({ trip }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-40 bg-slate-200 relative">
        <img 
          src={`https://picsum.photos/seed/${trip.destination}/600/400`} 
          alt={trip.destination} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-semibold text-blue-600 uppercase">
          Upcoming
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-slate-900 mb-1">{trip.name}</h3>
        <p className="text-slate-500 flex items-center text-sm mb-4">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {trip.destination}
        </p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-xs text-slate-400 font-medium">
            {new Date(trip.startDate).toLocaleDateString()}
          </span>
          <Link 
            to={`/trip/${trip.id}`} 
            className="text-blue-600 text-sm font-semibold hover:underline"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TripCard;
