import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plane } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white/80 backdrop-blur-lg border-b border-slate-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <img
                src="/logo.png"
                alt="TravelWise"
                className="h-10 w-10 object-contain group-hover:scale-105 transition-transform"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent fugaz-one-regular">TravelWise</span>
            </Link>
          </div>
          <div className="hidden sm:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-xl font-medium transition-all ${isActive('/')
                ? 'bg-blue-50 text-blue-600'
                : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'
                }`}
            >
              Home
            </Link>
            <Link
              to="/trips"
              className={`px-4 py-2 rounded-xl font-medium transition-all ${isActive('/trips')
                ? 'bg-blue-50 text-blue-600'
                : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'
                }`}
            >
              My Trips
            </Link>
            <Link
              to="/create"
              className="ml-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-200 hover:scale-105"
            >
              Plan a Trip
            </Link>
          </div>
          {/* Mobile */}
          <div className="sm:hidden flex items-center gap-3">
            <Link to="/trips" className="text-blue-600 font-medium text-sm">Trips</Link>
            <Link to="/create" className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium">+</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
