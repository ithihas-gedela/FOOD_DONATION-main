import './navbar.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const NavBar = ({ User, handleLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="Nav">
      <div className="left">
        <h1 className="main-title">Food Bridge</h1>
      </div>
      <div className="right">
        <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <Link to={'/'} className="link">
            <li>Home</li>
          </Link>
          {User.isLoggedin ? (
            <>
              <Link to="/donorDashboard" className="link">
                <li className="yourdonation">Your Donation</li>
              </Link>
            </>
          ) : (
            ''
          )}

          <a href="#footer" className="link-about">
            <li>About</li>
          </a>
          {User.isLoggedin ? (
            <>
              <button className="auth" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login">
              <button className="auth">Sign In/Sign Up</button>
            </Link>
          )}
        </ul>
        {/* Hamburger Icon for smaller screens */}
        <div className="hamburger" onClick={toggleMenu}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
