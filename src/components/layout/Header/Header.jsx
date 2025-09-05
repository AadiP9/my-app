import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="header">
      <div className="header-left">
        <h1>Smart Traffic Management</h1>
      </div>
      <div className="header-right">
        {user && (
          <>
            <span className="user-name">Welcome, {user.name}</span>
            <button className="btn btn-primary" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;