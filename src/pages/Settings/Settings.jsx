import React, { useState } from 'react';
import { useTraffic } from '../../contexts/TrafficContext';
import { useAuth } from '../../contexts/AuthContext';
import './Settings.css';

const Settings = () => {
  const { realTimeUpdates, toggleRealTimeUpdates } = useTraffic();
  const { user, logout } = useAuth();
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: false,
    refreshInterval: 30,
    mapStyle: 'standard'
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    // Implementation would save settings to Appwrite
    alert('Settings saved successfully!');
  };

  return (
    <div className="settings-page">
      <h2>Settings</h2>
      
      <div className="settings-grid">
        <div className="settings-section">
          <h3>User Profile</h3>
          <div className="profile-card">
            <div className="profile-info">
              <div className="profile-avatar">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="profile-details">
                <div className="profile-name">{user?.name || 'User'}</div>
                <div className="profile-email">{user?.email || 'user@example.com'}</div>
              </div>
            </div>
            <button className="btn btn-secondary" onClick={logout}>
              Logout
            </button>
          </div>
        </div>

        <div className="settings-section">
          <h3>Application Settings</h3>
          <div className="settings-card">
            <div className="setting-item">
              <div className="setting-info">
                <div className="setting-name">Real-time Updates</div>
                <div className="setting-description">
                  Enable real-time traffic data updates
                </div>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={realTimeUpdates} 
                  onChange={toggleRealTimeUpdates} 
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <div className="setting-name">Notifications</div>
                <div className="setting-description">
                  Receive browser notifications for important events
                </div>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={settings.notifications} 
                  onChange={(e) => handleSettingChange('notifications', e.target.checked)} 
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <div className="setting-name">Email Alerts</div>
                <div className="setting-description">
                  Receive email alerts for critical incidents
                </div>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={settings.emailAlerts} 
                  onChange={(e) => handleSettingChange('emailAlerts', e.target.checked)} 
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <div className="setting-name">Data Refresh Interval</div>
                <div className="setting-description">
                  How often to refresh traffic data (seconds)
                </div>
              </div>
              <select 
                value={settings.refreshInterval} 
                onChange={(e) => handleSettingChange('refreshInterval', parseInt(e.target.value))}
                className="setting-select"
              >
                <option value={15}>15 seconds</option>
                <option value={30}>30 seconds</option>
                <option value={60}>1 minute</option>
                <option value={300}>5 minutes</option>
              </select>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <div className="setting-name">Map Style</div>
                <div className="setting-description">
                  Choose your preferred map visualization style
                </div>
              </div>
              <select 
                value={settings.mapStyle} 
                onChange={(e) => handleSettingChange('mapStyle', e.target.value)}
                className="setting-select"
              >
                <option value="standard">Standard</option>
                <option value="satellite">Satellite</option>
                <option value="dark">Dark Mode</option>
                <option value="light">Light Mode</option>
              </select>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h3>System Information</h3>
          <div className="info-card">
            <div className="info-item">
              <span className="info-label">App Version:</span>
              <span className="info-value">1.0.0</span>
            </div>
            <div className="info-item">
              <span className="info-label">Last Updated:</span>
              <span className="info-value">October 15, 2023</span>
            </div>
            <div className="info-item">
              <span className="info-label">API Status:</span>
              <span className="info-value status-connected">Connected</span>
            </div>
            <div className="info-item">
              <span className="info-label">Data Sources:</span>
              <span className="info-value">5 active sensors</span>
            </div>
          </div>
        </div>
      </div>

      <div className="settings-actions">
        <button className="btn btn-primary" onClick={handleSave}>
          Save Settings
        </button>
        <button className="btn btn-secondary">
          Reset to Defaults
        </button>
      </div>
    </div>
  );
};

export default Settings;