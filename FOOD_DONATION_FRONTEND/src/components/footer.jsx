import React from 'react';
import './Footer.css'; // For custom styles, if necessary


const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        {/* Social Media Links */}
        <div className="social-links">
          <a
            href="https://www.facebook.com/YourProfile"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
          >
            <i className="fab fa-facebook-f"></i>
          </a>
          <a
            href="https://twitter.com/YourProfile"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
          >
            <i className="fab fa-twitter"></i>
          </a>
          <a
            href="https://www.instagram.com/YourProfile"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
          >
            <i className="fab fa-instagram"></i>
          </a>
          <a
            href="https://www.linkedin.com/in/YourProfile"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
          >
            <i className="fab fa-linkedin-in"></i>
          </a>
        </div>

        {/* Footer Navigation Links */}
        <div className="footer-nav">
          <a href="/privacy-policy" className="footer-link">
            Privacy Policy
          </a>
          <a href="/terms-of-service" className="footer-link">
            Terms of Service
          </a>
        </div>

        {/* Description and Copyright at the Bottom */}
        <div className="footer-bottom">
          <p>&copy; 2025 Food Bridge. All rights reserved.</p>
          <p>
            Connecting companies with the right workforce, efficiently and
            effectively.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;