// src/components/RestaurantList.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaHeart, FaRegHeart } from 'react-icons/fa';
import './RestaurantList.css'

const RestaurantList = ({ title = "All Restaurants" }) => {
    // Sabit restoran verisi bu component içinde
    const [favorites, setFavorites] = useState([4]);

    const restaurants = [
        {
            id: 3,
            name: "Naya",
            type: "Fine Dining",
            distance: "0.3 miles away",
            rating: 4.7,
            image: "https://profitnesetgune.com/wp-content/uploads/2023/06/1-6-scaled.jpg"
        },
        {
            id: 4,
            name: "The Soul",
            type: "Pub",
            distance: "0.7 miles away",
            rating: 4.6,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_d-yhdv2ZkhWp-sj5d2DLDZ76nOk7RAdGNQ&s"
        },
        {
            id: 5,
            name: "Olive Garden",
            type: "Italian",
            distance: "1.0 miles away",
            rating: 4.3,
            image: "https://parade.com/.image/t_share/MjEzNzg3ODkwNjU4ODQ2MTU5/olive-garden-exterior.jpg"
        },
        {
            id: 6,
            name: "Spice Route",
            type: "Indian",
            distance: "0.8 miles away",
            rating: 4.4,
            image: "https://social.massimodutti.com/paper/wp-content/uploads/2020/09/The-Spice-Route-2.jpg"
        }
    ];

    const toggleFavorite = (id, e) => {
        e.preventDefault();
        e.stopPropagation();

        if (favorites.includes(id)) {
            setFavorites(favorites.filter(fav => fav !== id));
        } else {
            setFavorites([...favorites, id]);
        }
    };

    return (
        <section className="all-restaurants-section">
            <h2 className="section-heading">{title}</h2>

            <div className="restaurant-list">
                {restaurants.map(restaurant => (
                    <Link to={`/restaurant/${restaurant.id}`} className="restaurant-item" key={restaurant.id}>
                        <div className="restaurant-item-img">
                            <img src={restaurant.image} alt={restaurant.name} className="restaurant-img" />
                        </div>

                        <div className="restaurant-item-left">
                            <h3 className="restaurant-title">{restaurant.name}</h3>
                            <div className="restaurant-meta">
                                <p className="restaurant-category">{restaurant.type}</p>
                                <div className="restaurant-location">
                                    <span className="bullet">•</span>
                                    <span>{restaurant.distance}</span>
                                </div>
                            </div>
                        </div>

                        <div className="restaurant-item-right">
                            <div className="rating-display">
                                <FaStar className="star-icon" />
                                <span className="rating-number">{restaurant.rating}</span>
                            </div>
                            <button className="favorite-small-btn" onClick={(e) => toggleFavorite(restaurant.id, e)}>
                                {favorites.includes(restaurant.id) ? (
                                    <FaHeart className="heart-small favorited" />
                                ) : (
                                    <FaRegHeart className="heart-small" />
                                )}
                            </button>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default RestaurantList;
