import React from 'react';
import Sidebar from '../../components/dashboard/Sidebar';
import Header from '../../components/dashboard/Header';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
    return (
        <div className="flex h-screen bg-[#0f172a] overflow-hidden font-sans text-white">
            <Sidebar />
            <div className="flex-1 flex flex-col ml-64">
                <Header />
                <main className="flex-1 mt-16 p-6 overflow-y-auto custom-scrollbar relative">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
