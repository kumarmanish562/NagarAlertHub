import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full z-50">
            <div className="flex items-center gap-2">
                {/* Logo Placeholder */}
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                    <span className="text-xl font-bold text-white">N</span>
                </div>
                <Link to="/" className="font-semibold text-lg tracking-tight text-white hover:text-blue-400 transition-colors">
                    Nagar Alert Hub
                </Link>
            </div>

            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
                <Link to="/solutions" className="hover:text-white transition-colors">Solutions</Link>
                <Link to="/impact" className="hover:text-white transition-colors">Impact</Link>
                <Link to="/team" className="hover:text-white transition-colors">Team</Link>
            </div>

            <div className="flex items-center gap-4">
                <Link to="/login" className="text-gray-300 hover:text-white font-medium text-sm transition-colors">
                    Login
                </Link>
                <Link to="/register" className="bg-green-500 hover:bg-green-600 text-black font-semibold px-4 py-2 rounded-full text-sm transition-all flex items-center gap-2 cursor-pointer">
                    <MessageCircle size={16} />
                    Join the Hub
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
