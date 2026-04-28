import React, { useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import '../styles/signup.css';

const Signup = ({ onNavigate }) => {
  const { signup, error, loading } = useAuthContext();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');
  const [localError, setLocalError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setSuccessMsg('');

    // Frontend validation
    if (username.length < 3) {
      setLocalError('Username must be at least 3 characters');
      return;
    }
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }

    const payload = { username, password, email, name, role };
    console.log('[Signup] Sending payload:', payload);

    try {
      const result = await signup(username, password, email, name, role);
      console.log('[Signup] API result:', result);

      if (result.success) {
        setSuccessMsg(result.message || 'Account created successfully!');
        setTimeout(() => {
          onNavigate('/login');
        }, 1500);
      } else {
        setLocalError(result.error || 'Signup failed. Please try again.');
      }
    } catch (err) {
      console.error('[Signup] Unexpected error:', err);
      setLocalError('Network error. Is the backend server running?');
    }
  };

  const displayError = localError || error;

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h1>Create Account</h1>
        <p>Join our library system - Choose your own username!</p>

        {successMsg && (
          <div className="success-message" style={{ color: 'green', marginBottom: '1rem', fontWeight: 'bold' }}>
            ✅ {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Select Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="librarian">Librarian</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="username">Username * (Your Choice)</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose any username (min 3 chars)"
              minLength="3"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
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
              placeholder="Create a password (min 6 chars)"
              minLength="6"
              required
            />
          </div>

          {displayError && (
            <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>
              ❌ {displayError}
            </div>
          )}

          <button 
            type="submit" 
            className="btn-signup"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'SIGN UP'}
          </button>
        </form>

        <p className="login-link">
          Already have an account? <a href="/login" onClick={(e) => { e.preventDefault(); onNavigate('/login'); }}>Login</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
