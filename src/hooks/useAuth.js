import { useState, useEffect } from 'react';
import { Account } from 'appwrite';
import { client } from '../services/appwrite';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const account = new Account(client);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const userData = await account.get();
      setUser(userData);
      setError(null);
    } catch (error) {
      if (error.code !== 401) {
        setError(error.message);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      await account.createEmailPasswordSession(email, password);
      const userData = await account.get();
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, name) => {
    try {
      setLoading(true);
      setError(null);
      
      await account.create('unique()', email, password, name);
      await account.createEmailPasswordSession(email, password);
      const userData = await account.get();
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await account.deleteSession('current');
      setUser(null);
      setError(null);
      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data) => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedUser = await account.updateName(data.name);
      setUser(updatedUser);
      
      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      setError(null);
      
      await account.updatePassword(newPassword, currentPassword);
      
      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    checkAuthStatus
  };
};