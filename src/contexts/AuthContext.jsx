// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Account } from 'appwrite';
import { client } from '../services/appwrite';

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

  const account = new Account(client);

  useEffect(() => {
    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    try {
      setLoading(true);
      // Test connection first
      const userData = await account.get();
      setUser(userData);
    } catch (error) {
      // Handle different error types gracefully
      if (error.code === 401) {
        // 401 means no active session - this is normal
        console.log('No active session found');
        setUser(null);
      } else if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        // Network/connection error - use offline mode
        console.warn('Cannot connect to Appwrite backend. Running in offline mode.');
        setUser(null);
      } else {
        console.error('Error checking user status:', error);
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      // Check if this is demo credentials for fallback auth
      if (email === 'admin@traffic.com' && password === 'demo123') {
        console.log('Using demo authentication');
        const mockUser = {
          $id: 'demo-user-id',
          name: 'Demo Admin',
          email: 'admin@traffic.com',
          emailVerification: true,
          status: true,
          labels: [],
          prefs: {},
          accessedAt: new Date().toISOString(),
          registration: new Date().toISOString()
        };
        setUser(mockUser);
        return { success: true };
      }

      try {
        // Try Appwrite authentication
        await account.createEmailPasswordSession(email, password);
        const userData = await account.get();
        setUser(userData);
        return { success: true };
      } catch (appwriteError) {
        // If network error and demo credentials, use fallback
        if ((appwriteError.message === 'Failed to fetch' || appwriteError.name === 'TypeError') && 
            email === 'admin@traffic.com' && password === 'demo123') {
          console.log('Network error detected, using demo authentication fallback');
          const mockUser = {
            $id: 'demo-user-id',
            name: 'Demo Admin',
            email: 'admin@traffic.com',
            emailVerification: true,
            status: true,
            labels: [],
            prefs: {},
            accessedAt: new Date().toISOString(),
            registration: new Date().toISOString()
          };
          setUser(mockUser);
          return { success: true };
        }
        throw appwriteError;
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: (error.message === 'Failed to fetch' || error.name === 'TypeError')
          ? 'Unable to connect to server. Try demo credentials: admin@traffic.com / demo123'
          : error.message || 'Login failed. Please try again.' 
      };
    }
  };

  const logout = async () => {
    try {
      // Only try to delete session if we have a real user (not demo)
      if (user && user.$id !== 'demo-user-id') {
        await account.deleteSession('current');
      }
      setUser(null);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear local user state
      setUser(null);
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