// src/components/RestaurantDetailComponents/SaveToLists.jsx
import React, {useState, useEffect} from 'react';
import {
    getUserListItems,
    getUserLists,
    addToList,
    removeFromList,
    addToFavorites
} from '../../services/listService';
import './SaveToLists.css';
import {getUserFavoritesIdFromStorage, getUserIdFromStorage} from "../../services/userService.js";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

export default function SaveToLists({ itemId, onClose }) {
    const [lists, setLists]       = useState([]);
    const [selected, setSelected] = useState(new Set());
    const [loading, setLoading]   = useState(true);
    const [saving, setSaving]     = useState(false);
    const currentUserId = getUserIdFromStorage();
    const queryClient = useQueryClient();
    const currentUserFavoriteID = getUserFavoritesIdFromStorage();
    useEffect(() => {
        let mounted = true;
        const userId = getUserIdFromStorage();

        getUserLists(userId)
            .then(async (fetched) => {
                if (!mounted) return;

                const sorted = [
                    ...fetched.filter(l => l.name === 'Favorilerim'),
                    ...fetched.filter(l => l.name !== 'Favorilerim')
                ];

                // containsItem bilgisini ekle
                const listsWithContains = await Promise.all(sorted.map(async (list) => {
                    const items = await getUserListItems(userId, list.id);
                    return {
                        ...list,
                        containsItem: items.some(i => i.id === itemId)
                    };
                }));

                setLists(listsWithContains);

                // item'ın olduğu listeleri seçili yap
                const pre = new Set(
                    listsWithContains
                        .filter(l => l.containsItem)
                        .map(l => l.id)
                );

                setSelected(pre);
            })
            .catch(err => {
                console.error('Error fetching lists or items:', err);
            })
            .finally(() => mounted && setLoading(false));

        return () => {
            mounted = false;
        };
    }, [itemId]);

    const toggleList = id => {
        const next = new Set(selected);
        next.has(id) ? next.delete(id) : next.add(id);
        setSelected(next);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            for (const l of lists) {
                const listId = l.id;
                const nowIn = selected.has(listId);
                const initiallyIn = l.containsItem;

                if (l.name === 'Favorilerim') {
                    if (!initiallyIn && nowIn) await favMutation.mutateAsync({ action: 'add', bizId: itemId });
                    else if (initiallyIn && !nowIn) await favMutation.mutateAsync({ action: 'remove', bizId: itemId });
                } else {
                    if (!initiallyIn && nowIn) await addToList(getUserIdFromStorage(), listId, itemId);
                    else if (initiallyIn && !nowIn) await removeFromList(getUserIdFromStorage(), listId, itemId);
                }
            }
            onClose(selected.size > 0);
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };
    const {
        data: favorites = [],
    } = useQuery({
        queryKey: ['favorites', currentUserId, currentUserFavoriteID],
        queryFn: () => getUserListItems(currentUserId, currentUserFavoriteID),
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
        }
    });

    if (loading) {
        return (
            <div className="save-to-lists-container" onClick={onClose}>
                <div className="save-to-lists-modal" onClick={e => e.stopPropagation()}>
                    Yükleniyor…
                </div>
            </div>
        );
    }

    return (
        <div className="save-to-lists-container" onClick={onClose}>
            <div className="save-to-lists-modal" onClick={e => e.stopPropagation()}>
                <h3>Listelerine ekle</h3>
                <ul className="list-options">
                    {lists.map(l => (
                        <li key={l.id}>
                            <label className="list-option">
                                <input
                                    type="checkbox"
                                    checked={selected.has(l.id)}
                                    onChange={() => toggleList(l.id)}
                                />
                                <span className="list-name">{l.name}</span>
                            </label>
                        </li>
                    ))}
                </ul>
                <div className="actions">
                    <button
                        onClick={() => onClose(selected.size > 0)}
                        disabled={saving}
                    >
                        İptal
                    </button>
                    <button onClick={handleSave} disabled={saving}>
                        Kaydet
                    </button>
                </div>
            </div>
        </div>
    );
}