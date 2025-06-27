// src/pages/RestaurantDetailPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FaStar,
  FaMapMarkerAlt,
  FaArrowLeft,
  FaChevronLeft,
  FaChevronRight,
  FaTag,
  FaTimes,
  FaSearchPlus,
  FaSearchMinus,
  FaStarHalfAlt, FaRegStar
} from 'react-icons/fa';

import SaveButton from '../components/RestaurantDetailComponents/SaveButton';
import SaveToLists from '../components/RestaurantDetailComponents/SaveToLists';
import '../styles/RestaurantDetailPage.css';
import RestaurantReviews from '../components/RestaurantDetailComponents/RestaurantReviews.jsx';
import {getUserListItems, getUserLists} from "../services/listService.js";
import {getUserIdFromStorage} from "../services/userService.js";
import {useBusinessById} from "../hooks/useBusinessById.js";

const RestaurantDetailPage = () => {
  const { id } = useParams();
  const { data: restaurant, isLoading: loading, error } = useBusinessById(id);
  const [showListModal, setShowListModal] = useState(false);
  const [isSaved, setIsSaved] = useState();

  const [activeTab, setActiveTab] = useState('overview');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const reviewsRef = useRef(null);
  const imageRef = useRef(null);

  const token = localStorage.getItem('token');
  const isLogin = token !== null;

  useEffect(() => {
    if(isLogin){
      let mounted = true;
      const userId = getUserIdFromStorage();

      getUserLists(userId)
          .then(async (fetched) => {
            if (!mounted) return;

            const sorted = [
              ...fetched.filter(l => l.name === 'Favorilerim'),
              ...fetched.filter(l => l.name !== 'Favorilerim')
            ];

            // containsItem bilgisini ekle
            const listsWithContains = await Promise.all(sorted.map(async (list) => {
              const items = await getUserListItems(userId, list.id);
              return {
                ...list,
                containsItem: items.some(i => i.id === id)
              };
            }));

            const lists = listsWithContains;
            setIsSaved(lists.some(fav => fav.containsItem === true));
          })
          .catch(err => {
            console.error('Error fetching lists or items:', err);
          })
          .finally(() => mounted);

      return () => {
        mounted = false;
      };
    }

  }, [id, isLogin]);


  const nextImage = () => setCurrentImageIndex(prev => prev === photoUrls.length - 1 ? 0 : prev + 1);
  const prevImage = () => setCurrentImageIndex(prev => prev === 0 ? photoUrls.length - 1 : prev - 1);
  const nextModalImage = () => { resetZoom(); setModalImageIndex(prev => prev === photoUrls.length - 1 ? 0 : prev + 1); };
  const prevModalImage = () => { resetZoom(); setModalImageIndex(prev => prev === 0 ? photoUrls.length - 1 : prev - 1); };

  const openPhotoModal = (index) => {
    setModalImageIndex(index);
    setShowModal(true);
    // Prevent scrolling when modal is open
    document.body.style.overflow = 'hidden';
  };

  const closePhotoModal = () => {
    setShowModal(false);
    resetZoom();
    // Restore scrolling
    document.body.style.overflow = 'auto';
  };

  const zoomIn = () => {
    setZoomLevel(prev => {
      // Smoother zoom increments
      if (prev < 1.5) return 1.5;
      if (prev < 2) return 2;
      if (prev < 2.5) return 2.5;
      if (prev < 3) return 3;
      return Math.min(prev + 0.5, 4); // Allow higher max zoom
    });
  };

  const zoomOut = () => {
    setZoomLevel(prev => {
      if (prev > 3) return 3;
      if (prev > 2.5) return 2.5;
      if (prev > 2) return 2;
      if (prev > 1.5) return 1.5;
      const newZoom = 1;
      if (newZoom === 1) {
        resetImagePosition();
      }
      return newZoom;
    });
  };

  const resetZoom = () => {
    setZoomLevel(1);
    resetImagePosition();
  };

  const resetImagePosition = () => {
    setImagePosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - imagePosition.x,
        y: e.clientY - imagePosition.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && zoomLevel > 1) {
      setImagePosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleRatingClick = () => {
    setActiveTab('reviews');
    // Scroll to reviews section
    if (reviewsRef.current) {
      reviewsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Add keyboard event handler for modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showModal) return;

      switch (e.key) {
        case 'ArrowLeft':
          prevModalImage();
          break;
        case 'ArrowRight':
          nextModalImage();
          break;
        case 'Escape':
          closePhotoModal();
          break;
        case '+':
        case '=':
          zoomIn();
          break;
        case '-':
          zoomOut();
          break;
        case '0':
          resetZoom();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showModal, modalImageIndex]);

  // Add a function to handle main image click to open modal
  const handleMainImageClick = () => {
    openPhotoModal(currentImageIndex);
  };
  const weekdayMap = {
    0: "Pazar",
    1: "Pazartesi",
    2: "Salı",
    3: "Çarşamba",
    4: "Perşembe",
    5: "Cuma",
    6: "Cumartesi"
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="stars" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="stars" />);
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="stars" />);
    }

    return stars;
  };

  // Improved wheel event handler with better sensitivity
  const handleWheel = (e) => {
    if (!showModal) return;

    e.preventDefault();

    // More responsive zooming
    if (e.deltaY < 0) {
      // Scroll up, zoom in
      zoomIn();
    } else {
      // Scroll down, zoom out
      zoomOut();
    }
  };

  if (loading) {
    return <div className="loading-indicator">Restoran detayları yükleniyor...</div>;
  }

  if (error || !restaurant) {
    return (
        <div className="error-container">
          <div className="error-message">{error || 'Restoran bulunamadı'}</div>
          <Link to="/" className="back-link"><FaArrowLeft /> Ana Sayfaya Dön</Link>
        </div>
    );
  }
  // Fotoğraf URL dizisini hazırla ve yoksa hata göster
    const photoUrls = restaurant.photos?.map(p => p.url) || [];
    if (photoUrls.length === 0) {
      return <div className="error-container">Fotoğraf bulunamadı</div>;
    }
    const coverPhoto = restaurant.photos.find(p => p.cover)?.url || photoUrls[0];


  return (
      <div className="restaurant-detail-page">
        <div className="back-button">
          <Link to="/" className="back-link">
            <FaArrowLeft /> Geri
          </Link>
        </div>

        <div className="photo-section">
          <div className="restaurant-carousel">
            <button className="carousel-control prev" onClick={prevImage}>
              <FaChevronLeft />
            </button>

            <div className="carousel-container">
              <img
                  src={photoUrls[currentImageIndex] || coverPhoto}
                  alt={`${restaurant.name} - fotoğraf ${currentImageIndex + 1}`}
                  className="carousel-image"
                  onClick={handleMainImageClick}
                  style={{ cursor: 'pointer' }}
              />
              <div className="carousel-indicators">
                {photoUrls.map((_, index) => (
                    <button
                        key={index}
                        className={`carousel-dot ${currentImageIndex === index ? 'active' : ''}`}
                        onClick={() => setCurrentImageIndex(index)}
                    />
                ))}
              </div>
            </div>

            <button className="carousel-control next" onClick={nextImage}>
              <FaChevronRight />
            </button>
          </div>
        </div>

        <div className="restaurant-info-container">
          <div className="restaurant-header-row">
            <h1 className="restaurant-name">{restaurant.name}</h1>
            <div
                className="save-wrapper"
                style={{ display: isLogin ? 'inline-block' : 'none' }}
            >
              <SaveButton
                  itemId={String(id)}
                  isSaved={isSaved}

                  onToggle={(next) => setIsSaved(next)}
                  onCustomize={() => setShowListModal(true)}
              />
              {showListModal && (
                  <SaveToLists
                      itemId={String(id)}
                      onClose={(hasAny) => {
                        setShowListModal(false);
                        // Eğer artık hiçbir liste seçili değilse: butonu + yap
                        if (!hasAny) setIsSaved(false);
                      }}
                  />
              )}
            </div>
          </div>
          {restaurant.avgRating != 0.0 ? (
              <div className="rating-row">
                <div className="stars">
                  {renderStars(restaurant.avgRating)}
                </div>
                <button className="rating-button" onClick={handleRatingClick}>
                  <span className="rating-value">{restaurant.avgRating}</span>
                </button>
              </div>
          ):(
              <div className="rating-row">
                <div className="no-reviews">
                  Henüz bir değerlendirme yok.
                </div>
                <button className="rating-button" onClick={handleRatingClick}>
                  <span className="no-reviews">İlk değerlendirmeyi siz yapın!</span>
                </button>
              </div>
          )}


          <div className="restaurant-meta">
            <div className="restaurant-type">
              {restaurant.description || 'Tür bilinmiyor'} • {restaurant.priceRange}
            </div>
            <div className="restaurant-address">
              <FaMapMarkerAlt />
              {restaurant.address.street}, {restaurant.address.neighborhood}, {restaurant.address.district} / {restaurant.address.city}
            </div>
          </div>

          <div className="action-buttons">
            <button className="reserve-btn">Rezervasyon Yap</button>
            <button className="share-btn">Paylaş</button>
          </div>

          <div className="tabs">
            <button
                className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
            >
              Genel Bakış
            </button>
            <button
                className={`tab-btn ${activeTab === 'menu' ? 'active' : ''}`}
                onClick={() => setActiveTab('menu')}
            >
              Menü
            </button>
            <button
                className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                onClick={() => setActiveTab('reviews')}
                ref={reviewsRef}
            >
              Değerlendirmeler
            </button>
            <button
                className={`tab-btn ${activeTab === 'photos' ? 'active' : ''}`}
                onClick={() => setActiveTab('photos')}
            >
              Fotoğraflar
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'overview' && (
                <div className="overview-tab">
                  {restaurant.promotions?.length > 0 && (
                      <div className="promotions-section">
                        <h3>Güncel Promosyonlar</h3>
                        {restaurant.promotions.map((promo) => (
                            <div key={promo.id} className="promotion-card">
                              <div className="promotion-content">
                                <FaTag className="promotion-icon" />
                                <div className="promotion-details">
                                  <div className="promotion-details title">{promo.title}</div>
                                  <div className="promotion-details description">{promo.description}</div>
                                  <div className="promotion-details amount">%{promo.amount}</div>
                                  <div className="promotion-details date">
                                    {new Date(promo.startat).toLocaleDateString()} - {new Date(promo.endat).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                            </div>
                        ))}
                      </div>
                  )}

                  <div className="about-section">
                    <h3>Hakkında</h3>
                    <p className="about-text">
                      Restoran açıklaması buraya gelecek. Bu, mutfak, atmosfer, özellikler ve
                      diğer ilgili detaylar hakkında bilgi içerecektir.
                    </p>
                  </div>

                  <div className="hours-section">
                    <h3>Çalışma Saatleri</h3>
                    <div className="hours-list">
                      {restaurant.operatingHours?.map((day) => (
                          <div key={day.weekday} className="hours-item">
                            <span className="day">{weekdayMap[day.weekday]}</span>
                            <span className="time">
              {day.o_c
                  ? "Kapalı"
                  : `${day.opening_time?.slice(0, 5)} - ${day.closing_time?.slice(0, 5)}`}
            </span>
                          </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}


            {activeTab === 'menu' && (
                <div className="menu-tab">
                  <p>Menü içeriği burada gösterilecektir.</p>
                </div>
            )}
            {activeTab === 'reviews' && (
                <div className="reviews-tab">
                  {/* Yorum Formu + Yorumlar bileşeni */}
                  <RestaurantReviews restaurantId={id} />
                </div>
            )}
            {activeTab === 'photos' && (
                <div className="photos-tab">
                  <div className="photos-grid">
                    {photoUrls.map((url, index) => (
                        <div
                            key={index}
                            className="photo-item"
                            onClick={() => openPhotoModal(index)}
                        >
                          <img src={url} alt={`${restaurant.name} - galeri ${index + 1}`} />
                          <div className="photo-overlay">
                            <span>Görüntüle</span>
                          </div>
                        </div>
                    ))}
                  </div>
                </div>
            )}
          </div>
        </div>

        {/* Photo Modal */}
        {showModal && (
            <div className="photo-modal">
              <div className="modal-overlay" onClick={closePhotoModal}></div>
              <div className="modal-content">
                <button className="modal-close" onClick={closePhotoModal}>
                  <FaTimes />
                </button>

                <div className="zoom-controls">
                  <button className="zoom-btn" onClick={zoomIn} title="Yakınlaştır">
                    <FaSearchPlus />
                  </button>
                  <button className="zoom-btn" onClick={zoomOut} title="Uzaklaştır">
                    <FaSearchMinus />
                  </button>
                  <button className="zoom-btn" onClick={resetZoom} title="Sıfırla">
                    <FaTimes />
                  </button>
                </div>

                <div
                    className="modal-carousel"
                    style={{ cursor: zoomLevel > 1 ? 'move' : 'default' }}
                >
                  <button className="modal-control prev" onClick={prevModalImage}>
                    <FaChevronLeft />
                  </button>

                  <div
                      className="image-container"
                      onWheel={handleWheel}
                  >
                    <img
                        ref={imageRef}
                        src={photoUrls[modalImageIndex] || coverPhoto}
                        alt={`${restaurant.name} - fotoğraf ${modalImageIndex + 1}`}
                        className="modal-image"
                        style={{
                          transform: `scale(${zoomLevel})`,
                          transformOrigin: 'center',
                          transition: isDragging ? 'none' : 'transform 0.3s ease',
                          cursor: zoomLevel > 1 ? 'move' : 'default',
                          translate: `${imagePosition.x}px ${imagePosition.y}px`
                        }}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onDoubleClick={zoomIn}
                    />
                  </div>

                  <button className="modal-control next" onClick={nextModalImage}>
                    <FaChevronRight />
                  </button>
                </div>

                <div className="modal-indicators">
                  {photoUrls.map((_, index) => (
                      <button
                          key={index}
                          className={`modal-dot ${modalImageIndex === index ? 'active' : ''}`}
                          onClick={() => { resetZoom(); setModalImageIndex(index); }}
                      />
                  ))}
                </div>

                <div className="modal-counter">
                  {modalImageIndex + 1} / {photoUrls.length}
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default RestaurantDetailPage;