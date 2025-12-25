
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-blue-600">TravelWise</span>
            </Link>
          </div>
          <div className="hidden sm:flex space-x-8">
            <Link 
              to="/" 
              className={`${isActive('/') ? 'text-blue-600' : 'text-slate-600 hover:text-blue-500'} font-medium transition-colors`}
            >
              Home
            </Link>
            <Link 
              to="/trips" 
              className={`${isActive('/trips') ? 'text-blue-600' : 'text-slate-600 hover:text-blue-500'} font-medium transition-colors`}
            >
              My Trips
            </Link>
            <Link 
              to="/create" 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Plan a Trip
            </Link>
          </div>
          {/* Mobile indicator - simplified for this demo */}
          <div className="sm:hidden flex items-center">
            <Link to="/trips" className="text-blue-600 font-medium">My Trips</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
