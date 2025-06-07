import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/FavoritesPage.css';
import { FaExclamationCircle } from 'react-icons/fa';
import { getUserFavoritesIdFromStorage, getUserIdFromStorage } from "../services/userService.js";
import { addToFavorites, getUserListItems, removeFromList } from "../services/listService.js";
import FavoritesRestaurantCard from '../components/FavoritesPageComponents/FavoritesRestaurantCard';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAllBusinesses } from "../services/businessService.js";
import { mapBusiness } from "../utils/businessMapper.js";

const FavoritesPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const currentUserFavoriteID = getUserFavoritesIdFromStorage();
  const currentUserId = getUserIdFromStorage();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [useMockData, setUseMockData] = useState(false);
  const [error, setError] = useState(null);

  // Authentication check
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthenticated(false);
      setError('Bu sayfayı görüntülemek için giriş yapmalısınız.');
    } else {
      setIsAuthenticated(true);
      setError(null);
    }
  }, []);

  // Get all businesses (maybe for mapping or showing more info)
  const { data: rawList = [], isLoading: isBusinessesLoading, error: businessesError } = useQuery({
    queryKey: ['allBusinesses'],
    queryFn: getAllBusinesses,
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    enabled: isAuthenticated
  });

  // Get user's favorite list items
  const {
    data: favorites = [],
    isLoading: isFavoritesLoading,
    error: favoritesError
  } = useQuery({
    queryKey: ['favorites', currentUserId, currentUserFavoriteID],
    queryFn: () => getUserListItems(currentUserId, currentUserFavoriteID),
    enabled: isAuthenticated && !!currentUserId && !!currentUserFavoriteID,
    staleTime: 2 * 60 * 1000,
  });

  // Mutation for adding/removing favorites
  const favMutation = useMutation({
    mutationFn: ({ action, bizId }) =>
        action === 'remove'
            ? removeFromList(currentUserId, currentUserFavoriteID, bizId)
            : addToFavorites(currentUserId, bizId),
    onSuccess: () => {
      queryClient.invalidateQueries(['favorites', currentUserId, currentUserFavoriteID]);
    },
    onError: (err) => {
      console.error('Favori ekleme/çıkarma hatası:', err);
      setError('Favori işlemi sırasında bir hata oluştu.');
    }
  });

  // Toggle favorite handler
  const toggleFavorite = useCallback((id, e) => {
    e.preventDefault();
    e.stopPropagation();
    const isFav = favorites.some(f => f.id === id);
    favMutation.mutate({ action: isFav ? 'remove' : 'add', bizId: id });
  }, [favorites, favMutation]);

  // Map businesses if needed (örneğin farklı yapıya çevirmek için)
  const mappedBusinesses = useMemo(() => {
    return rawList.map(mapBusiness);
  }, [rawList]);

  // Combine favorite IDs with full business info (optional, depends on UI)
  // Eğer favorites sadece ID'ler içeriyorsa, burda full bilgileri eşlemek iyi olur
  const favoriteRestaurants = useMemo(() => {
    if (!favorites || favorites.length === 0) return [];
    return favorites.map(fav => {
      const fullBiz = mappedBusinesses.find(b => b.id === fav.id);
      return fullBiz || fav; // Eğer eşleşmezse orijinal favoriyi dön
    });
  }, [favorites, mappedBusinesses]);

  if (isBusinessesLoading || isFavoritesLoading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
        <div className="not-authenticated">
          <div className="auth-error">
            <FaExclamationCircle className="error-icon" />
            <h2>Giriş Gerekli</h2>
            <p>{error || 'Bu sayfayı görüntülemek için giriş yapmalısınız.'}</p>
            <button className="login-btn" onClick={() => {
              navigate('/');
              setTimeout(() => {
                const homePageInstance = window.homePageInstance;
                if (homePageInstance?.openLoginPopup) homePageInstance.openLoginPopup();
              }, 100);
            }}>Giriş Yap</button>
          </div>
        </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
      <div className="favorites-page">
        <div className="favorites-header">
          <h1>Favorilerim</h1>
          {useMockData && (
              <div className="dev-notice">
                <p>Not: API bağlantısı kurulamadığı için geliştirme amaçlı test verileri görüntüleniyor.</p>
              </div>
          )}
        </div>

        {favoriteRestaurants.length > 0 ? (
            <div className="favorites-grid">
              {favoriteRestaurants.map(business => (
                  <FavoritesRestaurantCard
                      key={business.id}
                      restaurant={business}
                      favorites={favorites}
                      toggleFavorite={toggleFavorite}
                  />
              ))}
            </div>
        ) : (
            <div className="empty-favorites">
              <p>Henüz favori işletmeniz bulunmuyor.</p>
              <button
                  className="browse-button"
                  onClick={() => navigate('/')}
              >
                İşletmelere Göz At
              </button>
            </div>
        )}
      </div>
  );
};

export default FavoritesPage;