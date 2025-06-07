import React from 'react';
import { Link } from 'react-router-dom';
import {FaStar, FaMapMarkerAlt, FaHeart, FaRegHeart, FaTag, FaStarHalfAlt, FaRegStar} from 'react-icons/fa';
import './RestaurantCard.css';

/**
 * Restaurant Card component for displaying restaurant information
 * @param {Object} restaurant - Restaurant data
 * @param {Array} favorites - List of favorite restaurant IDs
 * @param {Function} toggleFavorite - Function to toggle favorite status
 * @param {boolean} featured - Whether this is a featured restaurant
 */
const FavoritesRestaurantCard = ({ restaurant, favorites, toggleFavorite, featured = false }) => {

  const { id, name, type, distance, rating, image, priceRange, hasActivePromo, promoDetails , promoTitle, promoAmount, address , tags } = restaurant;
  const isFavorite = favorites.some(fav => fav.id === id);
  const token = localStorage.getItem('token');
  const isLogin = token !== null;
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


  return (
    <div className={`restaurant-card ${featured ? 'featured' : ''}`}>
      <Link to={`/restaurant/${id}`} className="restaurant-link">
        <div className="restaurant-image">
          <img src={image} alt={name} />
          <button
              className="favorite-button"
              onClick={(e) => toggleFavorite(id, e)}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              disabled={!isLogin}
              style={{ display: isLogin ? 'inline-block' : 'none' }}
          >
            {isFavorite
                ? <FaHeart className="heart filled" />
                : <FaRegHeart className="heart" />
            }
          </button>
          
          {hasActivePromo && (
            <div className="promo-badge">
              <FaTag /> {promoTitle}
            </div>
          )}
        </div>
        
        <div className="restaurant-info">
          <div className="restaurant-header">
            <h3>{name}</h3>
            {priceRange && <span className="price-range">{priceRange}</span>}
          </div>

          {/* Mutfak Türü */}
          <p className="restaurant-type">{type}</p>

          {address && (
              <p className="restaurant-location">
                <FaMapMarkerAlt /> {address.city}, {address.district}
              </p>
          )}

          {tags && tags.length > 0 && (
              <div className="tag-list">
                {tags.map(tag => (
                    <span key={tag.id} className="tag">
                  {tag.name.trim()}
                </span>
                ))}
              </div>
          )}
          {restaurant.rating != 0.0 ? (
              <div className="rating-container">
                {renderStars(rating)}
                <span className="rating-value">{rating}</span>
              </div>
          ):(
              <div className="rating-container">
                <span className="rating-value">Henüz bir değerlendirme yok.</span>
              </div>
          )}
          {hasActivePromo && promoDetails && (
            <div className="promo-details">
              <FaTag className="promo-icon" />
              <span>{promoDetails}</span>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default FavoritesRestaurantCard;