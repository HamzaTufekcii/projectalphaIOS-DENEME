// src/components/RestaurantDetailComponents/CreateList.jsx
import React, { useState, useRef, useEffect } from 'react';
import { createList } from '../../services/listService';
import './CreateList.css';
import {getUserIdFromStorage} from "../../services/userService.js";

export default function CreateList({ onClose, onCreated }) {
    const [title, setTitle]         = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [saving, setSaving]       = useState(false);
    const containerRef              = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                onClose();
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const handleCreate = async () => {
        if (!title.trim()) return;
        setSaving(true);
        try {
            const newList = await createList(getUserIdFromStorage(),title.trim(),!isPrivate);
            onCreated(newList);
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="create-list-container">
            <div className="create-list-modal" ref={containerRef}>
                <h3>Yeni Liste Oluştur</h3>

                <input
                    type="text"
                    placeholder="Liste adı girin…"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    disabled={saving}
                />

                {/* ← İşte buraya ekle: Gizli / Herkes segment kontrol */}
                <div className="privacy-toggle">
                    <button
                        type="button"
                        className={`privacy-option ${isPrivate ? 'active' : ''}`}
                        onClick={() => setIsPrivate(true)}
                        disabled={saving}
                    >
                        Gizli 🔒
                    </button>
                    <button
                        type="button"
                        className={`privacy-option ${!isPrivate ? 'active' : ''}`}
                        onClick={() => setIsPrivate(false)}
                        disabled={saving}
                    >
                        Herkes 🌐
                    </button>
                </div>

                <div className="actions">
                    <button onClick={onClose} disabled={saving}>İptal</button>
                    <button
                        onClick={handleCreate}
                        disabled={saving || !title.trim()}
                    >
                        {saving ? 'Oluşturuluyor…' : 'Oluştur'}
                    </button>
                </div>
            </div>
        </div>
    );
}

