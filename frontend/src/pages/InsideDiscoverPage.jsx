// src/pages/InsideDiscoverPage.jsx
import React, { useState, useCallback } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ListRestaurantCard from '../components/ListRestaurantCard';
import {
    getUserListItems,
    removeFromList
} from '../services/listService';
import { getUserIdFromStorage } from '../services/userService';
import '../styles/InsideListPage.css';

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

    if (isLoading) return <div className="loading-indicator">Yükleniyor…</div>;
    if (isError)   return <div className="error-message">{error.message}</div>;

    return (
        <div className="inside-list-page">
            <div className="header-row">
                <h2 className="page-title">{listName}</h2>
            </div>

            {items.length > 0 ? (
                <div className="items-grid">
                    {items.map(rest => (
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