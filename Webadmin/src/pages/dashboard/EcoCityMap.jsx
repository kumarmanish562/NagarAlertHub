import React from 'react';
import StatCard from '../../components/dashboard/StatCard';
import LiveMap from '../../components/dashboard/LiveMap';
import LiveReports from '../../components/dashboard/LiveReports';
import { Activity, AlertOctagon, CheckCircle2, Clock } from 'lucide-react';

const EcoCityMap = () => {
    return (
        <div className="h-full flex flex-col">
            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Eco City Map</h2>
                <p className="text-gray-400 text-sm">Real-time geospatial visualization of city incidents and resources.</p>
            </div>

            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <StatCard
                    title="Active Incidents"
                    value="23"
                    subtext="Total Incidents"
                    trend="+4 from last hr"
                    color="red"
                    icon={AlertOctagon}
                />
                <StatCard
                    title="Critical Alerts"
                    value="5"
                    subtext="Power/Fire/Acc"
                    trend="+2 High Priority"
                    color="orange"
                    icon={Activity}
                />
                <StatCard
                    title="Avg Response Time"
                    value="8m 34s"
                    subtext="Live rated"
                    trend="-12% vs yesterday"
                    color="blue"
                    trendUp={true} // Good thing
                    icon={Clock}
                />
                <StatCard
                    title="Verified Ratio"
                    value="89%"
                    subtext="User + AI Reports"
                    trend="Top 1% Tier-2"
                    color="green"
                    trendUp={true}
                    icon={CheckCircle2}
                />
            </div>

            {/* Main Content Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-320px)] min-h-[500px]">
                {/* Map Area */}
                <div className="lg:col-span-2 h-full">
                    <LiveMap />
                </div>

                {/* Right Panel: Live Feed */}
                <div className="lg:col-span-1 h-full">
                    <LiveReports />
                </div>
            </div>
        </div>
    );
};

export default EcoCityMap;
