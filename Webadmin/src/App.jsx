import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';

// Dashboard Imports
import DashboardLayout from './pages/dashboard/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import EcoCityMap from './pages/dashboard/EcoCityMap';
import {
  LiveOverview,
  NotificationCenter,
  AlertsEscalations,
  TrustScore,
  CivicScore,
  AuthorityAction,
  SystemHealth
} from './pages/dashboard/OtherPages';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Settings from './pages/dashboard/Settings';
const PlaceholderPage = ({ title }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
    <h1 className="text-4xl font-bold mb-4">{title}</h1>
    <p className="text-gray-400">This page is under construction.</p>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Dashboard Routes (Nested) */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="live" element={<LiveOverview />} />
          <Route path="map" element={<EcoCityMap />} />
          <Route path="notifications" element={<NotificationCenter />} />
          <Route path="alerts" element={<AlertsEscalations />} />
          <Route path="trust" element={<TrustScore />} />
          <Route path="civic" element={<CivicScore />} />
          <Route path="authority" element={<AuthorityAction />} />
          <Route path="health" element={<SystemHealth />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Public Routes - With Navbar & Footer */}
        <Route path="*" element={
          <div className="min-h-screen bg-[#0a0f1c] text-white font-sans selection:bg-blue-500 selection:text-white flex flex-col">
            <Navbar />
            <main className="flex-grow flex flex-col relative w-full">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/solutions" element={<PlaceholderPage title="Solutions" />} />
                <Route path="/impact" element={<PlaceholderPage title="Impact" />} />
                <Route path="/team" element={<PlaceholderPage title="Team" />} />
              </Routes>
            </main>
            {/* Highlight Footer Effect */}
            <div className="fixed bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-blue-900/10 to-transparent pointer-events-none -z-10"></div>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
