import React from 'react';
import { Activity } from 'lucide-react';

const PageTemplate = ({ title, description, children }) => {
    return (
        <div className="animate-fade-in-up">
            <div className="mb-6 border-b border-gray-800 pb-4">
                <h2 className="text-2xl font-bold text-white mb-1">{title}</h2>
                <p className="text-gray-400 text-sm">{description}</p>
            </div>
            <div className="bg-[#1e293b]/50 border border-gray-700/50 rounded-xl p-8 min-h-[400px] flex flex-col items-center justify-center text-center">
                {children || (
                    <>
                        <Activity className="text-gray-600 mb-4" size={48} />
                        <h3 className="text-lg font-medium text-gray-300">Content Coming Soon</h3>
                        <p className="text-gray-500 max-w-sm mt-2">
                            The {title} module is currently being connected to the backend live streams.
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default PageTemplate;
