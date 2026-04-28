import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import '../styles/login.css';

const Login = () => {
  const { login, loading } = useAuthContext();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [roleInput, setRoleInput] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalSuccess, setModalSuccess] = useState(true);

  const roleMap = {
    administrator: 'admin',
    faculty: 'faculty',
    librarian: 'librarian',
    student: 'student',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!roleInput) {
      showModal(false, 'Please select a role.');
      return;
    }

    try {
      const role = roleMap[roleInput];
      const result = await login(username, password, role);

      if (result.success) {
        const user = result.user;
        const path = {
          admin: '/admin',
          student: '/student-portal',
          librarian: '/librarian',
          faculty: '/faculty',
        }[user.role] || '/';

        showModal(
          true,
          `Welcome ${user.name || user.username}!<br/>Redirecting to ${user.role?.toUpperCase()} portal... ✨`
        );



        // Immediate client-side navigation to prevent race conditions
        navigate(path);
      } else {
        showModal(
          false,
          `❌ Access Denied! <br/> ${result.error || 'Invalid credentials'} 🔐`
        );
      }
    } catch (error) {
      showModal(false, `Something went wrong.<br/>${error.message || 'Please try again.'}`);
    }
  };

  const showModal = (isSuccess, message) => {
    setModalSuccess(isSuccess);
    setModalMessage(message);
    setModalVisible(true);
    setTimeout(() => setModalVisible(false), 3000);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>🏛️ VEMU</h1>
        <p>Role-Based Authentication</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>SELECT SYSTEM ROLE</label>
            <select
              required
              value={roleInput}
              onChange={(e) => setRoleInput(e.target.value)}
            >
              <option value="" disabled>Select your role...</option>
              <option value="administrator">⚙️ Administrator</option>
              <option value="faculty">👨‍🏫 Faculty</option>
              <option value="librarian">📖 Librarian</option>
              <option value="student">🧑‍🎓 Student</option>
            </select>
          </div>

          <div className="form-group">
            <label>USER IDENTIFICATION</label>
            <input
              type="text"
              placeholder="Username or ID"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>ACCESS KEY</label>
            <input
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify Identity'}
          </button>
        </form>

        <p className="signin-link">
          New to our system?{' '}
          <span style={{ cursor: 'pointer', color: 'blue' }} onClick={() => navigate('/signup')}>
            Sign Up
          </span>
        </p>
      </div>

      <div className={`modal-overlay ${modalVisible ? 'visible' : ''}`}>
        <div className="modal">
          <h2>{modalSuccess ? 'Access Granted 🔓' : 'Access Denied ❌'}</h2>
          <p dangerouslySetInnerHTML={{ __html: modalMessage }} />
          <div>✨✨✨</div>
        </div>
      </div>
    </div>
  );
};

export default Login;

