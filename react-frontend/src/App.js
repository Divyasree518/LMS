import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Books from './pages/Books';
import Reports from './pages/Reports';
import StudentPortal from './pages/StudentPortal';
import Faculty from './pages/Faculty';
import Admin from './pages/Admin';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIAssistant from './components/AIAssistant';
import ProtectedRoute from './components/ProtectedRoute';

// Styles
import './styles/globals.css';

const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="app">
      <Navbar user={user} onLogout={handleLogout} onNavigate={handleNavigate} />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home user={user} onNavigate={handleNavigate} />} />
          <Route path="/login" element={<Login onNavigate={handleNavigate} />} />
          <Route path="/signup" element={<Signup onNavigate={handleNavigate} />} />
          <Route path="/books" element={<Books user={user} />} />
          <Route path="/reports" element={<Reports user={user} />} />
          
          <Route
            path="/student-portal"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentPortal user={user} />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/faculty"
            element={
              <ProtectedRoute allowedRoles={['faculty']}>
                <Faculty user={user} />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Admin user={user} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {location.pathname !== '/' && <Footer />}
      <AIAssistant />
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
