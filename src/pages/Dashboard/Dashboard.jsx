import React from 'react';
import { useTraffic } from '../../contexts/TrafficContext';
import LiveTrafficMap from '../../components/traffic/LiveTrafficMap/LiveTrafficMap';
import TrafficChart from '../../components/traffic/TrafficChart/TrafficChart';
import IncidentList from '../../components/traffic/IncidentList/IncidentList';
import './Dashboard.css';

// Dashboard page showing traffic stats, map, chart, and recent incidents
const Dashboard = () => {
  const { trafficData, incidents, loading, error, realTimeUpdates, toggleRealTimeUpdates } = useTraffic();

  // Show loading state
  if (loading) {
    return <div className="loading">Loading traffic data...</div>;
  }

  // Calculate statistics
  const totalIncidents = incidents.length;
  const activeIncidents = incidents.filter(incident => incident.status === 'active').length;
  const resolvedIncidents = incidents.filter(incident => incident.status === 'resolved').length;
  const averageCongestion = trafficData.length > 0 
    ? Math.round(trafficData.reduce((sum, data) => sum + data.congestion, 0) / trafficData.length) 
    : 0;

  return (
    <div className="dashboard">
      {/* Show error banner if error exists */}
      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}
      <div className="dashboard-header">
        <h2>Traffic Dashboard</h2>
        {/* Realtime toggle: calls context toggle and shows current state */}
        <div className="realtime-control">
          <button
            className={`realtime-btn ${realTimeUpdates ? 'on' : 'off'}`}
            onClick={toggleRealTimeUpdates}
            aria-pressed={realTimeUpdates}
            title="Toggle realtime updates"
          >
            {realTimeUpdates ? 'Realtime: ON' : 'Realtime: OFF'}
          </button>
        </div>
      </div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{averageCongestion}%</div>
          <div className="stat-label">Average Congestion</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalIncidents}</div>
          <div className="stat-label">Total Incidents</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{activeIncidents}</div>
          <div className="stat-label">Active Incidents</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{resolvedIncidents}</div>
          <div className="stat-label">Resolved Incidents</div>
        </div>
      </div>
      <div className="dashboard-content">
        <div className="main-content">
          <LiveTrafficMap />
          <TrafficChart />
        </div>
        <div className="sidebar-content">
          <IncidentList limit={5} showViewAll={true} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;