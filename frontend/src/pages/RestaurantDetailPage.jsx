// src/pages/RestaurantDetailPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaArrowLeft, FaChevronLeft, FaChevronRight, FaTag, FaTimes, FaSearchPlus, FaSearchMinus } from 'react-icons/fa';
import { getBusinessById } from '../services/businessService';
import SaveButton from '../components/RestaurantDetailComponents/SaveButton';
import SaveToLists from '../components/RestaurantDetailComponents/SaveToLists';
import '../styles/RestaurantDetailPage.css';
import RestaurantReviews from '../components/RestaurantDetailComponents/RestaurantReviews.jsx';
import {getUserListItems, getUserLists} from "../services/listService.js";
import {getUserFavoritesIdFromStorage, getUserIdFromStorage} from "../services/userService.js";

const RestaurantDetailPage = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showListModal, setShowListModal] = useState(false);
  const [isSaved, setIsSaved] = useState();
  const [error, setError] = useState(null);
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

  // Sample images for carousel (this would come from the API in a real implementation)
  const demoImages = [
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    'https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
  ];
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
          .finally(() => mounted && setLoading(false));

      return () => {
        mounted = false;
      };
    }

  }, [id, isLogin]);

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







  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
        prevIndex === demoImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? demoImages.length - 1 : prevIndex - 1
    );
  };

  const nextModalImage = () => {
    resetZoom();
    setModalImageIndex((prevIndex) =>
        prevIndex === demoImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevModalImage = () => {
    resetZoom();
    setModalImageIndex((prevIndex) =>
        prevIndex === 0 ? demoImages.length - 1 : prevIndex - 1
    );
  };

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
          <Link to="/" className="back-link">
            <FaArrowLeft /> Ana Sayfaya Dön
          </Link>
        </div>
    );
  }


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
                  src={demoImages[currentImageIndex] || restaurant.image}
                  alt={`${restaurant.name} - fotoğraf ${currentImageIndex + 1}`}
                  className="carousel-image"
                  onClick={handleMainImageClick}
                  style={{ cursor: 'pointer' }}
              />
              <div className="carousel-indicators">
                {demoImages.map((_, index) => (
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

          <div className="rating-row">
            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                      key={star}
                      className={star <= Math.floor(restaurant.rating) ? "star filled" : "star"}
                  />
              ))}
            </div>
            <button className="rating-button" onClick={handleRatingClick}>
              <span className="rating-value">{restaurant.rating}</span>
              <span className="review-count">(restaurant.)</span>
            </button>
          </div>

          <div className="restaurant-meta">
            <div className="restaurant-type">
              Fine Dining • {restaurant.priceRange}
            </div>
            <div className="restaurant-address">
              <FaMapMarkerAlt /> 123 Ana Cadde, Şehir, Bölge
            </div>
            <div className="opening-hours">
              Saat 22:00'a kadar açık
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
                  {restaurant.hasActivePromo && (
                      <div className="promotions-section">
                        <h3>Güncel Promosyonlar</h3>
                        <div className="promotion-card">
                          <div className="promotion-content">
                            <FaTag className="promotion-icon" />
                            <div className="promotion-details">
                              <h4>Tüm Ana Yemeklerde %10 İndirim - Pazartesi'den Perşembe'ye Geçerli</h4>
                              <p>Kod: FEAST10</p>
                            </div>
                          </div>
                        </div>
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
                      <div className="hours-item">
                        <span className="day">Pazartesi</span>
                        <span className="time">11:00 - 22:00</span>
                      </div>
                      <div className="hours-item">
                        <span className="day">Salı</span>
                        <span className="time">11:00 - 22:00</span>
                      </div>
                      <div className="hours-item">
                        <span className="day">Çarşamba</span>
                        <span className="time">11:00 - 22:00</span>
                      </div>
                      <div className="hours-item">
                        <span className="day">Perşembe</span>
                        <span className="time">11:00 - 22:00</span>
                      </div>
                      <div className="hours-item">
                        <span className="day">Cuma</span>
                        <span className="time">11:00 - 23:00</span>
                      </div>
                      <div className="hours-item">
                        <span className="day">Cumartesi</span>
                        <span className="time">10:00 - 23:00</span>
                      </div>
                      <div className="hours-item">
                        <span className="day">Pazar</span>
                        <span className="time">10:00 - 21:00</span>
                      </div>
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
                    {demoImages.map((image, index) => (
                        <div
                            key={index}
                            className="photo-item"
                            onClick={() => openPhotoModal(index)}
                        >
                          <img src={image} alt={`${restaurant.name} - galeri ${index + 1}`} />
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
                        src={demoImages[modalImageIndex]}
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
                  {demoImages.map((_, index) => (
                      <button
                          key={index}
                          className={`modal-dot ${modalImageIndex === index ? 'active' : ''}`}
                          onClick={() => {
                            resetZoom();
                            setModalImageIndex(index);
                          }}
                      />
                  ))}
                </div>

                <div className="modal-counter">
                  {modalImageIndex + 1} / {demoImages.length}
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default RestaurantDetailPage;