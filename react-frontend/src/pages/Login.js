import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import '../styles/login.css';

const Login = ({ onNavigate }) => {
  const { login, loading, error } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');

    const result = await login(username, password);
    if (result.success) {
      const { role } = result.user;
      
      // Handle legacy librarian dashboard
      if (role === 'librarian') {
        window.location.assign('/libraryDashboard.html');
        return;
      }

      // Handle React-based dashboards
      const dashboardMap = {
        admin: '/admin',
        faculty: '/faculty',
        student: '/student-portal'
      };

      onNavigate(dashboardMap[role] || '/');
    } else {
      setLoginError(result.error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>System Login</h1>
        <p>Tovemu Management</p>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          {(loginError || error) && (
            <div className="error-message">{loginError || error}</div>
          )}

          <button 
            type="submit" 
            className="btn-login"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'LOGIN'}
          </button>
        </form>

        <p className="login-hint">
          Demo Credentials:<br/>
          Student: student1 / student123<br/>
          Faculty: faculty1 / faculty123<br/>
          Admin: admin / admin123
        </p>

        <p className="signin-link">
          New to our system? <a href="/signup" onClick={(e) => { e.preventDefault(); onNavigate('/signup'); }}>Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
