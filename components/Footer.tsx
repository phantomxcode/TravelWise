import React from 'react';
import { Link } from 'react-router-dom';
import {
    Plane,
    MapPin,
    Calendar,
    Mail,
    Twitter,
    Instagram
} from 'lucide-react';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-900 text-white mt-auto">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <img
                                src="/logo.png"
                                alt="TravelWise"
                                className="h-12 w-12 object-contain"
                            />
                            <span className="text-2xl font-bold fugaz-one-regular">TravelWise</span>
                        </div>
                        <p className="text-slate-400 max-w-sm mb-6">
                            Plan smarter, travel better. AI-powered itineraries and budget analysis for your next adventure.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors">
                                <Mail className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 young-serif-regular">Quick Links</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                                    <MapPin className="w-4 h-4" /> Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/trips" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                                    <Calendar className="w-4 h-4" /> My Trips
                                </Link>
                            </li>
                            <li>
                                <Link to="/create" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                                    <Plane className="w-4 h-4" /> Plan a Trip
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Features */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 young-serif-regular">Features</h4>
                        <ul className="space-y-3 text-slate-400">
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                AI Itineraries
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                Budget Analysis
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
                                Smart Scheduling
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                                Map Preview
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-slate-800 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-500 text-sm">
                        © {currentYear} TravelWise. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm text-slate-500">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-white transition-colors">Contact</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
