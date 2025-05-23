// src/components/RestaurantDetailComponents/SaveToLists.jsx
console.log("SaveToLists geldi")
import React, { useState, useEffect } from 'react';
import { } from '../../services/listService';
import {
    getUserLists,
    addToList,
    removeFromList
} from '../../services/listService';
import './SaveToLists.css';
import {getUserIdFromStorage} from "../../services/userService.js";

export default function SaveToLists({ itemId, onClose }) {
    const [lists, setLists]       = useState([]);
    const [selected, setSelected] = useState(new Set());
    const [loading, setLoading]   = useState(true);
    const [saving, setSaving]     = useState(false);

    useEffect(() => {
        let mounted = true;
        getUserLists(getUserIdFromStorage())
            .then(fetched => {
                if (!mounted) return;
                // En başa Favoriler’i ekle
                const favList = {
                    id: 'favorites',
                    name: 'Favorilerim',
                    containsItem: true
                };
                const allLists = [favList, ...fetched];
                setLists(allLists);
                // Başlangıçta Favoriler + diğerleri
                const pre = new Set(
                    allLists
                        .filter(l => l.id === 'favorites' || l.containsItem)
                        .map(l => l.id)
                );
                setSelected(pre);
            })
            .catch(console.error)
            .finally(() => mounted && setLoading(false));
        return () => { mounted = false; };
    }, []);

    const toggleList = id => {
        const next = new Set(selected);
        next.has(id) ? next.delete(id) : next.add(id);
        setSelected(next);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            for (const l of lists) {
                const wasIn = l.containsItem;
                const nowIn = selected.has(l.id);

                if (l.id === 'favorites') {
                    // Favoriler için toggleFavorite çağrısı
                    if (!wasIn && nowIn)      await toggleFavorite(itemId, true);
                    else if (wasIn && !nowIn) await toggleFavorite(itemId, false);
                } else {
                    // Diğer custom listeler
                    if (!wasIn && nowIn)      await addToList(itemId, l.id);
                    else if (wasIn && !nowIn) await removeFromList(itemId, l.id);
                }
            }
            onClose(selected.size > 0);
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

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
                            <label>
                                <input
                                    type="checkbox"
                                    checked={selected.has(l.id)}
                                    onChange={() => toggleList(l.id)}
                                />
                                {l.name}
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
