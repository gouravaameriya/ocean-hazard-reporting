import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, CircleMarker } from 'react-leaflet';
import L from 'leaflet';

// Fix for default Leaflet marker icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Mock Field Reports
const mockReports = [
  { id: 'rep-01', lat: 18.922, lng: 72.834, hazard: 'High Wave', waveHeight: 4.3, trust: 0.94, status: 'Verified', isGold: true },
  { id: 'rep-02', lat: 15.498, lng: 73.827, hazard: 'Swell Surge', waveHeight: 2.8, trust: 0.82, status: 'Pending', isGold: false },
  { id: 'rep-03', lat: 13.082, lng: 80.270, hazard: 'Coastal Flooding', waveHeight: 1.8, trust: 0.75, status: 'Pending', isGold: false },
  { id: 'rep-04', lat: 21.626, lng: 87.507, hazard: 'High Wave', waveHeight: 3.5, trust: 0.91, status: 'Verified', isGold: true },
];

// Mock Social Media Chatter
const mockSocialPins = [
  { id: 'soc-01', lat: 19.100, lng: 72.820, platform: 'X/Twitter', user: '@mumbaifisher', text: 'Water surge at Versova jetty!', sentiment: 'Panic', urgencyColor: '#EF4444' },
  { id: 'soc-02', lat: 15.550, lng: 73.750, platform: 'X/Twitter', user: '@goaseawatch', text: 'Heavy swell noticed along Calangute shoreline.', sentiment: 'Alert', urgencyColor: '#F59E0B' },
];

// Open-Meteo Risk Color Band Helper
// Green < 1.5m, Yellow 1.5–2.5m, Orange 2.5–4.0m, Red > 4.0m
const getWaveRiskColor = (height) => {
  if (height >= 4.0) return '#DC2626'; // Red
  if (height >= 2.5) return '#EA580C'; // Orange
  if (height >= 1.5) return '#EAB308'; // Yellow
  return '#16A34A';                   // Green
};

export default function MapDashboard() {
  const [selectedLayer, setSelectedLayer] = useState('all'); // 'all', 'field', 'social'
  const [activeFilter, setActiveFilter] = useState('all');

  return (
    <div className="w-full h-full flex-grow relative flex flex-col">
      {/* Map Control Toolbar */}
      <div className="bg-slate-900 text-white px-4 py-2 flex flex-wrap justify-between items-center z-10 border-b border-slate-700 dark:bg-nautical-surface dark:border-nautical-red">
        <div className="flex items-center space-x-3">
          <span className="font-semibold text-sm uppercase tracking-wider text-cyan-400 dark:text-nautical-red">
            INCOIS GIS Control Room
          </span>
          <span className="text-xs bg-slate-700 px-2 py-0.5 rounded text-slate-300 dark:bg-nautical-surface-light dark:text-nautical-red-light">
            Live PostGIS Synced
          </span>
        </div>

        {/* Layer Filters */}
        <div className="flex items-center space-x-2 text-xs">
          <button 
            onClick={() => setSelectedLayer('all')}
            className={`px-3 py-1 rounded transition ${selectedLayer === 'all' ? 'bg-cyan-600 text-white dark:bg-nautical-red dark:text-black font-bold' : 'bg-slate-800 text-slate-300'}`}
          >
            All Feeds
          </button>
          <button 
            onClick={() => setSelectedLayer('field')}
            className={`px-3 py-1 rounded transition ${selectedLayer === 'field' ? 'bg-cyan-600 text-white dark:bg-nautical-red dark:text-black font-bold' : 'bg-slate-800 text-slate-300'}`}
          >
            Field Reports
          </button>
          <button 
            onClick={() => setSelectedLayer('social')}
            className={`px-3 py-1 rounded transition ${selectedLayer === 'social' ? 'bg-cyan-600 text-white dark:bg-nautical-red dark:text-black font-bold' : 'bg-slate-800 text-slate-300'}`}
          >
            Social Media Signals
          </button>
        </div>
      </div>

      <div className="relative flex-grow">
        <MapContainer 
          center={[16.5, 76.5]} 
          zoom={5} 
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Render Field Reports & Wave Height Risk Zones */}
          {(selectedLayer === 'all' || selectedLayer === 'field') && mockReports.map(report => {
            const riskColor = getWaveRiskColor(report.waveHeight);
            return (
              <React.Fragment key={report.id}>
                {/* Environmental Open-Meteo Risk Color Band Overlay */}
                <Circle
                  center={[report.lat, report.lng]}
                  radius={35000}
                  pathOptions={{
                    color: riskColor,
                    fillColor: riskColor,
                    fillOpacity: 0.25,
                    weight: 2
                  }}
                />

                <Marker position={[report.lat, report.lng]}>
                  <Popup>
                    <div className="p-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-sm">{report.hazard}</span>
                        {report.isGold && (
                          <span className="text-xs bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded border border-amber-300">
                            ⭐ Gold Trust
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600">Status: <strong className="text-gray-800">{report.status}</strong></p>
                      <p className="text-xs text-gray-600">Open-Meteo Wave Height: <strong style={{ color: riskColor }}>{report.waveHeight}m</strong></p>
                      <p className="text-xs text-gray-600">Scikit-Learn Reliability: <strong>{(report.trust * 100).toFixed(0)}%</strong></p>
                    </div>
                  </Popup>
                </Marker>
              </React.Fragment>
            );
          })}

          {/* Render Social Media Chatter Overlay */}
          {(selectedLayer === 'all' || selectedLayer === 'social') && mockSocialPins.map(pin => (
            <CircleMarker
              key={pin.id}
              center={[pin.lat, pin.lng]}
              radius={9}
              pathOptions={{
                color: pin.urgencyColor,
                fillColor: pin.urgencyColor,
                fillOpacity: 0.85,
                weight: 2
              }}
            >
              <Popup>
                <div className="p-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold text-blue-600">{pin.platform}</span>
                    <span className="text-xs font-bold px-1 rounded text-white" style={{ backgroundColor: pin.urgencyColor }}>
                      {pin.sentiment}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-gray-800">{pin.user}</p>
                  <p className="text-xs text-gray-600 mt-1 italic">"{pin.text}"</p>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>

        {/* Open-Meteo Climate Risk Legend Overlay */}
        <div className="absolute bottom-6 left-6 z-[1000] bg-white/95 backdrop-blur-sm dark:bg-nautical-surface/95 p-3 rounded-lg shadow-xl border border-slate-200 dark:border-nautical-red text-xs dark:text-nautical-red-light">
          <p className="font-bold mb-2 uppercase tracking-wide border-b border-slate-200 dark:border-nautical-surface-light pb-1">
            Open-Meteo Marine Risk Bands
          </p>
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-red-600"></span>
              <span>Severe Risk (&gt; 4.0m)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-orange-500"></span>
              <span>High Risk (2.5m – 4.0m)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
              <span>Moderate Risk (1.5m – 2.5m)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-green-600"></span>
              <span>Low / Safe (&lt; 1.5m)</span>
            </div>
          </div>
        </div>

        {/* Control Room Stats Overlay */}
        <div className="absolute top-16 right-6 z-[1000] bg-white/95 backdrop-blur-sm dark:bg-nautical-surface/95 p-4 rounded-lg shadow-xl border border-slate-200 dark:border-nautical-red max-w-xs text-xs dark:text-nautical-red-light">
          <h4 className="font-bold border-b pb-1 mb-2 text-sm flex justify-between items-center">
            <span>Control Room Monitor</span>
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          </h4>
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Verified Reports:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">2 Active</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Pending Review:</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">2 Active</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Social Chatter Distress:</span>
              <span className="font-bold text-rose-600 dark:text-rose-400">1 Panic / 1 Alert</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
