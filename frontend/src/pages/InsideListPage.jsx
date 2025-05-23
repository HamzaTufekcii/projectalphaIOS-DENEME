import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/InsideListPage.css';
import { getUserListItems } from '../services/listService.js';
import { getUserIdFromStorage } from '../services/userService.js';

const InsideListPage = () => {
    const { listId } = useParams();
    const userId = getUserIdFromStorage();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                setLoading(true);
                const data = await getUserListItems(userId, listId);
                setItems(data);
            } catch (err) {
                console.error('Liste öğeleri alınırken hata oluştu:', err);
                setError('Liste öğeleri yüklenemedi.');
            } finally {
                setLoading(false);
            }
        };
        fetchItems();
    }, [userId, listId]);

    if (loading) return <div className="loading-indicator">Yükleniyor...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="inside-list-page">
            <h2 className="page-title">Liste Detayları</h2>
            {items.length > 0 ? (
                <div className="items-grid">
                    {items.map(item => (
                        <div key={item.id} className="item-card">
                            <h3 className="item-name">{item.name}</h3>
                            {item.description && <p className="item-desc">{item.description}</p>}
                            {item.address && <p className="item-address"><strong>Adres:</strong> {item.address}</p>}
                            <p className="item-created"><small>Oluşturma Tarihi: {new Date(item.created_at).toLocaleDateString()}</small></p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-container">
                    <p className="empty-message">Henüz öğe eklenmemiş.</p>
                </div>
            )}
        </div>
    );
};

export default InsideListPage;