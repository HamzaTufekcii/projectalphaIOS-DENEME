import React from 'react';
import RestaurantCard from '../components/HomePageComponents/RestaurantCard';
import './ListRestaurantCard.css';

function ListRestaurantCard({
                                restaurant,
                                isEditing = false,
                                onRemove = () => {}
                            }) {
    return (
        <div className="list-restaurant-card">
            {isEditing && (
                <button
                    className="remove-btn"
                    onClick={e => { e.stopPropagation(); onRemove(); }}
                    aria-label="Restoranı kaldır"
                >
                    &minus;
                </button>
            )}
            <RestaurantCard
                restaurant={restaurant}
                favorites={[]}          // list görünümünde favori butonu yok
                toggleFavorite={() => {}}
            />
        </div>
    );
}
export default React.memo(ListRestaurantCard);