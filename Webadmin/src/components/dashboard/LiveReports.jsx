import React from 'react';
import { AlertTriangle, Droplets, Car, Zap, Radio } from 'lucide-react';

const ReportItem = ({ title, location, time, type, status }) => {
    const getIcon = () => {
        switch (type) {
            case 'traffic': return <Car size={18} className="text-blue-400" />;
            case 'water': return <Droplets size={18} className="text-cyan-400" />;
            case 'accident': return <AlertTriangle size={18} className="text-orange-400" />;
            case 'power': return <Zap size={18} className="text-yellow-400" />;
            case 'signal': return <Radio size={18} className="text-red-400" />;
            default: return <AlertTriangle size={18} className="text-gray-400" />;
        }
    };

    const getStatusColor = () => {
        switch (status) {
            case 'New': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'Pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'Critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
            case 'Resolved': return 'bg-green-500/20 text-green-400 border-green-500/30';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    return (
        <div className="flex items-start gap-4 p-4 border-b border-gray-800 hover:bg-gray-800/50 transition-colors cursor-pointer group">
            <div className="bg-gray-800 p-2 rounded-lg group-hover:bg-gray-700 transition-colors">
                {getIcon()}
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-white truncate">{title}</h4>
                <p className="text-xs text-gray-400 mt-0.5">{location}</p>
                <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] text-gray-500">{time}</span>
                </div>
            </div>
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${getStatusColor()}`}>
                {status}
            </span>
        </div>
    );
};

const LiveReports = () => {
    const reports = [
        { title: "Traffic Jam at Sitabuldi", location: "Sitabuldi Main Rd, Nagpur", time: "2 min ago", type: "traffic", status: "New" },
        { title: "Accident near Central Mall", location: "Civil Lines, Nagpur", time: "12 min ago", type: "accident", status: "Critical" },
        { title: "Waterlogging in Ward No. 4", location: "Sadar, Nagpur", time: "28 min ago", type: "water", status: "Pending" },
        { title: "Power outage in Dharampeth", location: "Laxmi Nagar, Nagpur", time: "45 min ago", type: "power", status: "Pending" },
        { title: "Signal Failure at RBI Sq", location: "RBI Square", time: "1h ago", type: "signal", status: "Resolved" },
    ];

    return (
        <div className="bg-[#1e293b] border border-gray-700 rounded-xl overflow-hidden flex flex-col h-full">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-[#1e293b]">
                <h3 className="font-semibold text-white">Live Reports</h3>
                <span className="text-xs text-gray-400">Last 24 hours</span>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {reports.map((report, index) => (
                    <ReportItem key={index} {...report} />
                ))}
            </div>
            <div className="p-3 bg-[#1e293b] border-t border-gray-700 text-center">
                <button className="text-xs text-blue-400 hover:text-blue-300 font-medium">View All Reports</button>
            </div>
        </div>
    );
};

export default LiveReports;
