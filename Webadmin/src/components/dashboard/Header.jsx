import React from 'react';
import { Bell, Search, User, ChevronDown, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="h-16 bg-[#0f172a] border-b border-gray-800 flex items-center justify-between px-6 fixed top-0 right-0 left-64 z-30">
            {/* Search / Breadcrumbs placeholder */}
            <div className="flex items-center text-gray-400 text-sm">
                <span className="font-medium text-white">Dashboard</span>
                <span className="mx-2">/</span>
                <span>Eco City Map</span>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-6">
                {/* City Selector */}
                <div className="hidden md:flex items-center gap-2 bg-[#1e293b] px-3 py-1.5 rounded-lg border border-gray-700">
                    <span className="text-xs text-gray-400">Region:</span>
                    <span className="text-sm font-medium text-white flex items-center gap-2">
                        Nagpur <ChevronDown size={14} />
                    </span>
                </div>

                {/* Status */}
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-xs font-medium text-green-500">All Systems Online</span>
                </div>

                {/* Vertical Divider */}
                <div className="h-6 w-px bg-gray-700"></div>

                {/* Division Selector */}
                <div className="hidden md:flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    Traffic Police Division
                </div>

                {/* User Profile */}
                <div className="flex items-center gap-3 pl-4 border-l border-gray-700">
                    <Link to="/dashboard/notifications" className="relative text-gray-400 hover:text-white mr-2">
                        <Bell size={20} />
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#0f172a]"></span>
                    </Link>

                    <Link to="/dashboard/settings" className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-1.5 rounded-lg transition-colors">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold border border-blue-400">
                            K
                        </div>
                        <div className="hidden lg:block text-left">
                            <div className="text-sm font-medium text-white leading-none">Officer K.</div>
                            <div className="text-xs text-blue-400 mt-0.5">Admin</div>
                        </div>
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;
