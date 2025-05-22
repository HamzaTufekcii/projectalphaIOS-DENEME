// src/pages/RestaurantDetailPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaArrowLeft } from 'react-icons/fa';
import { getBusinessById } from '../services/businessService';
import '../styles/RestaurantDetailPage.css';
import RestaurantReviews from '../components/RestaurantDetailComponents/RestaurantReviews.jsx';

const RestaurantDetailPage = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const reviewsRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getBusinessById(id);
        setRestaurant(data);
      } catch (err) {
        console.error('Error fetching restaurant details:', err);
        setError('Restoran detayları yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleRatingClick = () => {
    setActiveTab('reviews');
    if (reviewsRef.current) reviewsRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) return <div className="loading-indicator">Restoran detayları yükleniyor...</div>;
  if (error || !restaurant) {
    return (
        <div className="error-container">
          <div className="error-message">{error || 'Restoran bulunamadı'}</div>
          <Link to="/" className="back-link"><FaArrowLeft /> Ana Sayfaya Dön</Link>
        </div>
    );
  }

  return (
      <div className="restaurant-detail-page">
        <div className="back-button">
          <Link to="/" className="back-link"><FaArrowLeft /> Geri</Link>
        </div>
        <div className="restaurant-info-container">
          <h1 className="restaurant-name">{restaurant.name}</h1>
          <div className="rating-row" onClick={handleRatingClick} style={{ cursor: 'pointer' }}>
            <FaStar className="star-icon" /> <span className="rating-value">{restaurant.avg_rating || restaurant.rating}</span>
          </div>
          <div className="restaurant-meta">
            <div className="restaurant-type">{restaurant.type || ''}</div>
            <div className="restaurant-address"><FaMapMarkerAlt /> {restaurant.address || restaurant.addresses}</div>
          </div>
          <div className="tabs">
            <button className={`tab-btn ${activeTab==='overview'?'active':''}`} onClick={()=>setActiveTab('overview')}>Genel Bakış</button>
            <button className={`tab-btn ${activeTab==='reviews'?'active':''}`} onClick={handleRatingClick} ref={reviewsRef}>Değerlendirmeler</button>
          </div>
          <div className="tab-content">
            {activeTab==='overview' && <div className="overview-tab"><p>{restaurant.description}</p></div>}
            {activeTab==='reviews' && <div className="reviews-tab"><RestaurantReviews restaurantId={id} /></div>}
          </div>
        </div>
      </div>
  );
};

export default RestaurantDetailPage;
