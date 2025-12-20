import React from 'react';
import { Activity, BarChart3, Users, Zap } from 'lucide-react';
import StatCard from '../../components/dashboard/StatCard';

const DashboardHome = () => {
    return (
        <div>
            <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">Dashboard Overview</h2>
                <p className="text-gray-400">Welcome back, Officer. Here is the city at a glance.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Citizen Reports" value="1,245" trend="+15% this week" color="blue" icon={Users} />
                <StatCard title="Resolved Cases" value="982" trend="+5% vs target" color="green" trendUp={true} icon={CheckCircle2} />
                <StatCard title="System Uptime" value="99.9%" trend="Stable" color="blue" trendUp={true} icon={Zap} />
                <StatCard title="Avg Engagement" value="4.5/5" trend="Civic Score" color="orange" icon={Activity} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 h-64 flex items-center justify-center">
                    <span className="text-gray-500">Weekly Incident Trends (Chart Placeholder)</span>
                </div>
                <div className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 h-64 flex items-center justify-center">
                    <span className="text-gray-500">Department Performance (Chart Placeholder)</span>
                </div>
            </div>
        </div>
    );
};

// Start Quick Imports for Icon usage in simple placeholders
import { CheckCircle2 } from 'lucide-react';

export default DashboardHome;
