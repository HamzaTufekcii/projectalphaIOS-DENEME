import React, { useState, useEffect } from 'react';
import {Link, useLocation, useNavigate, useParams} from 'react-router-dom';
import '../styles/Navbar.css';
import SettingsPopup from "./HomePageComponents/SettingsPopup.jsx";
import { FaUser, FaHeart, FaSignOutAlt, FaList, FaCog, FaStar } from 'react-icons/fa';
import {getUserRoleFromStorage} from '../services/userService';
import axios from 'axios';
import {preload} from "react-dom";

const Navbar = () => {
  const {profileName, setProfileName} =  useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const currentUserRole = getUserRoleFromStorage();
  // Check if user is logged in - this runs on component mount and on location changes
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      const profileData = JSON.parse(localStorage.getItem('userData'));
      if (token) {
        setIsLoggedIn(true);
        if (userData) {
          try {
            setUser(JSON.parse(userData));
            handleChangeProfileToName(profileData);
            setProfileName(profileData.name);
          } catch (e) {
            console.error('Error parsing user data', e);
          }
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };
    
    checkAuthStatus();
  }, [location]); // Re-check auth status when route changes

  const handleChangeProfileToName = (profileData) => {
    try{
      setUser(profileData);
    } catch (e) {
      console.log("Test");
    }
  }

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
  
  const handleLogout = () => {
    // Clear auth data
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userData');
    localStorage.removeItem('ownerData');
    setIsLoggedIn(false);
    setUser(null);
    
    // Redirect to home page
    navigate('/');
    
    // Show logout toast/notification
    alert('Başarıyla çıkış yaptınız.');
  };
  
  return (
    <nav className="main-navbar">
      <div className="navbar-container">
        <div className="navbar-brand">

          <Link
              to={currentUserRole === 'owner_user' ? "/owner-dashboard" : "/"}
              className={`brand-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            FeastFine
          </Link>
        </div>
        
        <div className="navbar-links">

          <Link
              to={currentUserRole === 'owner_user' ? "/owner-dashboard" : "/"}
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Ana Sayfa
          </Link>
          
          {isLoggedIn && currentUserRole !== 'owner_user' && (
            <>
              <Link 
                to="/favorites" 
                className={`nav-link ${location.pathname === '/favorites' ? 'active' : ''}`}
              >
                <FaHeart className="nav-icon" /> Favoriler
              </Link>
              
              <Link 
                to="/lists" 
                className={`nav-link ${location.pathname === '/lists' ? 'active' : ''}`}
              >
                <FaList className="nav-icon" /> Listeler
              </Link>
              <Link to="/reviews" className="nav-link">
                <FaStar /> Değerlendirmeler
              </Link>

            </>
          )}
        </div>
        
        <div className="navbar-auth">
          {isLoggedIn ? (
            <div className="user-menu">
              <span
                className={`nav-link ${isSettingsOpen ? 'active' : ''}`}
                onClick={() => setIsSettingsOpen(true)}
              >
                <FaCog className="nav-icon" /> Ayarlar
              </span>

              <Link 
                to="/profile" 
                className={`profile-link ${location.pathname.startsWith('/user') ? 'active' : ''}`}
              >
                <FaUser className="nav-icon" /> 
                {user?.name || 'Profilim' || profileName}
              </Link>
              <button className="logout-button" onClick={handleLogout}>
                <FaSignOutAlt className="nav-icon" /> Çıkış
              </button>
            </div>
          ) : (
            <button className="login-button" onClick={handleLoginClick}>
              Giriş Yap
            </button>
          )}
        </div>
      </div>
      <SettingsPopup
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          onLogout={handleLogout}
          onChangePassword={() => navigate('/change-password')}
      />
    </nav>
  );
};

export default Navbar; 