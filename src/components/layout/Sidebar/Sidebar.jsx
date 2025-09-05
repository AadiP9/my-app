import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: 'dashboard' },
    { path: '/traffic', label: 'Traffic Management', icon: 'traffic' },
    { path: '/analytics', label: 'Analytics', icon: 'analytics' },
    { path: '/incidents', label: 'Incidents', icon: 'incidents' },
    { path: '/settings', label: 'Settings', icon: 'settings' },
  ];

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <ul>
          {menuItems.map(item => (
            <li key={item.path}>
              <Link 
                to={item.path} 
                className={location.pathname === item.path ? 'active' : ''}
              >
                <span className={`icon icon-${item.icon}`}></span>
                <span className="label">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;