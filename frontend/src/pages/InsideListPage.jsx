// src/pages/InsideListPage.jsx
import React, {useEffect, useMemo, useState} from 'react'
import { useParams } from 'react-router-dom'
import ListRestaurantCard from '../components/ListRestaurantCard'
import {getUserLists, getUserListItems, removeFromList, addToList} from '../services/listService'
import { getUserIdFromStorage } from '../services/userService'
import '../styles/InsideListPage.css'
import {getAllBusinesses} from "../services/businessService.js";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {mapBusiness} from "../utils/businessMapper.js";
import { useLocation } from 'react-router-dom';

const InsideListPage = () => {
    const { listId } = useParams()

    const location = useLocation();
    const initialListName = location.state?.listName || 'Liste Detayları';
    const [listName, setListName] = useState(initialListName);
    const [items,    setItems]      = useState([])
    const [error,    setError]      = useState(null)
    const [isEditing, setIsEditing] = useState(false)
    const currentUserId = getUserIdFromStorage();
    const queryClient = useQueryClient();

    // Get all businesses (maybe for mapping or showing more info)
    const { data: rawList = [], isLoading: isBusinessesLoading, error: businessesError } = useQuery({
        queryKey: ['allBusinesses'],
        queryFn: getAllBusinesses,
        staleTime: 5 * 60 * 1000,
        cacheTime: 30 * 60 * 1000,
    });

    // Get user's favorite list items
    const {
        data: list = [],
        isLoading: isItemsLoading,
        error: itemsError
    } = useQuery({
        queryKey: ['custom-list', currentUserId, listId],
        queryFn: () => getUserListItems(currentUserId, listId),
        enabled: !!currentUserId && !!listId,
        staleTime: 2 * 60 * 1000,
    });

    // Mutation for adding/removing favorites
    const listMutation = useMutation({
        mutationFn: ({ action, bizId }) =>
            action === 'remove'
                ? removeFromList(currentUserId, listId, bizId)
                : addToList(currentUserId, listId, bizId),
        onSuccess: () => {
            queryClient.invalidateQueries(['custom-list', currentUserId, listId]);
        },
        onError: (err) => {
            console.error('Listeye ekleme/çıkarma hatası:', err);
            setError('Liste işlemi sırasında bir hata oluştu.');
        }
    });


    // Map businesses if needed (örneğin farklı yapıya çevirmek için)
    const mappedBusinesses = useMemo(() => {
        return rawList.map(mapBusiness);
    }, [rawList]);

    // Combine favorite IDs with full business info (optional, depends on UI)
    // Eğer favorites sadece ID'ler içeriyorsa, burda full bilgileri eşlemek iyi olur
    const listRestaurants = useMemo(() => {
        if (!list || list.length === 0) return [];
        return list.map(fav => {
            const fullBiz = mappedBusinesses.find(b => b.id === fav.id);
            return fullBiz || fav; // Eğer eşleşmezse orijinal favoriyi dön
        });
    }, [list, mappedBusinesses]);
    if (isBusinessesLoading || isItemsLoading) {
        return <div className="loading-spinner">Loading...</div>;
    }
    if (error)   return <div className="error-message">{error}</div>

    return (
        <div className="inside-list-page">
            <div className="header-row">
                <h2 className="page-title">{listName}</h2>
                <button
                    className="edit-toggle-btn"
                    onClick={() => setIsEditing(e => !e)}
                >
                    {isEditing ? 'Tamam' : 'Düzenle'}
                </button>
            </div>

            {listRestaurants.length > 0 ? (
                <div className="items-grid">
                    {listRestaurants.map(business => (
                        <ListRestaurantCard
                            key={business.id}
                            restaurant={business}
                            isEditing={isEditing}
                            onRemove={() => listMutation.mutate({ action: 'remove', bizId: business.id })}
                        />
                    ))}
                </div>
            ) : (
                <div className="empty-container">
                    <p className="empty-message">Bu listeye henüz restoran eklenmemiş.</p>
                </div>
            )}
        </div>
    )
}


export default InsideListPage
