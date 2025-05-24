// src/components/RestaurantList.jsx

import React, { useState, useEffect } from 'react';
import RestaurantCard from './RestaurantCard';
import './RestaurantList.css';
import { FaSort, FaFilter } from 'react-icons/fa';
import { mapBusiness } from '../../utils/businessMapper.js';
import AdresFiltrelePopup from "./AdresFiltrelePopup.jsx";
import {
    getAllBusinesses, getActivePromotions, getByTag,
    getBusinessesByOwner, getTopRated, searchBusinesses
} from '../../services/businessService.js';
import {addToFavorites, addToList, getUserListItems, removeFromList} from "../../services/listService.js";
import {getUserFavoritesIdFromStorage, getUserIdFromStorage} from "../../services/userService.js";

/**
 * RestaurantList component to display a list of restaurants
 * Allows restaurants to be displayed in a grid or list view with filtering and sorting
 * 
 * @param {string} title - Section title
 * @param {Object} filters - Filter criteria to apply
 * @param {boolean} useGrid - Whether to display as a grid (true) or list (false)
 */
const RestaurantList = ({ 
  title = "All Restaurants", 
  filters = {}, 
  useGrid = true,
  showSortOptions = true,
  showFilterOptions = true
}) => {
    const [restaurants, setRestaurants] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortOption, setSortOption] = useState('distance');
    const [showSortMenu, setShowSortMenu] = useState(false);
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [activeFilters, setActiveFilters] = useState(filters);
    const currentUserId = getUserIdFromStorage();
    const currentUserFavoriteID = getUserFavoritesIdFromStorage();

            const [addressFilter, setAddressFilter] = useState({
              city: '', district: '', neighborhood: '', street: ''
        });
        const [showAddrPopup, setShowAddrPopup] = useState(false);
    // Fetch restaurants and favorites on component mount

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const all = await getAllBusinesses();            // ✔ veriyi getir
                const mapped = all.map(mapBusiness);             // ✔ normalize et

                // ✅ adres + diğer filtreleri birlikte uygula
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

                setRestaurants(sortRestaurants(filtered, sortOption));

                const favList = await getUserListItems(currentUserId, currentUserFavoriteID);
                setFavorites(favList || []);
            } catch (err) {
                console.error(err);
                setError('Failed to load restaurants.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [activeFilters, addressFilter, sortOption, currentUserId, currentUserFavoriteID]);



    // Handle toggling favorites
    const toggleFavorite = async (id, e) => {
        e.preventDefault();
        e.stopPropagation();


        if (favorites.some(fav => fav.id === id)) {
            await removeFromList(currentUserId, currentUserFavoriteID, id);
            const favList = await getUserListItems(currentUserId, currentUserFavoriteID);
            setFavorites(favList);

        } else {
            await addToFavorites(currentUserId, id);
            const favList = await getUserListItems(currentUserId, currentUserFavoriteID);
            setFavorites(favList);

        }
    };
    
    // Function to sort restaurants based on selected option
    const sortRestaurants = (restaurantList, option) => {
      const restaurantsCopy = [...restaurantList];
      
      switch (option) {
        case 'rating':
          return restaurantsCopy.sort((a, b) => b.rating - a.rating);
        case 'distance':
          // Assuming distance is in format "0.5 miles away"
          return restaurantsCopy.sort((a, b) => {
            const distA = parseFloat(a.distance);
            const distB = parseFloat(b.distance);
            return distA - distB;
          });
        case 'name':
          return restaurantsCopy.sort((a, b) => a.name.localeCompare(b.name));
        case 'promo':
          return restaurantsCopy.sort((a, b) => (b.hasActivePromo ? 1 : 0) - (a.hasActivePromo ? 1 : 0));
        default:
          return restaurantsCopy;
      }
    };
    
    // Toggle sort menu visibility
    const toggleSortMenu = () => {
      setShowSortMenu(!showSortMenu);
      if (showFilterMenu) setShowFilterMenu(false);
    };
    
    // Toggle filter menu visibility
    const toggleFilterMenu = () => {
      setShowFilterMenu(!showFilterMenu);
      if (showSortMenu) setShowSortMenu(false);
    };
    
    // Handle sort option selection
    const handleSortChange = (option) => {
      setSortOption(option);
      setShowSortMenu(false);
    };
    
    // Handle filter changes
    const handleFilterChange = (filterKey, value) => {
      setActiveFilters(prev => ({
        ...prev,
        [filterKey]: value
      }));
    };
    
    // Clear all filters
    const clearFilters = () => {
      setActiveFilters({});
      setShowFilterMenu(false);
    };
    
    // Apply filters
    const applyFilters = () => {
      setShowFilterMenu(false);
    };

    if (loading) {
      return <div className="loading-indicator">Restoranlar yükleniyor...</div>;
    }
    
    if (error) {
      return <div className="error-message">{error}</div>;
    }
    
    if (restaurants.length === 0) {
      return (
        <div className="no-results">
          <h2 className="section-heading">{title}</h2>
          <p>Restoran bulunamadı. Filtrelerinizi değiştirmeyi deneyin.</p>
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
                  {/* ① Adres Filtrele Butonu */}
                  <button
                      className="control-btn"
                      onClick={() => setShowAddrPopup(true)}
                  >
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
                        // ② Seçilen adresi state’e al
                        setAddressFilter({ city, district, neighborhood, street });
                    }}
                />
            )}

            <div className={`restaurant-container ${useGrid ? 'grid-view' : 'list-view'}`}>
                {restaurants.map(restaurant => (
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
