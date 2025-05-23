// src/components/RestaurantDetailComponents/SaveButton.jsx
import React from 'react';
import { FaPlus, FaCheck } from 'react-icons/fa';   // ← İKONLAR BURADA
import { addToList } from '../../services/listService';
import './SaveButton.css';


export default function SaveButton({ itemId, isSaved, onToggle, onCustomize }) {
    const handleClick = async e => {
        e.stopPropagation();
        if (!isSaved) {
            // önce parent state’i güncelle
            onToggle(true);
            // sonra API çağrısı
            try { await addToList(itemId, true); }
            catch { onToggle(false); }
        } else {
            onCustomize();
        }
    };

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
