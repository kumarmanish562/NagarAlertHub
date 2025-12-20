import React from 'react';
import {
    Megaphone,
    ShieldCheck,
    Map as MapIcon,
    CheckCircle2,
    Shield,
    FileText,
    MessageCircle,
    BrainCircuit,
    Globe2
} from 'lucide-react';

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center mt-12 px-4 text-center max-w-5xl mx-auto w-full">
            {/* Hero Text */}
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
                Your City. Connected. Informed.<br />Empowered
            </h1>

            <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
                Real-time, verified city intelligence — delivered where people already are
            </p>

            {/* Features Chips */}
            <div className="flex flex-wrap justify-center gap-4 mb-20">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-200 text-sm">
                    <span>WhatsApp-First Alerts</span>
                    <CheckCircle2 size={16} className="text-blue-400" />
                </div>

                <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-200 text-sm">
                    <span>Community + Authority Verified</span>
                    <Shield size={16} className="text-teal-400" />
                </div>

                <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-200 text-sm">
                    <span>Built for Tier 2 & 3 Cities</span>
                    <FileText size={16} className="text-purple-400" />
                </div>
            </div>

            {/* Graphic Section */}
            <div className="relative w-full max-w-4xl mx-auto mb-20">
                {/* Connecting Lines (Simulated) */}
                <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent -translate-y-1/2 z-0 hidden md:block"></div>

                <div className="flex flex-col md:flex-row justify-center items-center gap-12 md:gap-24 relative z-10">
                    {/* Step 1 */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                            <Megaphone size={32} />
                        </div>
                    </div>

                    {/* Step 2 (Central Hub) */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-24 h-24 border border-gray-600 bg-gray-900/50 backdrop-blur-sm rounded-2xl flex items-center justify-center relative shadow-[0_0_30px_rgba(59,130,246,0.15)]">
                            <BrainCircuit size={40} className="text-blue-400" />
                            <div className="absolute -bottom-2 -right-2 bg-gray-800 p-1.5 rounded-lg border border-gray-600">
                                <ShieldCheck size={16} className="text-green-400" />
                            </div>
                        </div>
                        <span className="text-xs text-gray-400 font-mono tracking-wide uppercase">Intelligence & Verification<br />Backend</span>
                    </div>

                    {/* Step 3 */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center text-gray-300 border border-gray-700 relative overflow-hidden">
                            <Globe2 size={32} className="text-purple-400" />
                            {/* Little location dots */}
                            <div className="absolute top-4 right-4 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            <div className="absolute bottom-6 left-5 w-2 h-2 bg-yellow-500 rounded-full"></div>
                        </div>
                        <span className="text-xs text-gray-400 font-mono tracking-wide uppercase">Live Disruptions</span>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-6 w-full max-w-3xl">
                <button className="flex-1 min-w-[200px] bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-xl font-semibold flex items-center justify-center gap-3 transition-transform hover:-translate-y-1 cursor-pointer">
                    <Megaphone size={20} />
                    <span>Report an Issue</span>
                </button>

                <button className="flex-1 min-w-[200px] bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl font-semibold flex items-center justify-center gap-3 transition-transform hover:-translate-y-1 cursor-pointer">
                    <MessageCircle size={20} />
                    <span>Get WhatsApp Updates</span>
                </button>

                <button className="flex-1 min-w-[200px] bg-[#2d1b4e] hover:bg-[#3a2366] border border-purple-500/30 text-purple-100 px-6 py-4 rounded-xl font-semibold flex items-center justify-center gap-3 transition-transform hover:-translate-y-1 cursor-pointer">
                    <MapIcon size={20} />
                    <span>Explore Live Map</span>
                </button>
            </div>
        </div>
    );
};

export default Home;
