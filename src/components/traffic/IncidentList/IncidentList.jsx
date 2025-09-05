import React, { useState } from 'react';
import { useTraffic } from '../../../contexts/TrafficContext';
import './IncidentList.css';

const IncidentList = ({ limit, showViewAll }) => {
  const { incidents, deleteIncident, updateIncident } = useTraffic();
  const [filter, setFilter] = useState('all');

  const filteredIncidents = incidents.filter(incident => {
    if (filter === 'all') return true;
    return incident.status === filter;
  });

  const displayedIncidents = limit 
    ? filteredIncidents.slice(0, limit)
    : filteredIncidents;

  const handleStatusChange = async (incidentId, newStatus) => {
    try {
      await updateIncident(incidentId, { status: newStatus });
    } catch (error) {
      console.error('Error updating incident status:', error);
    }
  };

  const handleDelete = async (incidentId) => {
    if (window.confirm('Are you sure you want to delete this incident?')) {
      try {
        await deleteIncident(incidentId);
      } catch (error) {
        console.error('Error deleting incident:', error);
      }
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'active':
        return <span className="badge badge-active">Active</span>;
      case 'resolved':
        return <span className="badge badge-resolved">Resolved</span>;
      case 'investigating':
        return <span className="badge badge-investigating">Investigating</span>;
      default:
        return <span className="badge">Unknown</span>;
    }
  };

  return (
    <div className="incident-list-container">
      <div className="incident-header">
        <h3>Traffic Incidents</h3>
        <div className="filter-controls">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Incidents</option>
            <option value="active">Active</option>
            <option value="investigating">Investigating</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      <div className="incident-list">
        {displayedIncidents.length === 0 ? (
          <div className="no-incidents">No incidents found</div>
        ) : (
          displayedIncidents.map(incident => (
            <div key={incident.$id} className="incident-item">
              <div className="incident-main">
                <div className="incident-title">{incident.title}</div>
                <div className="incident-location">{incident.location}</div>
                <div className="incident-description">{incident.description}</div>
                <div className="incident-time">
                  Reported: {new Date(incident.$createdAt).toLocaleString()}
                </div>
              </div>
              
              <div className="incident-actions">
                <div className="incident-status">
                  {getStatusBadge(incident.status)}
                </div>
                
                <select 
                  value={incident.status} 
                  onChange={(e) => handleStatusChange(incident.$id, e.target.value)}
                  className="status-select"
                >
                  <option value="active">Active</option>
                  <option value="investigating">Investigating</option>
                  <option value="resolved">Resolved</option>
                </select>
                
                <button 
                  onClick={() => handleDelete(incident.$id)}
                  className="btn btn-danger btn-small"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showViewAll && (
        <div className="view-all-container">
          <button className="btn btn-primary">View All Incidents</button>
        </div>
      )}
    </div>
  );
};

export default IncidentList;