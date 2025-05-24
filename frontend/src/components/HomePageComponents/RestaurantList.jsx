// src/components/RestaurantList.jsx
import React, { useState, useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import RestaurantCard from './RestaurantCard';
import './RestaurantList.css';
import { FaSort, FaFilter } from 'react-icons/fa';
import AdresFiltrelePopup from "./AdresFiltrelePopup.jsx";

import {
    getAllBusinesses,
} from '../../services/businessService.js';
import {
    addToFavorites,
    removeFromList,
    getUserListItems
} from "../../services/listService.js";
import {
    getUserFavoritesIdFromStorage,
    getUserIdFromStorage
} from "../../services/userService.js";
import { mapBusiness } from '../../utils/businessMapper.js';

export default function RestaurantList({
                                           title = "All Restaurants",
                                           filters = {},
                                           useGrid = true,
                                           showSortOptions = true,
                                           showFilterOptions = true
                                       }) {
    const queryClient = useQueryClient();
    const currentUserId         = getUserIdFromStorage();
    const currentUserFavoriteID = getUserFavoritesIdFromStorage();

    // ✅ useQuery tek obje formu
    const { data: rawList = [], isLoading, error } = useQuery({
        queryKey: ['allBusinesses'],
        queryFn: getAllBusinesses,
        staleTime: 5 * 60 * 1000,
        cacheTime: 30 * 60 * 1000,
    });

    const { data: favorites = [] } = useQuery({
        queryKey: ['favorites', currentUserId, currentUserFavoriteID],
        queryFn: () => getUserListItems(currentUserId, currentUserFavoriteID),
        enabled: !!currentUserId && !!currentUserFavoriteID,
        staleTime: 2 * 60 * 1000,
    });

    // ✅ useMutation tek obje formu
    const favMutation = useMutation({
        mutationFn: ({ action, bizId }) =>
            action === 'remove'
                ? removeFromList(currentUserId, currentUserFavoriteID, bizId)
                : addToFavorites(currentUserId, bizId),
        onSuccess: () => {
            queryClient.invalidateQueries(['favorites', currentUserId, currentUserFavoriteID]);
        }
    });

    const toggleFavorite = useCallback((id, e) => {
        e.preventDefault(); e.stopPropagation();
        const isFav = favorites.some(f => f.id === id);
        favMutation.mutate({ action: isFav ? 'remove' : 'add', bizId: id });
    }, [favorites, favMutation]);

    // 4️⃣ State’ler
    const [sortOption, setSortOption] = useState('distance');
    const [activeFilters, setActiveFilters] = useState(filters);
    const [addressFilter, setAddressFilter] = useState({
        city: '', district: '', neighborhood: '', street: ''
    });
    const [showSortMenu, setShowSortMenu] = useState(false);
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [showAddrPopup, setShowAddrPopup] = useState(false);

    // 5️⃣ map & filter & sort işlemleri useMemo ile
    const restaurants = useMemo(() => {
        const mapped = rawList.map(mapBusiness);

        const filtered = mapped.filter(r => {
            const a = r.address || {};
            if (addressFilter.city && a.city !== addressFilter.city) return false;
            if (addressFilter.district && a.district !== addressFilter.district) return false;
            if (addressFilter.neighborhood && a.neighborhood !== addressFilter.neighborhood) return false;
            if (addressFilter.street && a.street !== addressFilter.street) return false;
            if (activeFilters.priceRange && r.priceRange !== activeFilters.priceRange) return false;
            if (activeFilters.hasActivePromo !== undefined && r.hasActivePromo !== activeFilters.hasActivePromo) return false;
            return true;
        });

        const sorted = [...filtered].sort((a, b) => {
            switch (sortOption) {
                case 'rating':  return b.rating - a.rating;
                case 'distance':
                    return parseFloat(a.distance) - parseFloat(b.distance);
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'promo':
                    return (b.hasActivePromo ? 1 : 0) - (a.hasActivePromo ? 1 : 0);
                default:
                    return 0;
            }
        });

        return sorted;
    }, [rawList, addressFilter, activeFilters, sortOption]);

    // 6️⃣ UI handlers
    const toggleSortMenu   = () => { setShowSortMenu(y => !y); if(showFilterMenu) setShowFilterMenu(false); };
    const toggleFilterMenu = () => { setShowFilterMenu(y => !y); if(showSortMenu) setShowSortMenu(false); };
    const handleSortChange = opt => { setSortOption(opt); setShowSortMenu(false); };
    const handleFilterChange = (key, val) => setActiveFilters(f => ({ ...f, [key]: val }));
    const clearFilters = () => { setActiveFilters({}); setShowFilterMenu(false); };
    const applyFilters = () => setShowFilterMenu(false);

    // 7️⃣ Render
    if (isLoading) return <div className="loading-indicator">Restoranlar yükleniyor...</div>;
    if (error)     return <div className="error-message">{error.message}</div>;
    if (restaurants.length === 0) {
        return (
            <div className="no-results">
                <h2 className="section-heading">{title}</h2>
                <p>Restoran bulunamadı. Filtrelerinizi değiştirin.</p>
                {Object.keys(activeFilters).length > 0 && (
                    <button className="clear-filters-btn" onClick={clearFilters}>
                        Tüm Filtreleri Temizle
                    </button>
                )}
            </div>
        );
    }

    return (
        <section className="restaurant-section">
            <div className="section-header">
                <h2 className="section-heading">{title}</h2>
                <div className="list-controls">
                    <button className="control-btn" onClick={() => setShowAddrPopup(true)}>
                        📍 Adres Filtrele
                    </button>
                    {showFilterOptions && (
                        <div className="filter-dropdown">
                            <button className="control-btn" onClick={toggleFilterMenu}>
                                <FaFilter /> Filtrele
                            </button>
                            {showFilterMenu && (
                                <div className="dropdown-menu filter-menu">
                                    <div className="filter-group">
                                        <h4>Fiyat Aralığı</h4>
                                        <div className="filter-options">
                                            <button
                                                className={`filter-option ${activeFilters.priceRange === '$' ? 'active' : ''}`}
                                                onClick={() => handleFilterChange('priceRange', '$')}
                                            >
                                                $
                                            </button>
                                            <button
                                                className={`filter-option ${activeFilters.priceRange === '$$' ? 'active' : ''}`}
                                                onClick={() => handleFilterChange('priceRange', '$$')}
                                            >
                                                $$
                                            </button>
                                            <button
                                                className={`filter-option ${activeFilters.priceRange === '$$$' ? 'active' : ''}`}
                                                onClick={() => handleFilterChange('priceRange', '$$$')}
                                            >
                                                $$$
                                            </button>
                                        </div>
                                    </div>

                                    <div className="filter-group">
                                        <h4>Promosyonlar</h4>
                                        <div className="filter-options">
                                            <button
                                                className={`filter-option ${activeFilters.hasActivePromo === true ? 'active' : ''}`}
                                                onClick={() => handleFilterChange('hasActivePromo', true)}
                                            >
                                                Promosyonlu
                                            </button>
                                            <button
                                                className={`filter-option ${activeFilters.hasActivePromo === false ? 'active' : ''}`}
                                                onClick={() => handleFilterChange('hasActivePromo', false)}
                                            >
                                                Promosyonsuz
                                            </button>
                                        </div>
                                    </div>

                                    <div className="filter-actions">
                                        <button className="secondary-btn" onClick={clearFilters}>
                                            Tümünü Temizle
                                        </button>
                                        <button className="primary-btn" onClick={applyFilters}>
                                            Filtrele
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    {showSortOptions && (
                        <div className="sort-dropdown">
                            <button className="control-btn" onClick={toggleSortMenu}>
                                <FaSort /> Sırala
                            </button>
                            {showSortMenu && (
                                <div className="dropdown-menu">
                                    <button
                                        className={`menu-item ${sortOption === 'distance' ? 'active' : ''}`}
                                        onClick={() => handleSortChange('distance')}
                                    >
                                        En Yakın İlk
                                    </button>
                                    <button
                                        className={`menu-item ${sortOption === 'rating' ? 'active' : ''}`}
                                        onClick={() => handleSortChange('rating')}
                                    >
                                        En Yüksek Puan
                                    </button>
                                    <button
                                        className={`menu-item ${sortOption === 'name' ? 'active' : ''}`}
                                        onClick={() => handleSortChange('name')}
                                    >
                                        Alfabetik
                                    </button>
                                    <button
                                        className={`menu-item ${sortOption === 'promo' ? 'active' : ''}`}
                                        onClick={() => handleSortChange('promo')}
                                    >
                                        Promosyonlar İlk
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {showAddrPopup && (
                <AdresFiltrelePopup
                    onClose={() => setShowAddrPopup(false)}
                    onApply={({ city, district, neighborhood, street }) => {
                        setAddressFilter({ city, district, neighborhood, street });
                    }}
                />
            )}

            <div className={`restaurant-container ${useGrid ? 'grid-view' : 'list-view'}`}>
                {restaurants.map(r => (
                    <RestaurantCard
                        key={r.id}
                        restaurant={r}
                        favorites={favorites}
                        toggleFavorite={toggleFavorite}
                    />
                ))}
            </div>
        </section>
    );
}
