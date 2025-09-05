// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Account } from 'appwrite';
import { client, APPWRITE_ENDPOINT, APPWRITE_PROJECT } from '../services/appwrite';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    try {
      // Try SDK get() first (keeps compatibility), fallback to REST if needed
      let userData = null;
      try {
        const account = new Account(client);
        userData = await account.get();
      } catch (sdkErr) {
        // Fallback to REST API
        const res = await fetch(`${APPWRITE_ENDPOINT}/account`, {
          headers: {
            'X-Appwrite-Project': APPWRITE_PROJECT,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });
        if (!res.ok) throw await res.json();
        userData = await res.json();
      }
      setUser(userData);
    } catch (error) {
      // Handle 401 error gracefully - it means no active session
      if (error.code === 401) {
        console.log('No active session found');
        setUser(null);
      } else {
        console.error('Error checking user status:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      // Use REST session creation to avoid SDK method mismatch
      const res = await fetch(`${APPWRITE_ENDPOINT}/account/sessions/email`, {
        method: 'POST',
        headers: {
          'X-Appwrite-Project': APPWRITE_PROJECT,
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Login failed' }));
        throw err;
      }

      // Fetch account after creating session
      const accountRes = await fetch(`${APPWRITE_ENDPOINT}/account`, {
        headers: { 'X-Appwrite-Project': APPWRITE_PROJECT },
        credentials: 'include'
      });
      if (!accountRes.ok) throw await accountRes.json();
      const userData = await accountRes.json();
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.message || 'Login failed. Please try again.' 
      };
    }
  };

  const logout = async () => {
    try {
      // Use REST to delete current session
      const res = await fetch(`${APPWRITE_ENDPOINT}/account/sessions/current`, {
        method: 'DELETE',
        headers: { 'X-Appwrite-Project': APPWRITE_PROJECT },
        credentials: 'include'
      });
      if (!res.ok) throw await res.json();
      setUser(null);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};