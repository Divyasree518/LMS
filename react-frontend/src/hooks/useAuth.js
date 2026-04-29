import { useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const validateAuth = async () => {
      try {
        if (token) {
          try {
            const response = await authAPI.validateToken();
            setUser(response.data.user);
          } catch (err) {
            console.warn('[useAuth] Token validation failed:', err.message);
            // Clear all auth state on validation failure
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            setToken(null);
            setUser(null);
          }
        }
      } finally {
        setLoading(false);
      }
    };
    validateAuth();
  }, [token]);

  const login = useCallback(async (username, password, role) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.login(username, password, role);
      const { token: newToken, user: userData } = response.data;
      localStorage.setItem('authToken', newToken);
      localStorage.setItem('token', newToken); // added for compatibility
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(newToken);
      setUser(userData);
      return { success: true, user: userData };
    } catch (err) {
      let message;
      if (!err.response && err.request) {
        // Network error - backend is not reachable
        message = 'Cannot connect to server. Please ensure the backend is running on localhost:5000';
      } else {
        message = err.response?.data?.error || 'Login failed';
      }
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (username, password, email, name, role) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.signup(username, password, email, name, role);
      console.log('[useAuth] Signup success:', response.data);
      return { success: true, message: response.data.message };
    } catch (err) {
      console.error('[useAuth] Signup error:', err.message);
      let message;
      if (err.response) {
        console.error('[useAuth] Server responded with:', err.response.status, err.response.data);
        message = err.response.data?.error || err.response.data?.message || `Server error (${err.response.status})`;
      } else if (err.request) {
        console.error('[useAuth] No response received. Is backend running?');
        message = 'Cannot connect to server. Please ensure the backend is running on localhost:5000';
      } else {
        message = err.message || 'Signup failed. Please try again.';
      }
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      // Ignore logout errors
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
    }
  }, []);

  const isAuthenticated = !!token && !!user;

  return {
    user,
    token,
    loading,
    error,
    login,
    signup,
    logout,
    isAuthenticated
  };
};

