// Navbar Component
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ isLoggedIn, user, onLogout }) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Handle logout button click
  const handleLogout = () => {
    onLogout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="navbar">
      <Link to="/" className="navbar-brand" onClick={closeMenu}>
        <h1>🩸 BloodPlus</h1>
      </Link>
      
      <button className="navbar-toggle" onClick={toggleMenu} aria-label="Toggle menu">
        {isMenuOpen ? '✕' : '☰'}
      </button>

      <nav className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
        <Link to="/" onClick={closeMenu}>Home</Link>
        
        {isLoggedIn ? (
          <>
            <Link to="/dashboard" onClick={closeMenu}>Dashboard</Link>
            <Link to="/search-donors" onClick={closeMenu}>Find Donors</Link>
            <Link to="/create-request" onClick={closeMenu}>Request Blood</Link>
            <Link to="/view-requests" onClick={closeMenu}>View Requests</Link>
            <Link to="/profile" onClick={closeMenu}>Profile</Link>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={closeMenu}>Login</Link>
            <Link to="/register" onClick={closeMenu}>Register</Link>
          </>
        )}
      </nav>
    </div>
  );
}

export default Navbar;
