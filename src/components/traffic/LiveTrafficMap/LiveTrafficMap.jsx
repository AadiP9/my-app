import React, { useState, useEffect } from 'react';
import { useTraffic } from '../../../contexts/TrafficContext';
import './LiveTrafficMap.css';

// This is a simplified implementation using CSS and SVG
// In a real application, you would use a mapping library like Leaflet or Google Maps
const LiveTrafficMap = () => {
  const { trafficData } = useTraffic();
  const [selectedArea, setSelectedArea] = useState(null);

  // Sample areas with traffic data
  const areas = [
    { id: 'downtown', name: 'Downtown', congestion: 85, color: '#e74c3c' },
    { id: 'suburbs', name: 'Suburbs', congestion: 45, color: '#2ecc71' },
    { id: 'highway-n', name: 'North Highway', congestion: 70, color: '#f39c12' },
    { id: 'highway-s', name: 'South Highway', congestion: 90, color: '#e74c3c' },
    { id: 'bridge', name: 'Main Bridge', congestion: 60, color: '#f39c12' },
  ];

  const handleAreaClick = (area) => {
    setSelectedArea(area);
  };

  return (
    <div className="traffic-map-container">
      <div className="map-header">
        <h3>Live Traffic Map</h3>
        <div className="legend">
          <div className="legend-item">
            <span className="color-box low"></span>
            <span>Low</span>
          </div>
          <div className="legend-item">
            <span className="color-box medium"></span>
            <span>Medium</span>
          </div>
          <div className="legend-item">
            <span className="color-box high"></span>
            <span>High</span>
          </div>
        </div>
      </div>
      
      <div className="map-visualization">
        <svg viewBox="0 0 500 300" className="city-map">
          {/* Downtown area */}
          <rect 
            x="150" y="100" width="200" height="100" 
            className="map-area" 
            style={{ fill: areas[0].color }}
            onClick={() => handleAreaClick(areas[0])}
          />
          <text x="250" y="150" textAnchor="middle" fill="white">Downtown</text>
          
          {/* Suburbs area */}
          <circle 
            cx="100" cy="100" r="40" 
            className="map-area"
            style={{ fill: areas[1].color }}
            onClick={() => handleAreaClick(areas[1])}
          />
          <text x="100" y="100" textAnchor="middle" fill="white">Suburbs</text>
          
          {/* North Highway */}
          <rect 
            x="50" y="200" width="400" height="30" 
            className="map-area"
            style={{ fill: areas[2].color }}
            onClick={() => handleAreaClick(areas[2])}
          />
          <text x="250" y="218" textAnchor="middle" fill="white">North Highway</text>
          
          {/* South Highway */}
          <rect 
            x="50" y="50" width="400" height="30" 
            className="map-area"
            style={{ fill: areas[3].color }}
            onClick={() => handleAreaClick(areas[3])}
          />
          <text x="250" y="68" textAnchor="middle" fill="white">South Highway</text>
          
          {/* Main Bridge */}
          <polygon 
            points="250,180 280,200 250,220 220,200" 
            className="map-area"
            style={{ fill: areas[4].color }}
            onClick={() => handleAreaClick(areas[4])}
          />
          <text x="250" y="200" textAnchor="middle" fill="white">Bridge</text>
        </svg>
      </div>
      
      {selectedArea && (
        <div className="area-details">
          <h4>{selectedArea.name}</h4>
          <p>Congestion: {selectedArea.congestion}%</p>
          <p>Status: {selectedArea.congestion > 70 ? 'Heavy Traffic' : selectedArea.congestion > 40 ? 'Moderate Traffic' : 'Light Traffic'}</p>
        </div>
      )}
    </div>
  );
};

export default LiveTrafficMap;