import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/UserListsPage.css';
import { FaList, FaStar, FaExclamationCircle, FaShare, FaEllipsisH } from 'react-icons/fa';

const API_BASE_URL = 'http://localhost:8080/api';

// Mock data for development - Remove in production
const MOCK_DATA = [
  {
    id: 'list1',
    name: 'İstanbul\'un En İyi Kahvecileri',
    userId: 'user1',
    userName: 'Ahmet Yılmaz',
    createdAt: new Date().toISOString(),
    isPublic: true,
    businesses: [
      {
        id: 'bus1',
        name: 'Kronotrop Coffee Bar',
        address: 'Cihangir, İstanbul',
        imageUrl: 'https://via.placeholder.com/300x200',
        rating: 4.8,
        category: 'Kahve',
        priceRange: '$$',
        businessType: 'cafe'
      },
      {
        id: 'bus2',
        name: 'Coffee Department',
        address: 'Nişantaşı, İstanbul',
        imageUrl: 'https://via.placeholder.com/300x200',
        rating: 4.6,
        category: 'Kahve',
        priceRange: '$$',
        businessType: 'cafe'
      }
    ]
  },
  {
    id: 'list2',
    name: 'Ankara\'da Keşfedilecek Yerler',
    userId: 'user2',
    userName: 'Zeynep Kaya',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    isPublic: true,
    businesses: [
      {
        id: 'bus3',
        name: 'Hamamönü Restoran',
        address: 'Hamamönü, Ankara',
        imageUrl: 'https://via.placeholder.com/300x200',
        rating: 4.3,
        category: 'Türk Mutfağı',
        priceRange: '$$',
        businessType: 'restaurant'
      },
      {
        id: 'bus4',
        name: 'Seğmenler Park Kafe',
        address: 'Çankaya, Ankara',
        imageUrl: 'https://via.placeholder.com/300x200',
        rating: 4.0,
        category: 'Kafe',
        priceRange: '$',
        businessType: 'cafe'
      }
    ]
  }
];

const UserListsPage = () => {
  const navigate = useNavigate();
  const [userLists, setUserLists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [useMockData, setUseMockData] = useState(false);

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

    const getUserId = () => {
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
    
    const fetchUserLists = async () => {
      setIsLoading(true);
      
      if (!checkAuth()) return;
      
      const userId = getUserId();
      if (!userId) {
        setError('Kullanıcı bilgileri bulunamadı. Lütfen tekrar giriş yapın.');
        setIsLoading(false);
        return;
      }
      
      try {
        // Configure request with auth header
        const config = {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        };
        
        // Get public lists
        const response = await axios.get(`${API_BASE_URL}/lists/public`, config);
        setUserLists(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching public lists:', err);
        
        if (err.response && err.response.status === 401) {
          // Handle unauthorized error - token might be expired
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          setError('Oturumunuz sona erdi. Lütfen tekrar giriş yapın.');
        } else {
          // For development, use mock data
          console.log('Using mock data for development');
          setUserLists(MOCK_DATA);
          setUseMockData(true);
          setError(null);
        }
        
        setIsLoading(false);
      }
    };
    
    fetchUserLists();
  }, [navigate]);
  
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
    return <div className="loading-spinner">Yükleniyor...</div>;
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
    <div className="user-lists-page">
      <div className="user-lists-header">
        <h1>Keşfedilecek Listeler</h1>
        {useMockData && (
          <div className="dev-notice">
            <p>Not: API bağlantısı kurulamadığı için geliştirme amaçlı test verileri görüntüleniyor.</p>
          </div>
        )}
      </div>
      
      {userLists.length > 0 ? (
        <div className="lists-container">
          {userLists.map(list => (
            <div key={list.id} className="list-card">
              <div className="list-header">
                <h2>{list.name}</h2>
                <div className="list-creator">
                  <span>{list.userName} tarafından oluşturuldu</span>
                  <span className="list-date">{new Date(list.createdAt).toLocaleDateString('tr-TR')}</span>
                </div>
                <div className="list-actions">
                  <button className="share-button">
                    <FaShare /> Paylaş
                  </button>
                  <button className="more-button">
                    <FaEllipsisH />
                  </button>
                </div>
              </div>
              
              <div className="list-items">
                {list.businesses.map(business => (
                  <div 
                    key={business.id} 
                    className="business-item"
                    onClick={() => navigate(`/business/${business.id}`)}
                  >
                    <div className="business-image">
                      <img src={business.imageUrl} alt={business.name} />
                    </div>
                    <div className="business-details">
                      <h3>{business.name}</h3>
                      <p className="business-category">{business.category}</p>
                      <p className="business-address">{business.address}</p>
                      <div className="business-footer">
                        <span className="business-rating">
                          <FaStar /> {business.rating}
                        </span>
                        <span className="business-price">{business.priceRange}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-lists">
          <p>Henüz paylaşılan liste bulunmuyor.</p>
          <button 
            className="browse-button"
            onClick={() => navigate('/profile')}
          >
            Kendi Listeni Oluştur
          </button>
        </div>
      )}
    </div>
  );
};

export default UserListsPage; 