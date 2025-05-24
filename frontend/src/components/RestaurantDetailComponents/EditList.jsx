// src/components/EditList.jsx
import React, { useState, useRef, useEffect } from 'react';
import { updateList } from '../../services/listService';        // listeservice.js’den :contentReference[oaicite:0]{index=0}
import { getUserIdFromStorage } from '../../services/userService'; // userservice.js’den :contentReference[oaicite:1]{index=1}
import './EditList.css';

export default function EditList({ list, onClose, onUpdated }) {
    // 1) Başlangıçta prop’tan gelen değerlere göre state’i set et
    const [title, setTitle]         = useState(list.name);
    const [isPublic, setIsPublic]   = useState(list.is_public);
    const [saving, setSaving]       = useState(false);
    const containerRef              = useRef(null);

    // 2) list prop’u değiştiğinde formu ve toggle’ı resetle
    useEffect(() => {
        setTitle(list.name);
        setIsPublic(list.is_public);
    }, [list.id, list.name, list.is_public]);

    // 3) Dışarı tıklayınca modal’ı kapat
    useEffect(() => {
        function handleClickOutside(e) {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                onClose();
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    // 4) Kaydetme: API’ye name ve is_public değerini yolla
    const handleSave = async () => {
        if (!title.trim()) return;
        setSaving(true);
        try {
            const updated = await updateList(
                getUserIdFromStorage(),
                title.trim(),
                isPublic,
                list.id
            );
            onUpdated(updated);  // parent’ı güncelle, böylece prop değişir
        } catch (err) {
            console.error('Güncelleme hatası', err);
        } finally {
            setSaving(false);
            onClose();
        }
    };

    return (
        <div role="dialog" aria-modal="true" className="edit-list-container">
            <div className="edit-list-modal" ref={containerRef}>
                <h3>Listeyi Düzenle</h3>

                <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Liste adı girin…"
                    disabled={saving}
                />

                <div className="privacy-toggle">
                    <button
                        type="button"
                        className={`privacy-option ${!isPublic ? 'active' : ''}`}
                        onClick={() => setIsPublic(false)}
                        disabled={saving}
                    >
                        Gizli 🔒
                    </button>
                    <button
                        type="button"
                        className={`privacy-option ${isPublic ? 'active' : ''}`}
                        onClick={() => setIsPublic(true)}
                        disabled={saving}
                    >
                        Herkes 🌐
                    </button>
                </div>

                <div className="actions">
                    <button onClick={onClose} disabled={saving}>İptal</button>
                    <button onClick={handleSave} disabled={saving || !title.trim()}>
                        {saving ? 'Kaydediliyor…' : 'Kaydet'}
                    </button>
                </div>
            </div>
        </div>
    );
}
