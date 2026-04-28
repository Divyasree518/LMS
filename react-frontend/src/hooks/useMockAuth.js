import { useState, useCallback } from 'react';

export const useMockAuth = () => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('authToken'));
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (username, password, role) => {
    setLoading(true);
    setError(null);
    try {
      // Support demo and signup usernames (username/username123)
      const demoUsers = {
        'student1': { name: 'John Student', role: 'student', id: 1, department: 'CSE' },
        'faculty1': { name: 'Dr. Smith', role: 'faculty', id: 2, department: 'Math' },
        'admin': { name: 'Admin User', role: 'admin', id: 3, department: 'Library' },
        'librarian1': { name: 'Jane Librarian', role: 'librarian', id: 4, department: 'Library' },
      };

      let userData;
      if (demoUsers[username]) {
        if (password !== `${username}123`) throw new Error('Invalid password');
        userData = demoUsers[username];
        // Validate selected role matches demo user role
        if (role && userData.role !== role) {
          throw new Error(`User role does not match selected role. Expected: ${userData.role}`);
        }
      } else {
        if (password !== `${username}123`) throw new Error('Password must be username123 for new accounts');
        userData = { name: username.charAt(0).toUpperCase() + username.slice(1), role: role || 'student', id: Date.now(), department: 'General' };
      }

      localStorage.setItem('authToken', `mock_${username}_${Date.now()}`);
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(`mock_${username}_${Date.now()}`);
      setUser(userData);
      return { success: true, user: userData };
      // Fixed: No more HTML redirects - caller handles navigation
    } catch (err) {
      const message = err.message;
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
      // Simple mock signup - just validate and return success
      if (!username || !password || !email) {
        throw new Error('Username, password, and email are required');
      }
      if (username.length < 3) {
        throw new Error('Username must be at least 3 characters');
      }
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Create mock user data
      const userData = {
        name: name || username,
        role: role || 'student',
        id: Date.now(),
        department: 'General',
        username,
        email
      };

      return {
        success: true,
        message: 'Account created successfully!',
        user: userData
      };
    } catch (err) {
      const message = err.message;
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
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

