import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getReports, getActiveUsers } from '../../services/api';

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Dark Mode Map Style
// CartoDB Dark Matter is good for "command center" vibes
const TILE_URL = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

// Nagpur Coords
const NAGPUR_CENTER = [21.1458, 79.0882];

// Custom Icons (colored dots)
const createCustomIcon = (color) => {
    return new L.DivIcon({
        className: 'custom-icon',
        html: `<div style="
        background-color: ${color};
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 0 10px ${color};
    "></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6],
    });
};

const MapReview = () => {
    const [incidents, setIncidents] = useState([]);
    const [users, setUsers] = useState([]);

    const fetchData = async () => {
        try {
            // Fetch Reports
            const reportsData = await getReports();
            if (reportsData) {
                // Convert object to array if needed (Firebase returns objects)
                const reportsArray = Object.entries(reportsData || {}).map(([key, value]) => ({
                    id: key,
                    ...value
                }));
                setIncidents(reportsArray);
            }

            // Fetch Active Users
            const usersData = await getActiveUsers();
            if (usersData) {
                const usersArray = Object.entries(usersData || {}).map(([key, value]) => ({
                    id: key,
                    ...value
                }));
                setUsers(usersArray);
            }
        } catch (error) {
            console.error("Error fetching live map data:", error);
        }
    };

    useEffect(() => {
        fetchData(); // Initial fetch
        const interval = setInterval(fetchData, 5000); // Poll every 5 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <MapContainer
            center={NAGPUR_CENTER}
            zoom={13}
            style={{ height: "100%", width: "100%", borderRadius: "0.75rem", zIndex: 0 }}
            zoomControl={false}
        >
            <TileLayer url={TILE_URL} attribution={ATTRIBUTION} />

            {/* Dynamic Incident Markers */}
            {incidents.map((incident) => (
                incident.location && (
                    <Marker
                        key={incident.id}
                        position={[incident.location.lat, incident.location.lng]}
                        icon={createCustomIcon(incident.status === 'Verified' ? '#ef4444' : '#f59e0b')}
                    >
                        <Popup>
                            <div className="p-2">
                                <h3 className="font-bold text-sm">{incident.category || 'Incident'}</h3>
                                <p className="text-xs text-gray-600 mb-1">{incident.description}</p>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded ${incident.status === 'Verified' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {incident.status}
                                </span>
                            </div>
                        </Popup>
                    </Marker>
                )
            ))}

            {/* Dynamic Active User Markers */}
            {users.map((user) => (
                user.location && (
                    <Marker
                        key={user.id}
                        position={[user.location.latitude, user.location.longitude]}
                        icon={createCustomIcon('#3b82f6')}
                    >
                        <Popup>
                            <div className="p-1">
                                <p className="text-xs font-bold text-blue-600">Active Officer</p> {/* Or Citizen */}
                                <p className="text-[10px] text-gray-500">ID: {user.id}</p>
                                {/* <p className="text-[10px] text-gray-400">Last Active: {new Date(user.lastActive).toLocaleTimeString()}</p> */}
                            </div>
                        </Popup>
                    </Marker>
                )
            ))}
        </MapContainer>
    );
}

const LiveMap = () => {
    return (
        <div className="bg-[#1e293b] border border-gray-700 rounded-xl p-0 h-full overflow-hidden relative group">
            <div className="absolute top-4 left-4 z-[400] bg-gray-900/80 backdrop-blur text-white px-3 py-1 rounded text-xs font-medium border border-gray-700">
                Peak Hour Focus: Commercial Zones
            </div>
            <MapReview />

            {/* Map Controls Mock */}
            <div className="absolute bottom-4 right-4 z-[400] flex flex-col gap-2">
                <button className="w-8 h-8 bg-gray-800 text-white rounded flex items-center justify-center border border-gray-600 hover:bg-gray-700">+</button>
                <button className="w-8 h-8 bg-gray-800 text-white rounded flex items-center justify-center border border-gray-600 hover:bg-gray-700">-</button>
            </div>
        </div>
    );
};

export default LiveMap;
