import React, { useEffect, useState } from 'react';
import { AlertTriangle, Droplets, Car, Zap, Radio, CheckCircle, ShieldAlert } from 'lucide-react';
import axios from 'axios';

const ReportItem = ({ id, report, onVerify }) => {
    const { category, location, timestamp_local, status, description, aiAnalysis } = report;

    // Format Time
    const timeDisplay = timestamp_local ? new Date(timestamp_local).toLocaleTimeString() : 'Just now';

    const getIcon = () => {
        const type = category ? category.toLowerCase() : 'other';
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
            case 'Verified': return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'Pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'Critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    return (
        <div className="flex flex-col gap-2 p-4 border-b border-gray-800 hover:bg-gray-800/50 transition-colors group">
            <div className="flex items-start gap-4">
                <div className="bg-gray-800 p-2 rounded-lg group-hover:bg-gray-700 transition-colors">
                    {getIcon()}
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-white truncate">{category} - {description}</h4>
                    <p className="text-xs text-gray-400 mt-0.5">
                        {location?.lat?.toFixed(4)}, {location?.lng?.toFixed(4)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] text-gray-500">{timeDisplay}</span>
                        {aiAnalysis?.confidence > 0.8 && (
                            <span className="text-[10px] text-purple-400 flex items-center gap-1">
                                <ShieldAlert size={10} /> AI Detected
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${getStatusColor()}`}>
                        {status}
                    </span>

                    {status !== 'Verified' && (
                        <button
                            onClick={() => onVerify(id, report)}
                            className="bg-green-600 hover:bg-green-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1 transition-colors"
                        >
                            <CheckCircle size={12} /> Verify
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const LiveReports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_URL = "http://localhost:8000/api/v1";

    const fetchReports = async () => {
        try {
            const res = await axios.get(`${API_URL}/reports/`);
            // Firebase returns object { id: data }, convert to array
            const reportArray = res.data ? Object.entries(res.data).map(([key, val]) => ({ id: key, ...val })) : [];
            // Sort by time descending
            reportArray.sort((a, b) => new Date(b.timestamp_local) - new Date(a.timestamp_local));
            setReports(reportArray);
        } catch (error) {
            console.error("Failed to fetch reports:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
        // Poll every 5 seconds for live updates
        const interval = setInterval(fetchReports, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleVerify = async (id, report) => {
        try {
            console.log(`Verifying Report ${id}...`);

            const formData = new FormData();
            formData.append('status', 'Verified');
            formData.append('area', 'Sector 4'); // Hardcoded for demo, normally derived from Lat/Lng
            formData.append('issue_type', report.category || 'Issue');

            await axios.patch(`${API_URL}/reports/${id}/verify`, formData, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' } // Axios handles FormData auto, but being explicit
            });

            // Optimistic Update
            setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'Verified' } : r));
            alert("✅ Report Verified! Alert Broadcasted to Area.");

        } catch (error) {
            console.error("Verify Failed:", error);
            alert("❌ Verification Failed");
        }
    };

    return (
        <div className="bg-[#1e293b] border border-gray-700 rounded-xl overflow-hidden flex flex-col h-full">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-[#1e293b]">
                <h3 className="font-semibold text-white">Live Reports</h3>
                <span className="text-xs text-gray-400">Live Feed</span>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {loading ? (
                    <div className="p-4 text-center text-gray-500 text-xs">Loading incidents...</div>
                ) : reports.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-xs">No active reports</div>
                ) : (
                    reports.map((report) => (
                        <ReportItem key={report.id} id={report.id} report={report} onVerify={handleVerify} />
                    ))
                )}
            </div>
            <div className="p-3 bg-[#1e293b] border-t border-gray-700 text-center">
                <button
                    onClick={fetchReports}
                    className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                >
                    Refresh Feed
                </button>
            </div>
        </div>
    );
};

export default LiveReports;
