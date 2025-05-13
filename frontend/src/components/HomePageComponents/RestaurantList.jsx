// src/components/RestaurantList.jsx

import React, { useState } from 'react';
import RestaurantCard from './RestaurantCard';
import './RestaurantList.css';

/**
 * RestaurantList component to display a list of restaurants
 * Allows restaurants to be displayed in a grid or list view
 * 
 * @param {string} title - Section title
 * @param {Array} restaurants - Array of restaurant objects to display
 * @param {boolean} useGrid - Whether to display as a grid (true) or list (false)
 */
const RestaurantList = ({ title = "All Restaurants", restaurants = [], useGrid = false }) => {
    // State for favorite restaurants
    const [favorites, setFavorites] = useState([4]);
    
    // Default restaurants if none are provided
    const defaultRestaurants = [
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

    // Use provided restaurants or default ones
    const restaurantsToShow = restaurants.length > 0 ? restaurants : defaultRestaurants;

    // Handle toggling favorites
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
        <section className="restaurant-section">
            <h2 className="section-heading">{title}</h2>

            <div className={`restaurant-container ${useGrid ? 'grid-view' : 'list-view'}`}>
                {restaurantsToShow.map(restaurant => (
                    <RestaurantCard 
                        key={restaurant.id}
                        restaurant={restaurant}
                        favorites={favorites}
                        toggleFavorite={toggleFavorite}
                    />
                ))}
            </div>
        </section>
    );
};

export default RestaurantList;
