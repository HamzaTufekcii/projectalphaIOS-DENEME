import React, { useState, useRef, useEffect } from 'react';
import { createList } from '../../services/listService';  // listService.js içindeki yeni metodu kullan
import './CreateList.css';

export default function CreateList({ onClose, onCreated }) {
    const [title, setTitle]   = useState('');
    const [saving, setSaving] = useState(false);
    const containerRef = useRef(null);

    // Click-outside ile kapama
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
            await createList({ name: title.trim() });
            onCreated();
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
                <div className="actions">
                    <button onClick={onClose} disabled={saving}>İptal</button>
                    <button onClick={handleCreate} disabled={saving || !title.trim()}>
                        {saving ? 'Oluşturuluyor…' : 'Oluştur'}
                    </button>
                </div>
            </div>
        </div>
    );
}
