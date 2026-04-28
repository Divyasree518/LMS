import React, { useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/navbar.css';

const Navbar = ({ user, onLogout, onNavigate }) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [themeIcon, setThemeIcon] = React.useState('🌙');

  useLayoutEffect(() => {
    const t = localStorage.getItem('theme') || 'light';
    if (t === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      setThemeIcon('☀️');
    } else {
      document.documentElement.removeAttribute('data-theme');
      setThemeIcon('🌙');
    }
  }, []);

  useEffect(() => {
    const nav = document.querySelector('.nav-bar');
    if (!nav) return undefined;
    const onScroll = () => {
      nav.style.boxShadow =
        window.scrollY > 40 ? '0 4px 24px rgba(26, 20, 16, 0.12)' : '0 2px 8px rgba(26, 20, 16, 0.07)';
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleTheme = () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
      setThemeIcon('🌙');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      setThemeIcon('☀️');
    }
  };

  const goSection = (id) => {
    setMobileMenuOpen(false);
    navigate({ pathname: '/', hash: `#${id}` });
  };

  const handleLogout = async () => {
    await onLogout();
    onNavigate('/login');
  };

  const navAnchor = (id, label) => (
    <a
      key={id}
      href={`/#${id}`}
      onClick={(e) => {
        e.preventDefault();
        goSection(id);
      }}
    >
      {label}
    </a>
  );

  return (
    <nav className="nav-bar">
      <div className="nav-inner">
        <div className="nav-logo" onClick={() => onNavigate('/')} role="presentation">
          <div className="nav-logo-icon">📚</div>
          <div className="nav-logo-text">
            <div className="nav-logo-title">Vemu Library</div>
            <div className="nav-logo-sub">Est. 2008 · Vemu Institute of Technology</div>
          </div>
        </div>

        <div className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          {navAnchor('features', 'Features')}
          {navAnchor('mission', 'About')}
          {navAnchor('modules', 'Services')}
          {navAnchor('contact', 'Contact')}

          {user?.role === 'student' && (
            <a
              href="/student-portal"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/student-portal');
                setMobileMenuOpen(false);
              }}
            >
              Student Portal
            </a>
          )}
          {user?.role === 'faculty' && (
            <a
              href="/faculty"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/faculty');
                setMobileMenuOpen(false);
              }}
            >
              Faculty Portal
            </a>
          )}
          {user?.role === 'admin' && (
            <a
              href="/admin"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/admin');
                setMobileMenuOpen(false);
              }}
            >
              Admin Portal
            </a>
          )}
          {user?.role === 'librarian' && (
            <a
              href="/librarian"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/librarian');
                setMobileMenuOpen(false);
              }}
            >
              Library Panel
            </a>
          )}
        </div>

        <div className="nav-actions">
          {!user && (
            <>
              <button type="button" className="btn-ghost" onClick={() => onNavigate('/signup')}>
                Sign Up
              </button>
              <button type="button" className="btn-primary" onClick={() => onNavigate('/login')}>
                Login
              </button>
            </>
          )}
          {user && (
            <>
              <button type="button" className="btn-ghost" onClick={() => onNavigate('/')}>
                {user.name}
              </button>
              <button type="button" className="btn-primary" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
          <button
            type="button"
            className="theme-toggle"
            title="Toggle Theme"
            aria-label="Switch light/dark mode"
            onClick={toggleTheme}
          >
            {themeIcon}
          </button>
          <button type="button" className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            ☰
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
