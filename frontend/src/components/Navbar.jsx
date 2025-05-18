import React, { useState, useEffect } from 'react';
import {Link, useLocation, useNavigate, useParams} from 'react-router-dom';
import '../styles/Navbar.css';
import SettingsPopup from "./HomePageComponents/SettingsPopup.jsx";
import { FaUser, FaHeart, FaSignOutAlt, FaList, FaCog, FaStar } from 'react-icons/fa';
import axios from 'axios';
import {preload} from "react-dom";

const Navbar = () => {
  const { userId } = useParams();
  const {role} = useParams();
  const {profileName, setProfileName} =  useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const API_BASE_URL = 'http://localhost:8080/api';
  const getUserIdFromStorage = () => {
    const userJson = localStorage.getItem('user');
    if (!userJson) return null;

    try {
      const userData = JSON.parse(userJson);
      return userData.id || userData.userId || null;
    } catch (e) {
      console.error('Error parsing user data', e);
      return null;
    }
  };
  const getUserRoleFromStorage = () => {
    const userJson = localStorage.getItem('user');
    if (!userJson) return null;
    try{
      const userData = JSON.parse(userJson);
      return userData.app_metadata.role || null;
    }catch(e){
      console.error('There is no role in token.', e);
      return null;
    }
  }

  const currentUserId = userId || getUserIdFromStorage();
  const currentUserRole = role || getUserRoleFromStorage();

  // Check if user is logged in - this runs on component mount and on location changes
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token) {
        setIsLoggedIn(true);
        if (userData) {
          try {
            setUser(JSON.parse(userData));
            handleChangeProfileToName();
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
  }, []); // Re-check auth status when route changes

  const handleChangeProfileToName = async () => {

    if(currentUserId == null || currentUserRole == null) {
      setUser(null);
    }
    try{
      const id = currentUserId.trim();
      const role = currentUserRole.trim();
      const profileResponse = await axios.get(`${API_BASE_URL}/users/${role}/${id}/profile`);
      setUser(profileResponse.data);
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
          <Link to="/" className="brand-link">FeastFine</Link>
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