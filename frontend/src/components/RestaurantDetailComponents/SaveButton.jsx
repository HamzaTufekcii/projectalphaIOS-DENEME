// src/components/RestaurantDetailComponents/SaveButton.jsx
import React from 'react';
import { FaPlus, FaCheck } from 'react-icons/fa';   // ← İKONLAR BURADA
import './SaveButton.css';
import {getUserFavoritesIdFromStorage, getUserIdFromStorage} from "../../services/userService.js";
import {useQueryClient, useMutation} from "@tanstack/react-query";
import {addToFavorites, removeFromList} from "../../services/listService.js";



export default function SaveButton({ itemId, isSaved, onToggle, onCustomize }) {
    const currentUserId = getUserIdFromStorage();
    const queryClient = useQueryClient();
    const currentUserFavoriteID = getUserFavoritesIdFromStorage();



    const handleClick = async e => {
        e.stopPropagation();
        if (!isSaved) {
            // önce parent state’i güncelle
            onToggle(true);
            // sonra API çağrısı
            try { await favMutation.mutateAsync({ action: 'add', bizId: itemId }); }
            catch { onToggle(false); }
        } else {
            onCustomize();
        }
    };// Mutation for adding/removing favorites
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
        }
    });

    return (
        <button
            className={`save-button${isSaved ? ' saved' : ''}`}
            onClick={handleClick}
            aria-label={isSaved ? 'Kaydedildi' : 'Kaydet'}
        >
            {isSaved
                  ? <span className="icon">✔</span>
                      : <span className="icon">✚</span>   /* U+271A Heavy Greek Cross */
                    }
        </button>
    );
}
