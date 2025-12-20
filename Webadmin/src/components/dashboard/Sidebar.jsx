import React from 'react';
import {
    LayoutDashboard,
    Map,
    Bell,
    ShieldAlert,
    ShieldCheck,
    FileText,
    Activity,
    Siren,
    Settings,
    Shield
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const NavItem = ({ icon: Icon, label, active, to }) => (
    <Link
        to={to}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${active
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
            : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
    >
        <Icon size={18} />
        <span>{label}</span>
    </Link>
);

const Sidebar = () => {
    const location = useLocation();

    return (
        <div className="w-64 h-screen bg-[#0f172a] border-r border-gray-800 flex flex-col p-4 fixed left-0 top-0 z-40">
            {/* Brand */}
            <div className="flex items-center gap-3 px-2 mb-8 mt-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                    N
                </div>
                <div>
                    <h1 className="font-bold text-white leading-none">Nagar Alert</h1>
                    <span className="text-xs text-blue-400 font-medium">Command Center</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-4 mt-4">KPI</div>
                <NavItem icon={LayoutDashboard} label="Dashboard" to="/dashboard" active={location.pathname === '/dashboard'} />
                <NavItem icon={Activity} label="Live Overview" to="/dashboard/live" active={location.pathname === '/dashboard/live'} />
                <NavItem icon={Map} label="Eco City Map" to="/dashboard/map" active={location.pathname === '/dashboard/map'} />

                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-4 mt-6">Management</div>
                <NavItem icon={Bell} label="Notification Center" to="/dashboard/notifications" active={location.pathname === '/dashboard/notifications'} />
                <NavItem icon={Siren} label="Alerts & Escalations" to="/dashboard/alerts" active={location.pathname === '/dashboard/alerts'} />
                <NavItem icon={ShieldCheck} label="Trust Score" to="/dashboard/trust" active={location.pathname === '/dashboard/trust'} />
                <NavItem icon={FileText} label="Civic Score" to="/dashboard/civic" active={location.pathname === '/dashboard/civic'} />
                <NavItem icon={Shield} label="Authority Action" to="/dashboard/authority" active={location.pathname === '/dashboard/authority'} />
                <NavItem icon={Activity} label="System Health" to="/dashboard/health" active={location.pathname === '/dashboard/health'} />
            </nav>

            {/* Bottom Actions */}
            <div className="mt-auto border-t border-gray-800 pt-4">
                <NavItem icon={Settings} label="Settings" to="/dashboard/settings" active={location.pathname === '/dashboard/settings'} />
            </div>
        </div>
    );
};

export default Sidebar;
