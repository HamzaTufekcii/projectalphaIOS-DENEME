// src/pages/UserListsPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/UserListsPage.css';
import CreateList from '../components/RestaurantDetailComponents/CreateList';  // ← eklendi

// Mock verilerinizi buraya ekleyin:
const MOCK_PUBLIC_LISTS = [
  // …
];
const MOCK_USER_LISTS = [
  // …
];

export default function UserListsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Yeni: “Liste Oluştur” modal kontrolü
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [viewMode, setViewMode] = useState('discover');
  const [userLists, setUserLists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // URL’deki mode parametresine göre güncelle
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const modeFromURL = params.get('mode');
    setViewMode(modeFromURL === 'mine' ? 'mine' : 'discover');
  }, [location.search]);

  // viewMode’a göre mock listesini yükle
  useEffect(() => {
    setIsLoading(true);
    const lists = viewMode === 'discover' ? MOCK_PUBLIC_LISTS : MOCK_USER_LISTS;
    setTimeout(() => {
      setUserLists(lists || []);
      setIsLoading(false);
    }, 300);
  }, [viewMode]);

  const handleSelectView = (mode) => {
    navigate(`/lists?mode=${mode}`);
  };

  return (
      <div className="user-lists-page">
        <div className="user-lists-header">
          <h1>{viewMode === 'discover' ? 'Keşfet' : 'Listelerim'}</h1>

          {/* Kaydırmalı sekme */}
          <div className="tab-options">
            <div className={`tab-background ${viewMode}`} />
            <div
                className={`tab-option ${viewMode === 'discover' ? 'active' : ''}`}
                onClick={() => handleSelectView('discover')}
            >
              KEŞFET
            </div>
            <div
                className={`tab-option ${viewMode === 'mine' ? 'active' : ''}`}
                onClick={() => handleSelectView('mine')}
            >
              LİSTELERİM
            </div>
          </div>

          {/* Yeni “Liste Oluştur” butonu */}
           <button
             className="tab-option create-list-btn"
             onClick={() => setShowCreateModal(true)}
           >
             Liste Oluştur
           </button>
        </div>

        {/* İçerik */}
        {isLoading ? (
            <div className="loading-spinner">Yükleniyor...</div>
        ) : userLists.length > 0 ? (
            <div className="lists-container">
              {userLists.map(list => (
                  <div key={list.id} className="list-card">
                    <div className="list-card-header">
                      <h2>{list.name}</h2>
                      <p>Oluşturan: {list.userName}</p>
                    </div>
                    <div className="list-items">
                      {list.businesses.map(b => (
                          <div key={b.id} className="business-item">
                            <img src={b.imageUrl} alt={b.name} />
                            <div className="business-info">
                              <h3>{b.name}</h3>
                              <p>{b.category} • {b.address}</p>
                              <p>Puan: {b.rating} • {b.priceRange}</p>
                            </div>
                          </div>
                      ))}
                    </div>
                  </div>
              ))}
            </div>
        ) : (
            <div className="empty-lists">Henüz gösterilecek liste yok.</div>
        )}

        {/* CreateList modal */}
        {showCreateModal && (
            <CreateList
                onClose={() => setShowCreateModal(false)}
                onCreated={() => {
                  // Eğer gerçek API’ye bağlanacaksanız listeyi yeniden çek:
                  // fetchLists();
                  setShowCreateModal(false);
                }}
            />
        )}
      </div>
  );
}
