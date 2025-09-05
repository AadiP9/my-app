import React, { useState } from 'react';
import { useTraffic } from '../../contexts/TrafficContext';
import IncidentList from '../../components/traffic/IncidentList/IncidentList';
import './Incidents.css';

const Incidents = () => {
  const { incidents } = useTraffic();
  const [showReportForm, setShowReportForm] = useState(false);
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
    // Implementation would connect to Appwrite
    alert('Incident reporting would be implemented with Appwrite backend');
    setShowReportForm(false);
    setNewIncident({
      title: '',
      location: '',
      description: '',
      type: 'accident',
      severity: 'medium'
    });
  };

  return (
    <div className="incidents-page">
      <div className="incidents-header">
        <h2>Traffic Incidents</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowReportForm(true)}
        >
          Report New Incident
        </button>
      </div>

      {showReportForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Report New Incident</h3>
              <button 
                className="close-btn"
                onClick={() => setShowReportForm(false)}
              >
                &times;
              </button>
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
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowReportForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Report Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="incidents-summary">
        <div className="summary-card">
          <div className="summary-value">{incidents.length}</div>
          <div className="summary-label">Total Incidents</div>
        </div>
        
        <div className="summary-card">
          <div className="summary-value">
            {incidents.filter(i => i.status === 'active').length}
          </div>
          <div className="summary-label">Active Incidents</div>
        </div>
        
        <div className="summary-card">
          <div className="summary-value">
            {incidents.filter(i => i.status === 'resolved').length}
          </div>
          <div className="summary-label">Resolved Incidents</div>
        </div>
      </div>

      <IncidentList />
    </div>
  );
};

export default Incidents;