/* src/components/EditList.jsx */
import React, { useState, useRef, useEffect } from 'react';
import { updateList } from '../../services/listService';
import './EditList.css';
import {getUserIdFromStorage} from "../../services/userService.js";

export default function EditList({ list, onClose, onUpdated }) {
    const [title, setTitle] = useState(list.name);
    const [isPrivate, setIsPrivate] = useState(list.isPrivate);
    const [saving, setSaving] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                onClose();
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const handleSave = async () => {
        if (!title.trim()) return;
        setSaving(true);
        try {
            const updated = await updateList(getUserIdFromStorage(), title.trim(), !isPrivate, list.id, );
            onUpdated(updated);
        } catch (err) {
            console.error('Güncelleme hatası', err);
        } finally {
            setSaving(false);
            onClose();
        }
    };

    return (
        <div
            role="dialog" aria-modal="true"
            className="edit-list-container">
            <div className="edit-list-modal" ref={containerRef}>
                <h3>Listeyi Düzenle</h3>
                <input
                    placeholder="Liste adı girin…"
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    disabled={saving}
                />

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
                        onClick={handleSave}
                        disabled={saving || !title.trim()}
                    >
                        {saving ? 'Kaydediliyor…' : 'Kaydet'}
                    </button>
                </div>
            </div>
        </div>
    );
}