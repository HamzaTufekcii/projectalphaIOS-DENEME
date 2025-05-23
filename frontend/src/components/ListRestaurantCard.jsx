// src/components/ListRestaurantCard.jsx
import React from 'react'
import RestaurantCard from '../components/HomePageComponents/RestaurantCard'
import './ListRestaurantCard.css'   // (1)

export default function ListRestaurantCard({
                                               restaurant,
                                               isEditing = false,              // (2)
                                               onRemove = () => {}             // (3)
                                           }) {
    return (
        <div className="list-restaurant-card">
            {isEditing && (
                <button
                    className="remove-btn"
                    onClick={e => { e.stopPropagation(); onRemove() }}
                    aria-label="Restoranı kaldır"
                >
                    &minus;
                </button>
            )}
            <RestaurantCard
                restaurant={restaurant}
                favorites={[]}
                toggleFavorite={() => {}}
            />
        </div>
    )
}
