import React, { useState } from 'react';
import { useTraffic } from '../../../contexts/TrafficContext';
import './RouteOptimizer.css';

const RouteOptimizer = () => {
  const { routes, findOptimalRoute } = useTraffic();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [preferences, setPreferences] = useState({
    avoidTolls: false,
    preferPublicTransport: false,
    prioritizeTime: true
  });
  const [loading, setLoading] = useState(false);

  const handleOptimizeRoute = async (e) => {
    e.preventDefault();
    if (!origin || !destination) return;
    
    setLoading(true);
    try {
      await findOptimalRoute(origin, destination, preferences);
    } catch (error) {
      console.error('Error optimizing route:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreferenceChange = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getRouteIcon = (route) => {
    if (route.publicTransport) return '🚌';
    if (route.congestionLevel > 70) return '🚗';
    if (route.name?.includes('Scenic')) return '🌳';
    return '🛣️';
  };

  const getCongestionColor = (level) => {
    if (level > 70) return '#e74c3c';
    if (level > 40) return '#f39c12';
    return '#27ae60';
  };

  return (
    <div className="route-optimizer">
      <div className="optimizer-header">
        <h3>Smart Route Optimizer</h3>
        <p>Find the best route with AI-powered optimization</p>
      </div>

      <form onSubmit={handleOptimizeRoute} className="route-form">
        <div className="route-inputs">
          <div className="input-group">
            <label>From</label>
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="Enter starting location"
              className="route-input"
              required
            />
          </div>
          
          <div className="input-group">
            <label>To</label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Enter destination"
              className="route-input"
              required
            />
          </div>
        </div>

        <div className="preferences">
          <h4>Route Preferences</h4>
          <div className="preference-options">
            <label className="preference-item">
              <input
                type="checkbox"
                checked={preferences.avoidTolls}
                onChange={() => handlePreferenceChange('avoidTolls')}
              />
              <span>Avoid tolls</span>
            </label>
            
            <label className="preference-item">
              <input
                type="checkbox"
                checked={preferences.preferPublicTransport}
                onChange={() => handlePreferenceChange('preferPublicTransport')}
              />
              <span>Prefer public transport</span>
            </label>
            
            <label className="preference-item">
              <input
                type="checkbox"
                checked={preferences.prioritizeTime}
                onChange={() => handlePreferenceChange('prioritizeTime')}
              />
              <span>Prioritize time</span>
            </label>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading || !origin || !destination}
          className="btn btn-primary optimize-btn"
        >
          {loading ? 'Optimizing...' : 'Find Best Routes'}
        </button>
      </form>

      {routes.length > 0 && (
        <div className="routes-results">
          <h4>Optimized Routes</h4>
          <div className="routes-list">
            {routes.map((route, index) => (
              <div key={route.id || index} className="route-card">
                <div className="route-header">
                  <div className="route-icon">{getRouteIcon(route)}</div>
                  <div className="route-info">
                    <h5>{route.name || `Route ${index + 1}`}</h5>
                    <div className="route-stats">
                      <span className="stat">
                        <strong>{route.estimatedTime} min</strong>
                      </span>
                      <span className="stat">
                        <strong>{route.distance}</strong>
                      </span>
                      <span 
                        className="congestion-stat"
                        style={{ color: getCongestionColor(route.congestionLevel) }}
                      >
                        {route.congestionLevel}% traffic
                      </span>
                    </div>
                  </div>
                  {route.score && (
                    <div className="route-score">
                      <span className="score-value">{Math.round(route.score)}</span>
                      <span className="score-label">Score</span>
                    </div>
                  )}
                </div>

                {route.publicTransport && route.transitOptions && (
                  <div className="transit-options">
                    <h6>Public Transport Options:</h6>
                    <div className="transit-list">
                      {route.transitOptions.map((option, idx) => (
                        <span key={idx} className="transit-option">{option}</span>
                      ))}
                    </div>
                  </div>
                )}

                {route.tolls > 0 && (
                  <div className="route-tolls">
                    <span className="toll-info">💰 Tolls: ${route.tolls}</span>
                  </div>
                )}

                <div className="route-actions">
                  <button className="btn btn-primary btn-small">
                    Select Route
                  </button>
                  <button className="btn btn-secondary btn-small">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RouteOptimizer;