// src/pages/UserListsPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CreateList from '../components/RestaurantDetailComponents/CreateList';
import ListBox from '../components/ListBox';
import { getUserLists, getPublicLists, deleteList } from '../services/listService';
import '../styles/UserListsPage.css';

export default function UserListsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState('discover');
  const [lists, setLists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [confirmListId, setConfirmListId] = useState(null);

  // Sekme durumunu URL query’den al
  useEffect(() => {
    const mode = new URLSearchParams(location.search).get('mode');
    setViewMode(mode === 'mine' ? 'mine' : 'discover');
  }, [location.search]);

  // Listeleri mock servisten çek
  const fetchLists = async () => {
    setIsLoading(true);
    try {
      const data =
          viewMode === 'mine' ? await getUserLists() : await getPublicLists();
      setLists(data);
    } catch (err) {
      console.error('Liste çekme hatası:', err);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchLists();
  }, [viewMode]);

  // Liste kartına tıklayınca iç sayfaya git
  const handleClick = (listId) => {
    navigate(`/lists/${listId}`);
  };

  // Silme butonuna tıklanınca onay modal’ını aç
  const onDeleteClick = (listId) => {
    setConfirmListId(listId);
  };

  // Modal’da “Evet”e tıklayınca listeyi sil
  const handleConfirmDelete = async () => {
    try {
      await deleteList(confirmListId);
      setLists((prev) => prev.filter((l) => l.id !== confirmListId));
    } catch (err) {
      console.error('Liste silme hatası:', err);
    } finally {
      setConfirmListId(null);
    }
  };

  // Modal’da “Hayır”a tıklayınca iptal et
  const handleCancelDelete = () => {
    setConfirmListId(null);
  };

  return (
      <div className="user-lists-page">
        {/* Header & Tabs */}
        <div className="user-lists-header">
          <h1>{viewMode === 'discover' ? 'Keşfet' : 'Listelerim'}</h1>
          <div className="tab-options">
            <div className={`tab-background ${viewMode}`} />
            <div
                className={`tab-option ${viewMode === 'discover' ? 'active' : ''}`}
                onClick={() => navigate('/lists?mode=discover')}
            >
              KEŞFET
            </div>
            <div
                className={`tab-option ${viewMode === 'mine' ? 'active' : ''}`}
                onClick={() => navigate('/lists?mode=mine')}
            >
              LİSTELERİM
            </div>
          </div>
          {viewMode === 'mine' && (
              <button
                  className="create-list-btn"
                  onClick={() => setShowCreateModal(true)}
              >
                Liste Oluştur
              </button>
          )}
        </div>

        {/* Liste kartları veya yükleniyor / boş */}
        {isLoading ? (
            <div className="loading-spinner">Yükleniyor...</div>
        ) : lists.length > 0 ? (
            <div className="lists-container">
              {lists.map((list) => (
                  <div className="list-card" key={list.id}>
                    {/* ListBox tüm içeriği kaplasın */}
                    <div
                        className="list-card-content"
                        onClick={() => handleClick(list.id)}
                    >
                      <ListBox list={list} />
                    </div>
                    {/* Çöp kutusu butonu */}
                    {viewMode === 'mine' && (
                        <button
                            className="delete-list-btn"
                            onClick={() => onDeleteClick(list.id)}
                            title="Listeyi sil"
                        >
                          🗑️
                        </button>
                    )}
                  </div>
              ))}
            </div>
        ) : (
            <div className="empty-lists">
              {viewMode === 'discover'
                  ? 'Keşfet bölümü henüz hazır değil.'
                  : 'Henüz gösterilecek liste yok.'}
            </div>
        )}

        {/* Silme Onay Modal */}
        {confirmListId && (
            <div className="confirm-overlay">
              <div className="confirm-modal">
                <p>Silmek istediğinize emin misiniz?</p>
                <div className="confirm-buttons">
                  <button
                      className="btn confirm"
                      onClick={handleConfirmDelete}
                  >
                    Evet
                  </button>
                  <button
                      className="btn cancel"
                      onClick={handleCancelDelete}
                  >
                    Hayır
                  </button>
                </div>
              </div>
            </div>
        )}

        {/* Liste Oluştur Modal */}
        {showCreateModal && (
            <CreateList
                onClose={() => {
                  setShowCreateModal(false);
                  fetchLists();
                }}
            />
        )}
      </div>
  );
}
