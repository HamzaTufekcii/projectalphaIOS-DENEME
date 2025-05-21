import React, { useState, useEffect } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import '../styles/FavoritesPage.css';
import { FaHeart, FaStar, FaExclamationCircle } from 'react-icons/fa';
import {getUserIdFromStorage, getUserRoleFromStorage} from "../services/userService.js";

const API_BASE_URL = 'http://localhost:8080/api';

// Mock data for development - Remove in production
const MOCK_DATA = [
  {
    id: 'bus1',
    name: 'Italian Restaurant',
    address: '123 Main St, City',
    imageUrl: 'https://via.placeholder.com/300x200',
    rating: 4.5,
    category: 'Italian',
    priceRange: '$$',
    businessType: 'restaurant'
  },
  {
    id: 'bus2',
    name: 'City Cafe',
    address: '456 Oak St, City',
    imageUrl: 'https://via.placeholder.com/300x200',
    rating: 4.2,
    category: 'Cafe',
    priceRange: '$',
    businessType: 'cafe'
  },
  {
    id: 'bus3',
    name: 'Burger Joint',
    address: '789 Elm St, City',
    imageUrl: 'https://via.placeholder.com/300x200',
    rating: 4.0,
    category: 'Burgers',
    priceRange: '$$',
    businessType: 'restaurant'
  }
];

const FavoritesPage = () => {
  const { userId } = useParams();
  const {role} = useParams();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [useMockData, setUseMockData] = useState(false);

  const currentUserId = userId || getUserIdFromStorage();
  const currentUserRole = role || getUserRoleFromStorage();

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        setError('Bu sayfayı görüntülemek için giriş yapmalısınız.');
        setIsLoading(false);
        return false;
      }
      setIsAuthenticated(true);
      return true;
    };

    
    const fetchFavorites = async () => {
      setIsLoading(true);
      
      if (!checkAuth()) return;

      
      try {
        // Get all user lists
        const response = await axios.get(`${API_BASE_URL}/users/${currentUserRole}/${currentUserId}/lists`);
        // Find the favorites list
        const favList = response.data;
        
        if (favList) {
          setFavorites(favList || []);
        } else {
          setFavorites([]);
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching favorites:', err);
        
        if (err.response && err.response.status === 401) {
          // Handle unauthorized error - token might be expired
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          setError('Oturumunuz sona erdi. Lütfen tekrar giriş yapın.');
        } else {
          // For development, use mock data
          console.log('Using mock data for development');
          setFavorites(MOCK_DATA);
          setUseMockData(true);
          setError(null);
        }
        
        setIsLoading(false);
      }
    };
    
    fetchFavorites();
  }, [navigate]);
  
  const handleRemoveFavorite = async (businessId) => {
    // If using mock data, just remove from UI
    if (useMockData) {
      setFavorites(prevFavorites => 
        prevFavorites.filter(business => business.id !== businessId)
      );
      return;
    }
    
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      navigate('/');
      return;
    }
    
    let userId;
    try {
      const userData = JSON.parse(userJson);
      userId = userData.id || userData.userId;
      if (!userId) throw new Error('User ID not found');
    } catch (e) {
      console.error('Error parsing user data', e);
      return;
    }
    
    try {
      // Configure request with auth header
      const config = {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      };
      
      // Find favorites list ID
      const listsResponse = await axios.get(`${API_BASE_URL}/users/${userId}/lists`, config);
      const favList = listsResponse.data.find(list => list.isFavorites);
      
      if (favList) {
        await axios.delete(`${API_BASE_URL}/users/${userId}/lists/${favList.id}/businesses/${businessId}`, config);
        
        // Update state to remove the business
        setFavorites(prevFavorites => 
          prevFavorites.filter(business => business.id !== businessId)
        );
      }
    } catch (err) {
      console.error('Error removing from favorites:', err);
      
      // Remove it from UI anyway
      setFavorites(prevFavorites => 
        prevFavorites.filter(business => business.id !== businessId)
      );
    }
  };
  
  const handleLoginClick = () => {
    navigate('/');
    // If we're on HomePage, trigger the login popup
    setTimeout(() => {
      const homePageInstance = window.homePageInstance;
      if (homePageInstance && typeof homePageInstance.openLoginPopup === 'function') {
        homePageInstance.openLoginPopup();
      }
    }, 100);
  };
  
  if (isLoading) {
    return <div className="loading-spinner">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return (
      <div className="not-authenticated">
        <div className="auth-error">
          <FaExclamationCircle className="error-icon" />
          <h2>Giriş Gerekli</h2>
          <p>{error || 'Bu sayfayı görüntülemek için giriş yapmalısınız.'}</p>
          <button className="login-btn" onClick={handleLoginClick}>Giriş Yap</button>
        </div>
      </div>
    );
  }
  
  if (error && isAuthenticated) {
    return <div className="error-message">{error}</div>;
  }
  
  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <h1>Favorilerim</h1>
        {useMockData && (
          <div className="dev-notice">
            <p>Not: API bağlantısı kurulamadığı için geliştirme amaçlı test verileri görüntüleniyor.</p>
          </div>
        )}
      </div>
      
      {favorites.length > 0 ? (
        <div className="favorites-grid">
          {favorites.map(business => (
            <div key={business.id} className="business-card">
              <div className="business-image">
                <img src={business.imageUrl} alt={business.name} />
                <button 
                  className="remove-favorite-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFavorite(business.id);
                  }}
                >
                  <FaHeart />
                </button>
              </div>
              <div 
                className="business-info"
                onClick={() => navigate(`/business/${business.id}`)}
              >
                <h3>{business.name}</h3>
                <p className="business-category">{business.category}</p>
                <p className="business-address">{business.address}</p>
                <div className="business-details">
                  <span className="business-rating">
                    <FaStar /> {business.rating}
                  </span>
                  <span className="business-price">{business.priceRange}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-favorites">
          <p>Henüz favori işletmeniz bulunmuyor.</p>
          <button 
            className="browse-button"
            onClick={() => navigate('/')}
          >
            İşletmelere Göz At
          </button>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage; 