// src/pages/InsideDiscoverPage.jsx
import React, {useState, useCallback, useMemo} from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ListRestaurantCard from '../components/ListRestaurantCard';
import {
    getUserListItems,
    removeFromList
} from '../services/listService';
import { getUserIdFromStorage } from '../services/userService';
import '../styles/InsideListPage.css';
import {getAllBusinesses} from "../services/businessService.js";
import {mapBusiness} from "../utils/businessMapper.js";

export default function InsideDiscoverPage() {
    const { listId } = useParams();
    const userId     = getUserIdFromStorage();
    const { state }  = useLocation();
    const queryClient = useQueryClient();

    // 1️⃣ Liste öğelerini çek
    const {
        data: items = [],
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey: ['listItems', userId, listId],
        queryFn: () => getUserListItems(userId, listId),
        enabled: !!userId && !!listId,
        staleTime: 5 * 60 * 1000,
    });
    const { data: rawList = [], isLoading: isBusinessesLoading, error: businessesError } = useQuery({
        queryKey: ['allBusinesses'],
        queryFn: getAllBusinesses,
        staleTime: 5 * 60 * 1000,
        cacheTime: 30 * 60 * 1000,
    });
    const mappedBusinesses = useMemo(() => {
        return rawList.map(mapBusiness);
    }, [rawList]);

    // Combine favorite IDs with full business info (optional, depends on UI)
    // Eğer favorites sadece ID'ler içeriyorsa, burda full bilgileri eşlemek iyi olur
    const listRestaurants = useMemo(() => {
        if (!items || items.length === 0) return [];
        return items.map(fav => {
            const fullBiz = mappedBusinesses.find(b => b.id === fav.id);
            return fullBiz || fav; // Eğer eşleşmezse orijinal favoriyi dön
        });
    }, [items, mappedBusinesses]);

    // 2️⃣ Silme işlemi için mutation
    const removeMutation = useMutation({
        mutationFn: (restaurantId) => removeFromList(userId, listId, restaurantId),
        onSuccess: () => {
            queryClient.invalidateQueries(['listItems', userId, listId]);
        }
    });

    const handleRemove = useCallback((restaurantId) => {
        removeMutation.mutate(restaurantId);
    }, [removeMutation]);

    const listName = state?.listName || 'Liste Detayları';

    if (isLoading || isBusinessesLoading) return <div className="loading-indicator">Yükleniyor…</div>;
    if (isError)   return <div className="error-message">{error.message}</div>;

    return (
        <div className="inside-list-page">
            <div className="header-row">
                <h2 className="page-title">{listName}</h2>
            </div>

            {listRestaurants.length > 0 ? (
                <div className="items-grid">
                    {listRestaurants.map(rest => (
                        <ListRestaurantCard
                            key={rest.id}
                            restaurant={rest}
                            isEditing={false}
                            onRemove={() => handleRemove(rest.id)}
                        />
                    ))}
                </div>
            ) : (
                <div className="empty-container">
                    <p className="empty-message">Bu listeye henüz restoran eklenmemiş.</p>
                </div>
            )}
        </div>
    );
}