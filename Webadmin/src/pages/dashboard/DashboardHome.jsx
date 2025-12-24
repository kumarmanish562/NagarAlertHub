import React, { useEffect, useState } from 'react';
import { Activity, Users, Zap, CheckCircle2, AlertTriangle, MapPin } from 'lucide-react';
import StatCard from '../../components/dashboard/StatCard';
import { getReports, verifyReport } from '../../services/api';

const DashboardHome = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchReports = async () => {
        try {
            const data = await getReports();
            // Firebase returns object with keys, convert to array
            const reportsArray = data ? Object.keys(data).map(key => ({
                id: key,
                ...data[key]
            })).reverse() : []; // Show newest first
            setReports(reportsArray);
        } catch (error) {
            console.error("Failed to fetch reports", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
        // Poll every 5 seconds for real-time updates
        const interval = setInterval(fetchReports, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleVerify = async (id) => {
        if (window.confirm("Confirm verification of this incident?")) {
            await verifyReport(id, "Verified");
            fetchReports();
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">Dashboard Overview</h2>
                <p className="text-gray-400">Welcome back. Real-time city monitoring active.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Reports" value={reports.length} trend="Live" color="blue" icon={Users} />
                <StatCard title="Actionable" value={reports.filter(r => r.status === 'Verified').length} trend="Priority" color="red" icon={AlertTriangle} />
                <StatCard title="Resolved" value={reports.filter(r => r.status === 'Resolved').length} trend="Completed" color="green" trendUp={true} icon={CheckCircle2} />
                <StatCard title="System Status" value="Online" trend="Stable" color="blue" trendUp={true} icon={Zap} />
            </div>

            <div className="bg-[#1e293b] rounded-xl border border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-700">
                    <h3 className="text-xl font-bold">Recent Incidents</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-[#0f172a] text-gray-400">
                                <th className="p-4">Type</th>
                                <th className="p-4">Description</th>
                                <th className="p-4">Location</th>
                                <th className="p-4">AI Analysis</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {reports.map((report) => (
                                <tr key={report.id} className="hover:bg-[#334155] transition-colors">
                                    <td className="p-4">
                                        <div className={`px-2 py-1 rounded text-xs font-bold w-fit ${report.category === 'Traffic' ? 'bg-red-500/20 text-red-500' :
                                            report.category === 'Water' ? 'bg-blue-500/20 text-blue-500' :
                                                'bg-yellow-500/20 text-yellow-500'
                                            }`}>
                                            {report.category || 'General'}
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-300 max-w-xs truncate">{report.description || "No description"}</td>
                                    <td className="p-4 text-sm text-gray-400">
                                        <div className="flex flex-col gap-1">
                                            {report.address && <span className="text-white font-medium">{report.address}</span>}
                                            <div className="flex items-center gap-1 text-xs">
                                                <MapPin size={12} />
                                                {report.location ? `${report.location.lat.toFixed(4)}, ${report.location.lng.toFixed(4)}` : "N/A"}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-xs">
                                            <span className="text-gray-400">Detected: </span>
                                            <span className="text-white">{report.aiAnalysis?.detectedType || "Pending"}</span>
                                            <br />
                                            <span className="text-gray-500">{(report.aiAnalysis?.confidence * 100).toFixed(0)}% Confidence</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`text-xs px-2 py-1 rounded-full ${report.status === 'Verified' ? 'bg-green-500/20 text-green-400' :
                                            report.status === 'Rejected' ? 'bg-red-500/20 text-red-400' :
                                                'bg-gray-700 text-gray-300'
                                            }`}>
                                            {report.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {report.status !== 'Verified' && (
                                            <button
                                                onClick={() => handleVerify(report.id)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                                            >
                                                Verify
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
