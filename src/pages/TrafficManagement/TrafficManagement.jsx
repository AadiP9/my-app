import React, { useState } from 'react';
import { useTraffic } from '../../contexts/TrafficContext';
import LiveTrafficMap from '../../components/traffic/LiveTrafficMap/LiveTrafficMap';
import IncidentList from '../../components/traffic/IncidentList/IncidentList';
import RouteOptimizer from '../../components/traffic/RouteOptimizer/RouteOptimizer';
import './TrafficManagement.css';

const TrafficManagement = () => {
  const { addIncident, realTimeUpdates, toggleRealTimeUpdates } = useTraffic();
  const [newIncident, setNewIncident] = useState({
    title: '',
    location: '',
    description: '',
    type: 'accident',
    severity: 'medium'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewIncident(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addIncident({
        ...newIncident,
        status: 'active',
        reportedBy: 'Admin'
      });
      setNewIncident({
        title: '',
        location: '',
        description: '',
        type: 'accident',
        severity: 'medium'
      });
      alert('Incident reported successfully!');
    } catch (error) {
      console.error('Error reporting incident:', error);
      alert('Failed to report incident. Please try again.');
    }
  };

  return (
    <div className="traffic-management">
      <h2>Traffic Management</h2>
      
      <div className="management-controls">
        <div className="control-card">
          <h3>Real-time Updates</h3>
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={realTimeUpdates} 
              onChange={toggleRealTimeUpdates} 
            />
            <span className="slider"></span>
          </label>
          <p className="toggle-label">
            {realTimeUpdates ? 'Enabled' : 'Disabled'}
          </p>
        </div>
      </div>

      <div className="management-content">
        <div className="map-section">
          <LiveTrafficMap />
          <RouteOptimizer />
        </div>
        
        <div className="incident-section">
          <div className="card">
            <div className="card-header">
              <h3>Report New Incident</h3>
            </div>
            <form onSubmit={handleSubmit} className="incident-form">
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  name="title"
                  value={newIncident.title}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  name="location"
                  value={newIncident.location}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  value={newIncident.description}
                  onChange={handleInputChange}
                  className="form-input"
                  rows="3"
                  required
                ></textarea>
              </div>
              
              <div className="form-group grid-2">
                <div>
                  <label className="form-label">Type</label>
                  <select
                    name="type"
                    value={newIncident.type}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    <option value="accident">Accident</option>
                    <option value="congestion">Congestion</option>
                    <option value="roadwork">Roadwork</option>
                    <option value="hazard">Hazard</option>
                    <option value="event">Event</option>
                  </select>
                </div>
                
                <div>
                  <label className="form-label">Severity</label>
                  <select
                    name="severity"
                    value={newIncident.severity}
                    onChange={handleInputChange}
                    className="form-input"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
              
              <button type="submit" className="btn btn-primary">
                Report Incident
              </button>
            </form>
          </div>
          
          <IncidentList />
        </div>
      </div>
    </div>
  );
};

export default TrafficManagement;