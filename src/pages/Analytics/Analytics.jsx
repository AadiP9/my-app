import React, { useState } from 'react';
import { useTraffic } from '../../contexts/TrafficContext';
import TrafficChart from '../../components/traffic/TrafficChart/TrafficChart';
import './Analytics.css';

const Analytics = () => {
  const { trafficData, incidents } = useTraffic();
  const [dateRange, setDateRange] = useState('week');

  // Calculate analytics data
  const calculateAnalytics = () => {
    const totalIncidents = incidents.length;
    const activeIncidents = incidents.filter(i => i.status === 'active').length;
    const resolvedIncidents = incidents.filter(i => i.status === 'resolved').length;
    
    const avgCongestion = trafficData.length > 0 
      ? Math.round(trafficData.reduce((sum, data) => sum + data.congestion, 0) / trafficData.length)
      : 0;
    
    const peakCongestion = trafficData.length > 0
      ? Math.max(...trafficData.map(data => data.congestion))
      : 0;
    
    const incidentByType = incidents.reduce((acc, incident) => {
      acc[incident.type] = (acc[incident.type] || 0) + 1;
      return acc;
    }, {});
    
    return {
      totalIncidents,
      activeIncidents,
      resolvedIncidents,
      resolutionRate: totalIncidents > 0 ? Math.round((resolvedIncidents / totalIncidents) * 100) : 0,
      avgCongestion,
      peakCongestion,
      incidentByType
    };
  };

  const analytics = calculateAnalytics();

  return (
    <div className="analytics">
      <div className="analytics-header">
        <h2>Traffic Analytics</h2>
        <div className="date-filter">
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            className="filter-select"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="metric-card">
          <div className="metric-value">{analytics.totalIncidents}</div>
          <div className="metric-label">Total Incidents</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-value">{analytics.activeIncidents}</div>
          <div className="metric-label">Active Incidents</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-value">{analytics.resolutionRate}%</div>
          <div className="metric-label">Resolution Rate</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-value">{analytics.avgCongestion}%</div>
          <div className="metric-label">Avg. Congestion</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-value">{analytics.peakCongestion}%</div>
          <div className="metric-label">Peak Congestion</div>
        </div>
      </div>

      <div className="charts-section">
        <TrafficChart />
        
        <div className="card">
          <h3>Incidents by Type</h3>
          <div className="incident-types">
            {Object.entries(analytics.incidentByType).map(([type, count]) => (
              <div key={type} className="type-item">
                <div className="type-name">{type.charAt(0).toUpperCase() + type.slice(1)}</div>
                <div className="type-bar">
                  <div 
                    className="type-progress" 
                    style={{ width: `${(count / analytics.totalIncidents) * 100}%` }}
                  ></div>
                </div>
                <div className="type-count">{count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="recommendations-section">
        <div className="card">
          <h3>Traffic Recommendations</h3>
          <div className="recommendation-list">
            {analytics.avgCongestion > 70 && (
              <div className="recommendation-item">
                <div className="rec-icon">🚦</div>
                <div className="rec-content">
                  <h4>High Congestion Alert</h4>
                  <p>Consider implementing alternate routes and increasing public transport frequency.</p>
                </div>
              </div>
            )}
            
            {analytics.activeIncidents > 5 && (
              <div className="recommendation-item">
                <div className="rec-icon">⚠️</div>
                <div className="rec-content">
                  <h4>Multiple Active Incidents</h4>
                  <p>Deploy additional traffic management personnel to handle incident response.</p>
                </div>
              </div>
            )}
            
            <div className="recommendation-item">
              <div className="rec-icon">📊</div>
              <div className="rec-content">
                <h4>Data Collection</h4>
                <p>Consider installing additional sensors in high-congestion areas for better data accuracy.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;