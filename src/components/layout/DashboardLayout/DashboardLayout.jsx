import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import Loader from '../../common/Loader/Loader';
import './DashboardLayout.css';

const DashboardLayout = ({ 
  children, 
  loading = false, 
  error = null,
  showBreadcrumb = true 
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const getBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter(x => x);
    const breadcrumbs = [
      { name: 'Dashboard', path: '/' }
    ];

    pathnames.forEach((name, index) => {
      const path = `/${pathnames.slice(0, index + 1).join('/')}`;
      const breadcrumbName = name.charAt(0).toUpperCase() + name.slice(1);
      breadcrumbs.push({ name: breadcrumbName, path });
    });

    return breadcrumbs;
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <Loader type="spinner" size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <div className="error-icon">⚠️</div>
        <h2 className="error-title">Something went wrong</h2>
        <p className="error-message">{error}</p>
        <button 
          className="btn btn-primary"
          onClick={() => window.location.reload()}
        >
          Reload Page
        </button>
      </div>
    );
  }

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="dashboard-layout">
      <div className="dashboard-header">
        <Header 
          onToggleSidebar={toggleSidebar}
          onToggleSidebarCollapse={toggleSidebarCollapse}
          sidebarCollapsed={sidebarCollapsed}
        />
      </div>

      <div className="dashboard-body">
        {/* Sidebar Overlay for Mobile */}
        <div 
          className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar */}
        <div className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''} ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <Sidebar collapsed={sidebarCollapsed} />
        </div>

        {/* Main Content */}
        <div className="dashboard-main">
          {showBreadcrumb && breadcrumbs.length > 1 && (
            <div className="dashboard-breadcrumb">
              <nav>
                <ol className="breadcrumb-list">
                  {breadcrumbs.map((breadcrumb, index) => (
                    <li key={breadcrumb.path} className="breadcrumb-item">
                      {index === breadcrumbs.length - 1 ? (
                        <span className="breadcrumb-current">
                          {breadcrumb.name}
                        </span>
                      ) : (
                        <a 
                          href={breadcrumb.path} 
                          className="breadcrumb-link"
                          onClick={(e) => {
                            e.preventDefault();
                            // Handle navigation programmatically if needed
                          }}
                        >
                          {breadcrumb.name}
                        </a>
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
            </div>
          )}

          <div className="dashboard-content fade-in">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;