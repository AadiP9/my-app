import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { TrafficProvider } from './contexts/TrafficContext';
import Dashboard from './pages/Dashboard/Dashboard';
import TrafficManagement from './pages/TrafficManagement/TrafficManagement';
import Analytics from './pages/Analytics/Analytics';
import Incidents from './pages/Incidents/Incidents';
import Settings from './pages/Settings/Settings';
import Login from './components/auth/Login/Login';
import Header from './components/layout/Header/Header';
import Sidebar from './components/layout/Sidebar/Sidebar';
import './App.css';

// Create a protected route component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function AppContent() {
  const { user } = useAuth();

  return (
    <div className="app">
      {user && <Header />}
      <div className="app-body">
        {user && <Sidebar />}
        <div className="app-content">
          <Routes>
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/traffic" 
              element={
                <ProtectedRoute>
                  <TrafficManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/analytics" 
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/incidents" 
              element={
                <ProtectedRoute>
                  <Incidents />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/login" 
              element={!user ? <Login /> : <Navigate to="/" />} 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <TrafficProvider>
        <Router>
          <AppContent />
        </Router>
      </TrafficProvider>
    </AuthProvider>
  );
}

export default App;