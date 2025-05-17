import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/ProfilePage.css';
import { FaHeart, FaList, FaUser, FaEdit, FaCog, FaStar, FaExclamationCircle } from 'react-icons/fa';

// Mock data - in production, this would come from the backend
const API_BASE_URL = 'http://localhost:8080/api';

// Mock user user data for development
const MOCK_USER_PROFILE = {
  id: 'user123',
  name: 'Ahmet',
  surname: 'Yılmaz',
  email: 'ahmet.yilmaz@example.com',
  phone: '+90 555 123 4567',
  profilePicture: 'https://via.placeholder.com/150',
  role: 'user'
};

// Mock lists for development
const MOCK_USER_LISTS = [
  {
    id: 'list1',
    name: 'Favorilerim',
    userId: 'user123',
    createdAt: new Date().toISOString(),
    businesses: [
      {
        id: 'bus1',
        name: 'Italian Restaurant',
        address: '123 Main St',
        imageUrl: 'https://via.placeholder.com/100',
        rating: 4.5,
        category: 'Italian',
        priceRange: '$$',
        businessType: 'restaurant'
      }
    ],
    isFavorites: true
  },
  {
    id: 'list2',
    name: 'Deneyimlemek İstediklerim',
    userId: 'user123',
    createdAt: new Date().toISOString(),
    businesses: [
      {
        id: 'bus2',
        name: 'City Cafe',
        address: '456 Oak St',
        imageUrl: 'https://via.placeholder.com/100',
        rating: 4.2,
        category: 'Cafe',
        priceRange: '$',
        businessType: 'cafe'
      }
    ],
    isFavorites: false
  }
];

// Mock reviews for development
const MOCK_USER_REVIEWS = [
  {
    id: 'rev1',
    userId: 'user123',
    businessId: 'bus1',
    businessName: 'Italian Restaurant',
    businessImageUrl: 'https://via.placeholder.com/100',
    rating: 4.5,
    comment: 'Harika yemekler ve müşteri hizmeti!',
    createdAt: new Date().toISOString()
  },
  {
    id: 'rev2',
    userId: 'user123',
    businessId: 'bus2',
    businessName: 'City Cafe',
    businessImageUrl: 'https://via.placeholder.com/100',
    rating: 4.0,
    comment: 'Güzel bir ortam, kahveleri mükemmel.',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const ProfilePage = () => {
  const { userId } = useParams();
  const {role} = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [userProfile, setUserProfile] = useState(null);
  const [userLists, setUserLists] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useMockData, setUseMockData] = useState(false);
  
  // Get user ID from localStorage if not provided in URL
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
  
  const currentUserId = userId || getUserIdFromStorage().trim();
  const currentUserRole = role || getUserRoleFromStorage().trim();
  
  useEffect(() => {
    // Verify auth
    const token = localStorage.getItem('token');
    if (!token || !currentUserId) {
      navigate('/');
      // Trigger login popup if on home page
      setTimeout(() => {
        const homePageInstance = window.homePageInstance;
        if (homePageInstance && typeof homePageInstance.openLoginPopup === 'function') {
          homePageInstance.openLoginPopup();
        }
      }, 100);
      return;
    }
    
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        // Configure request with auth header
        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };
        // Fetch user user
        const profileResponse = await axios.get(`${API_BASE_URL}/users/${currentUserRole}/${currentUserId}/profile`);
        console.log(profileResponse.data.email);
        setUserProfile(profileResponse.data);
        setEditFormData(profileResponse.data);

        
        // Fetch user lists
        const listsResponse = await axios.get(`${API_BASE_URL}/users/${currentUserRole}/${currentUserId}/lists`);
        setUserLists(listsResponse.data);
        
        // Fetch user reviews
        const reviewsResponse = await axios.get(`${API_BASE_URL}/users/${currentUserRole}/${currentUserId}/reviews`);
        setUserReviews(reviewsResponse.data);
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        
        if (err.response && err.response.status === 401) {
          // Handle unauthorized error - token might be expired
          localStorage.removeItem('token');
          navigate('/');
          return;
        }
        
        // For development, use mock data
        console.log('Using mock data for user page development');
        setUserLists(MOCK_USER_LISTS);
        setUserReviews(MOCK_USER_REVIEWS);
        setUseMockData(true);
        setError(null);
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [currentUserId, navigate]);
  
  const handleProfileEdit = (e) => {
    e.preventDefault();
    const requestBody = {
        email: editFormData.email.trim(),
        role: currentUserRole,
        requestDiner: {
          name: editFormData.name.trim(),
          surname: editFormData.surname.trim(),
          phone_numb: editFormData.phone.trim(),
        }
      }

    // Save user changes
    axios.put(`${API_BASE_URL}/users/${currentUserRole}/${currentUserId}/profile`, requestBody)
      .then(response => {
        setUserProfile(editFormData);
        setIsEditing(false);
      })
      .catch(err => {
        console.error('Error updating user:', err);
        // In development, we'll just update the UI anyway
        setUserProfile(editFormData);
        setIsEditing(false);
      });
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };
  
  const handleCreateList = () => {
    const listName = prompt('Yeni listeniz için bir isim girin:');
    if (listName) {
      axios.post(`${API_BASE_URL}/users/${currentUserId}/lists`, { name: listName })
        .then(response => {
          setUserLists([...userLists, response.data]);
        })
        .catch(err => {
          console.error('Error creating list:', err);
          // Mock response for development
          const newList = {
            id: `list${new Date().getTime()}`,
            name: listName,
            userId: currentUserId,
            createdAt: new Date().toISOString(),
            businesses: [],
            isFavorites: false
          };
          setUserLists([...userLists, newList]);
        });
    }
  };
  
  // Render Profile Tab Content
  const renderProfileTab = () => (
    <div className="profile-tab-content">
      {isEditing ? (
        <form onSubmit={handleProfileEdit} className="profile-edit-form">
          <div className="form-group">
            <label>Ad</label>
            <input 
              type="text" 
              name="name" 
              value={editFormData.name || ''} 
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Soyad</label>
            <input 
              type="text" 
              name="surname" 
              value={editFormData.surname || ''} 
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>E-posta</label>
            <input 
              type="email" 
              name="email" 
              value={editFormData.email || ''} 
              onChange={handleInputChange}
              required
              disabled
            />
          </div>
          <div className="form-group">
            <label>Telefon</label>
            <input 
              type="text" 
              name="phone" 
              value={editFormData.phone || ''} 
              onChange={handleInputChange}
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="save-button">Değişiklikleri Kaydet</button>
            <button 
              type="button" 
              className="cancel-button"
              onClick={() => {
                setIsEditing(false);
                setEditFormData(userProfile);
              }}
            >
              İptal
            </button>
          </div>
        </form>
      ) : (
        <div className="profile-info">
          <div className="profile-header">
            <div className="profile-picture">
              <img src={userProfile?.profilePicture || 'https://via.placeholder.com/150'} alt="Profile" />
            </div>
            <div className="profile-details">
              <h1>{userProfile?.name} {userProfile?.surname}</h1>
              <p>{userProfile?.email}</p>
              <p>{userProfile?.phone}</p>
              <button 
                className="edit-profile-button"
                onClick={() => setIsEditing(true)}
              >
                <FaEdit /> Profili Düzenle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  
  // Render Lists Tab Content
  const renderListsTab = () => (
    <div className="lists-tab-content">
      <div className="lists-header">
        <h2>Listelerim</h2>
        <button className="create-list-button" onClick={handleCreateList}>
          Yeni Liste Oluştur
        </button>
      </div>
      
      <div className="lists-container">
        {userLists.map(list => (
          <div key={list.id} className="list-card">
            <div className="list-header">
              <h3>
                {list.isFavorites ? <FaHeart className="favorites-icon" /> : <FaList />}
                {list.name}
              </h3>
              <span className="business-count">{list.businesses ? list.businesses.length : 0} işletme</span>
            </div>
            <div className="list-businesses">
              {list.businesses && list.businesses.length > 0 ? (
                list.businesses.map(business => (
                  <div key={business.id} className="business-item" onClick={() => navigate(`/business/${business.id}`)}>
                    <img src={business.imageUrl} alt={business.name} />
                    <div className="business-info">
                      <h4>{business.name}</h4>
                      <p>{business.category} • {business.priceRange}</p>
                      <div className="business-rating">
                        <FaStar /> {business.rating}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="empty-list-message">Bu liste boş. İşletmeleri görmek için ekleyin.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
  // Render Reviews Tab Content
  const renderReviewsTab = () => (
    <div className="reviews-tab-content">
      <h2>Değerlendirmelerim</h2>
      
      {userReviews.length > 0 ? (
        <div className="reviews-container">
          {userReviews.map(review => (
            <div key={review.id} className="review-card">
              <div className="review-business">
                <img src={review.businessImageUrl} alt={review.businessName} />
                <h3 onClick={() => navigate(`/business/${review.businessId}`)}>
                  {review.businessName}
                </h3>
              </div>
              <div className="review-content">
                <div className="review-rating">
                  {[...Array(5)].map((_, index) => (
                    <FaStar 
                      key={index}
                      className={index < review.rating ? 'star-filled' : 'star-empty'}
                    />
                  ))}
                  <span>{review.rating}</span>
                </div>
                <p className="review-comment">{review.comment}</p>
                <p className="review-date">
                  {new Date(review.createdAt).toLocaleDateString('tr-TR')}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="empty-reviews-message">Henüz değerlendirme yazmadınız.</p>
      )}
    </div>
  );
  
  // Render Settings Tab Content
  const renderSettingsTab = () => (
    <div className="settings-tab-content">
      <h2>Hesap Ayarları</h2>
      
      <div className="settings-section">
        <h3>Gizlilik</h3>
        <div className="setting-item">
          <label>
            <input type="checkbox" defaultChecked={true} />
            Değerlendirmelerimi herkese açık göster
          </label>
        </div>
        <div className="setting-item">
          <label>
            <input type="checkbox" defaultChecked={true} />
            E-posta bildirimlerine izin ver
          </label>
        </div>
      </div>
      
      <div className="settings-section">
        <h3>Hesap</h3>
        <button className="change-password-button">
          Şifremi Değiştir
        </button>
        <button className="logout-button" onClick={() => {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          navigate('/');
        }}>
          Çıkış Yap
        </button>
      </div>
    </div>
  );
  
  // Render based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab();
      case 'lists':
        return renderListsTab();
      case 'reviews':
        return renderReviewsTab();
      case 'settings':
        return renderSettingsTab();
      default:
        return renderProfileTab();
    }
  };
  
  if (isLoading) {
    return <div className="loading-spinner">Loading...</div>;
  }
  
  if (error) {
    return <div className="error-message">{error}</div>;
  }
  
  return (
    <div className="profile-page">
      {useMockData && (
        <div className="dev-notice">
          <p>Not: API bağlantısı kurulamadığı için geliştirme amaçlı test verileri görüntüleniyor.</p>
        </div>
      )}
      
      <div className="profile-sidebar">
        <div 
          className={`sidebar-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <FaUser /> Profil
        </div>
        <div 
          className={`sidebar-item ${activeTab === 'lists' ? 'active' : ''}`}
          onClick={() => setActiveTab('lists')}
        >
          <FaList /> Listelerim
        </div>
        <div 
          className={`sidebar-item ${activeTab === 'reviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          <FaStar /> Değerlendirmelerim
        </div>
        <div 
          className={`sidebar-item ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <FaCog /> Ayarlar
        </div>
      </div>
      
      <div className="profile-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ProfilePage; 