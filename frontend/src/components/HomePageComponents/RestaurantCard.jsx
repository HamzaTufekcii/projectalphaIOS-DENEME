import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaHeart, FaRegHeart } from 'react-icons/fa';
import './RestaurantCard.css';

/**
 * Restaurant Card component for displaying restaurant information
 * @param {Object} restaurant - Restaurant data
 * @param {Array} favorites - List of favorite restaurant IDs
 * @param {Function} toggleFavorite - Function to toggle favorite status
 * @param {boolean} featured - Whether this is a featured restaurant
 */
const RestaurantCard = ({ restaurant, favorites, toggleFavorite, featured = false }) => {
  const { id, name, type, distance, rating, image } = restaurant;
  const isFavorite = favorites.includes(id);

  return (
    <div className={`restaurant-card ${featured ? 'featured' : ''}`}>
      <Link to={`/restaurant/${id}`} className="restaurant-link">
        <div className="restaurant-image">
          <img src={image} alt={name} />
          <button 
            className="favorite-button" 
            onClick={(e) => toggleFavorite(id, e)}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            {isFavorite ? <FaHeart className="heart filled" /> : <FaRegHeart className="heart" />}
          </button>
        </div>
        <div className="restaurant-info">
          <h3>{name}</h3>
          <p className="restaurant-type">{type}</p>
          <p className="restaurant-distance">
            <FaMapMarkerAlt /> {distance}
          </p>
          <div className="rating">
            <FaStar className="star" />
            <span>{rating}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default RestaurantCard; 