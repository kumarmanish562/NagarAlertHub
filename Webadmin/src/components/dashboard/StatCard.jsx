import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ title, value, subtext, trend, color, icon: Icon, trendUp }) => {
    // Color mapping for borders/accents
    const colorClasses = {
        red: "border-red-500/50 text-red-500 bg-red-500/10",
        orange: "border-orange-500/50 text-orange-500 bg-orange-500/10",
        blue: "border-blue-500/50 text-blue-500 bg-blue-500/10",
        green: "border-emerald-500/50 text-emerald-500 bg-emerald-500/10", // Emerald for verification
    };

    const trendColor = trendUp ? "text-green-500" : "text-red-500";
    // Assuming trend logic: for incidents, Up is Bad (red). For Verified, Up is Good (green).
    // Let's stick to simple visual cues.

    return (
        <div className={`bg-[#1e293b] rounded-xl p-4 border border-gray-700 relative overflow-hidden`}>
            {/* Top Accent Line */}
            <div className={`absolute top-0 left-0 w-full h-1 ${color === 'red' ? 'bg-red-500' : color === 'orange' ? 'bg-orange-500' : color === 'blue' ? 'bg-blue-500' : 'bg-emerald-500'}`}></div>

            <div className="flex justify-between items-start mb-2">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</h3>
                {Icon && <Icon size={16} className={color === 'red' ? 'text-red-500' : color === 'orange' ? 'text-orange-500' : color === 'blue' ? 'text-blue-500' : 'text-emerald-500'} />}
            </div>

            <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-white">{value}</span>
                {subtext && <span className="text-xs text-gray-400">{subtext}</span>}
            </div>

            {trend && (
                <div className="mt-3 flex items-center gap-1 text-xs">
                    {/* Simple sparkline placeholder or trend text */}
                    <span className="text-gray-500">{trend}</span>
                </div>
            )}
        </div>
    );
};

export default StatCard;
