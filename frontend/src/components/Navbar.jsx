import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const location = useLocation();
  
  const handleLoginClick = () => {
    // If we're on HomePage, we want to find the openPopup function from HomePage
    const homePageInstance = window.homePageInstance;
    if (homePageInstance && typeof homePageInstance.openLoginPopup === 'function') {
      homePageInstance.openLoginPopup();
    } else {
      // Fallback to default login page if we're not on HomePage
      window.location.href = '/login';
    }
  };
  
  return (
    <nav className="main-navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="brand-link">FeastFine</Link>
        </div>
        
        <div className="navbar-links">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Ana Sayfa
          </Link>
          <Link 
            to="/favorites" 
            className={`nav-link ${location.pathname === '/favorites' ? 'active' : ''}`}
          >
            Favoriler
          </Link>
        </div>
        
        <div className="navbar-auth">
          <button className="login-button" onClick={handleLoginClick}>
            Giriş Yap
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 