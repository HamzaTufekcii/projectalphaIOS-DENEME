import React, { useEffect, useState } from 'react';
import RestaurantCard from '../components/HomePageComponents/RestaurantCard.jsx';
import '../styles/InsideListPage.css';


const InsideListPage = () => {
    const [list, setList] = useState({ name: '', businesses: [] });
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        // API çağrısıyla list ve favorites set
    }, []);

    const toggleFavorite = (id) => {
        // favori ekle/kaldır işlemi
    };

    return (
        <div className="inside-list-page">
            <h2 className="page-title">{list.name}</h2>

            {list.businesses.length > 0 ? (
                <div className="grid-container">
                    {list.businesses.map(rest => (
                        <RestaurantCard
                            key={rest.id}
                            restaurant={rest}
                            favorites={favorites}
                            toggleFavorite={toggleFavorite}
                        />
                    ))}
                </div>
            ) : (
                <div className="empty-container">
                    <p className="empty-message">Henüz işletme eklenmemiş.</p>
                </div>
            )}
        </div>
    );
};

export default InsideListPage;
