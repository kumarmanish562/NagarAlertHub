import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

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
    return (
        <MapContainer
            center={NAGPUR_CENTER}
            zoom={13}
            style={{ height: "100%", width: "100%", borderRadius: "0.75rem", zIndex: 0 }}
            zoomControl={false}
        >
            <TileLayer url={TILE_URL} attribution={ATTRIBUTION} />

            {/* Mock Markers */}
            <Marker position={[21.1458, 79.0882]} icon={createCustomIcon('#ef4444')}>
                <Popup>Sitabuldi Incidents</Popup>
            </Marker>

            <Marker position={[21.13, 79.06]} icon={createCustomIcon('#3b82f6')}>
                <Popup>Response Team</Popup>
            </Marker>

            <Marker position={[21.16, 79.1]} icon={createCustomIcon('#f59e0b')}>
                <Popup>Warning</Popup>
            </Marker>

            <Marker position={[21.12, 79.09]} icon={createCustomIcon('#10b981')}>
                <Popup>Verified Safe</Popup>
            </Marker>
            <Marker position={[21.155, 79.075]} icon={createCustomIcon('#ef4444')}>
            </Marker>
            <Marker position={[21.135, 79.11]} icon={createCustomIcon('#3b82f6')}>
            </Marker>
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
