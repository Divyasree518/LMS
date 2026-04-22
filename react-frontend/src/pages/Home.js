import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/home.css';

const Home = ({ user, onNavigate }) => {
  const homeRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const root = homeRef.current;
    if (!root) return undefined;
    const reveals = root.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    reveals.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const id = (location.hash || '').replace(/^#/, '');
    if (!id) return undefined;
    const t = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
    return () => clearTimeout(t);
  }, [location.pathname, location.hash]);

  const handleEnterSystem = () => {
    if (!user) {
      onNavigate('/login');
      return;
    }
    if (user.role === 'student') window.location.assign('/student_dashboard.html');
    else if (user.role === 'faculty') window.location.assign('/faculty_dashboard.html');
    else if (user.role === 'admin') window.location.assign('/admin_dashboard.html');
    else onNavigate('/login');
  };

  return (
    <div className="home-page" ref={homeRef}>
      <section className="hero" id="home">
        <div className="hero-bg" aria-hidden="true" />
        <div className="hero-lines" aria-hidden="true" />
        <div className="hero-ornament" aria-hidden="true" />
        <div className="hero-ornament-2" aria-hidden="true" />

        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot" aria-hidden="true" />
            Vemu Institute of Technology · Est. 2008
          </div>

          <h1 className="hero-title">
            <em>Smart Library</em>
            <br />
            Management
          </h1>

          <p className="hero-subtitle">
            A fully digital platform engineered for seamless book management, student services, and institutional
            excellence.
          </p>

          <div className="hero-tags">
            <span className="hero-tag">Digital Library</span>
            <span className="hero-tag-sep">·</span>
            <span className="hero-tag">Automated Management</span>
            <span className="hero-tag-sep">·</span>
            <span className="hero-tag">Secure Access</span>
          </div>

          <div className="hero-actions">
            <a
              href="/login"
              className="btn-hero-primary"
              onClick={(e) => {
                e.preventDefault();
                handleEnterSystem();
              }}
            >
              <span aria-hidden="true">↗</span> Enter System
            </a>
            <a href="#features" className="btn-hero-secondary">
              Explore Features <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>

        <div className="hero-scroll" aria-hidden="true">
          <span className="scroll-text">Scroll</span>
          <div className="scroll-line" />
        </div>
      </section>

      <div className="stats-section">
        <div className="stats-wrapper">
          <div className="stat-item reveal">
            <div className="stat-num">
              50K<sup>+</sup>
            </div>
            <div className="stat-label">Books Catalogued</div>
          </div>
          <div className="stat-item reveal reveal-delay-1">
            <div className="stat-num">
              12K<sup>+</sup>
            </div>
            <div className="stat-label">Active Members</div>
          </div>
          <div className="stat-item reveal reveal-delay-2">
            <div className="stat-num">
              99.9<sup>%</sup>
            </div>
            <div className="stat-label">Uptime Guarantee</div>
          </div>
          <div className="stat-item reveal reveal-delay-3">
            <div className="stat-num">24/7</div>
            <div className="stat-label">Digital Access</div>
          </div>
        </div>
      </div>

      <section className="features-section" id="features">
        <div className="section-inner">
          <div className="home-section-intro">
            <div className="section-label section-label-center">What We Offer</div>
            <h2 className="section-title section-title-center">Core Capabilities</h2>
            <p className="section-desc section-desc-center">
              Every tool your institution needs — intelligently designed and elegantly delivered.
            </p>
          </div>

          <div className="ornament-divider">
            <div className="ornament-line" />
            <div className="ornament-diamond" />
            <div className="ornament-line" />
          </div>

          <div className="features-grid">
            <div className="feature-card reveal">
              <div className="feature-num">01</div>
              <div className="feature-icon" aria-hidden="true">
                📖
              </div>
              <div className="feature-name">Book Management</div>
              <p className="feature-desc">
                Complete cataloguing with ISBN, genre classification, availability tracking, and intelligent search
                across the entire collection.
              </p>
              <div className="feature-corner" aria-hidden="true" />
            </div>

            <div className="feature-card reveal reveal-delay-1">
              <div className="feature-num">02</div>
              <div className="feature-icon" aria-hidden="true">
                👨‍🎓
              </div>
              <div className="feature-name">Student Portal</div>
              <p className="feature-desc">
                Personalized dashboards for borrowing history, renewals, reservations, fines management, and digital
                resource access.
              </p>
              <div className="feature-corner" aria-hidden="true" />
            </div>

            <div className="feature-card reveal reveal-delay-2">
              <div className="feature-num">03</div>
              <div className="feature-icon" aria-hidden="true">
                👨‍🏫
              </div>
              <div className="feature-name">Faculty Access</div>
              <p className="feature-desc">
                Priority reservations, extended borrowing periods, research material requests, and course-linked reading
                list management.
              </p>
              <div className="feature-corner" aria-hidden="true" />
            </div>

            <div className="feature-card reveal reveal-delay-1">
              <div className="feature-num">04</div>
              <div className="feature-icon" aria-hidden="true">
                🧑‍💼
              </div>
              <div className="feature-name">Librarian Panel</div>
              <p className="feature-desc">
                Comprehensive control over acquisitions, circulation, member management, overdue notices, and inventory
                audits.
              </p>
              <div className="feature-corner" aria-hidden="true" />
            </div>

            <div className="feature-card reveal reveal-delay-2">
              <div className="feature-num">05</div>
              <div className="feature-icon" aria-hidden="true">
                📊
              </div>
              <div className="feature-name">Analytics Dashboard</div>
              <p className="feature-desc">
                Real-time insights on circulation trends, popular titles, peak usage patterns, and automated performance
                reports.
              </p>
              <div className="feature-corner" aria-hidden="true" />
            </div>

            <div className="feature-card reveal reveal-delay-3">
              <div className="feature-num">06</div>
              <div className="feature-icon" aria-hidden="true">
                🔐
              </div>
              <div className="feature-name">Secure Authentication</div>
              <p className="feature-desc">
                Role-based access control with encrypted sessions, audit logging, and secure credential management for all
                users.
              </p>
              <div className="feature-corner" aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      <section className="mission-section" id="mission">
        <div className="mission-bg" aria-hidden="true" />
        <div className="mission-grid-lines" aria-hidden="true" />
        <div className="section-inner">
          <div className="mission-layout">
            <div className="mission-left reveal">
              <div className="section-label">Our Mission</div>
              <h2 className="mission-title">
                Built for
                <br />
                Academic Excellence
              </h2>
              <p className="mission-body">
                A seamlessly integrated platform designed to transform how Vemu Institute manages its knowledge resources
                and serves its academic community.
                <br />
                <br />
                Our system eliminates manual processes through intelligent automation — from book acquisitions to overdue
                notifications — freeing librarians to focus on what truly matters: curating an exceptional learning
                environment.
              </p>
              <div className="mission-tags">
                <span className="mission-tag">☁️ Cloud-Ready Architecture</span>
                <span className="mission-tag">⚡ Real-Time Sync</span>
                <span className="mission-tag">👥 Multi-Role Access</span>
                <span className="mission-tag">📋 Audit Trails</span>
              </div>
            </div>

            <div className="mission-right">
              <div className="mission-card reveal reveal-delay-1">
                <div className="mission-card-icon" aria-hidden="true">
                  🏛️
                </div>
                <div>
                  <div className="mission-card-title">Circulation Management</div>
                  <div className="mission-card-desc">
                    Streamlined check-in/check-out workflows with barcode support, automated reminders, and fine
                    calculation for overdue items.
                  </div>
                </div>
              </div>

              <div className="mission-card reveal reveal-delay-2">
                <div className="mission-card-icon" aria-hidden="true">
                  🗂️
                </div>
                <div>
                  <div className="mission-card-title">Digital Catalogue</div>
                  <div className="mission-card-desc">
                    Advanced OPAC with full-text search, filter by author, subject, and year — accessible from any device,
                    anytime.
                  </div>
                </div>
              </div>

              <div className="mission-card reveal reveal-delay-3">
                <div className="mission-card-icon" aria-hidden="true">
                  📨
                </div>
                <div>
                  <div className="mission-card-title">Notification Engine</div>
                  <div className="mission-card-desc">
                    Automated email and SMS alerts for due dates, reservation availability, and new acquisitions tailored
                    per user role.
                  </div>
                </div>
              </div>

              <div className="mission-card reveal reveal-delay-4">
                <div className="mission-card-icon" aria-hidden="true">
                  📋
                </div>
                <div>
                  <div className="mission-card-title">Report Generation</div>
                  <div className="mission-card-desc">
                    One-click reports covering stock audits, issue statistics, member activity logs, and financial summaries
                    in PDF/Excel.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="modules-section" id="modules">
        <div className="section-inner">
          <div className="modules-header">
            <div>
              <div className="section-label">System Modules</div>
              <h2 className="section-title">
                Every Role,
                <br />
                Perfectly Served
              </h2>
            </div>
            <p className="section-desc modules-header-desc">
              Purpose-built modules for every stakeholder in your institution's academic ecosystem.
            </p>
          </div>

          <div className="modules-grid">
            <div className="module-card reveal">
              <div className="module-icon" aria-hidden="true">
                🏛️
              </div>
              <div className="module-content">
                <div className="module-title">Circulation Management</div>
                <p className="module-desc">
                  Streamlined check-in/check-out workflows with barcode support, automated reminders, and fine calculation
                  for overdue items.
                </p>
              </div>
            </div>

            <div className="module-card reveal reveal-delay-1">
              <div className="module-icon" aria-hidden="true">
                🗂️
              </div>
              <div className="module-content">
                <div className="module-title">Digital Catalogue</div>
                <p className="module-desc">
                  Advanced OPAC with full-text search, filter by author, subject, and year — accessible from any device,
                  anytime.
                </p>
              </div>
            </div>

            <div className="module-card reveal reveal-delay-2">
              <div className="module-icon" aria-hidden="true">
                📨
              </div>
              <div className="module-content">
                <div className="module-title">Notification Engine</div>
                <p className="module-desc">
                  Automated email and SMS alerts for due dates, reservation availability, and new acquisitions tailored
                  per user role.
                </p>
              </div>
            </div>

            <div className="module-card reveal reveal-delay-3">
              <div className="module-icon" aria-hidden="true">
                📋
              </div>
              <div className="module-content">
                <div className="module-title">Report Generation</div>
                <p className="module-desc">
                  One-click reports covering stock audits, issue statistics, member activity logs, and financial summaries
                  in PDF/Excel.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="cta-section">
        <div className="cta-inner">
          <div className="cta-box reveal">
            <div className="cta-box-bg" aria-hidden="true" />
            <div className="cta-box-pattern" aria-hidden="true" />
            <div className="cta-content">
              <div className="cta-label">✦ Get Started Today</div>
              <h2 className="cta-title">
                Ready to Modernise
                <br />
                Your Library?
              </h2>
              <p className="cta-desc">Join thousands of students and faculty already using the system.</p>
              <div className="cta-actions">
                <button type="button" className="btn-cta-primary" onClick={() => onNavigate('/login')}>
                  Login to Dashboard ↗
                </button>
                <a href="#contact" className="btn-cta-secondary">
                  Contact Admin →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section id="contact" className="contact-section">
        <div className="section-inner">
          <h2 className="contact-title">Contact Us</h2>
          <div className="contact-grid">
            <div>
              <h3 className="contact-block-title">Library Admin</h3>
              <p className="contact-block-text">
                Email: librarian@vemu.edu
                <br />
                Phone: +91 98765 43210
                <br />
                Address: Vemu Institute, Chittoor
              </p>
            </div>
            <div>
              <h3 className="contact-block-title">Technical Support</h3>
              <p className="contact-block-text">
                Email: support@vemu.edu
                <br />
                Hours: Mon-Fri 9AM-5PM
                <br />
                Response: {'<'}24hrs
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="home-html-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="footer-brand-icon" aria-hidden="true">
              📚
            </div>
            <div>
              <div className="footer-brand-text">Vemu Library</div>
              <div className="footer-brand-sub">Vemu Institute of Technology</div>
            </div>
          </div>

          <div className="footer-links">
            <a href="/privacy" onClick={(e) => e.preventDefault()}>
              Privacy
            </a>
            <a href="/terms" onClick={(e) => e.preventDefault()}>
              Terms
            </a>
            <a href="/support" onClick={(e) => e.preventDefault()}>
              Support
            </a>
          </div>

          <div className="footer-copy">© 2008 Vemu Institute of Technology · All Rights Reserved</div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
