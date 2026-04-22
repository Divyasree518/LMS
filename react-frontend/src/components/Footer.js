import React from 'react';
import '../styles/footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Vemu Library</h4>
          <p>Vemu Institute of Technology · Library Management System</p>
        </div>

        <div className="footer-section">
          <h5>Quick Links</h5>
          <ul>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><a href="#privacy">Privacy Policy</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h5>Contact</h5>
          <p>Email: library@vemu.edu</p>
          <p>Phone: +91-XXXX-XXXXXX</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} Vemu Library Management System. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
