import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/UserListsPage.css';
import CreateList from '../components/RestaurantDetailComponents/CreateList';
import ListBox from '../components/ListBox';
import { getUserLists, getPublicLists } from '../services/listService';

export default function UserListsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState('discover');
  const [lists, setLists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // URL parametresinden sekme durumunu al
  useEffect(() => {
    const mode = new URLSearchParams(location.search).get('mode');
    setViewMode(mode === 'mine' ? 'mine' : 'discover');
  }, [location.search]);

  // Servisten listeleri çek
  const fetchLists = async () => {
    setIsLoading(true);
    try {
      const data = viewMode === 'mine'
          ? await getUserLists()
          : await getPublicLists();
      setLists(data);
    } catch (err) {
      console.error('Liste çekme hatası:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // viewMode her değiştiğinde veya component mount olduğunda çalış
  useEffect(() => {
    fetchLists();
  }, [viewMode]);

  // sekme seçimi
  const handleSelectView = (mode) => {
    navigate(`/lists?mode=${mode}`);
  };

  // liste kutusuna tıklayınca ilgili iç sayfaya yönlendir
  const handleClick = (listId) => {
    navigate(`/lists/${listId}`);
  };

  return (
      <div className="user-lists-page">
        <div className="user-lists-header">
          <h1>{viewMode === 'discover' ? 'Keşfet' : 'Listelerim'}</h1>
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
          {viewMode === 'mine' && (
              <button
                  className="create-list-btn"
                  onClick={() => setShowCreateModal(true)}
              >
                Liste Oluştur
              </button>
          )}
        </div>

        {isLoading ? (
            <div className="loading-spinner">Yükleniyor...</div>
        ) : lists.length > 0 ? (
            <div className="lists-container">
              {lists.map((list) => (
                  <ListBox
                      key={list.id}
                      list={list}
                      onClick={handleClick}
                  />
              ))}
            </div>
        ) : (
            <div className="empty-lists">
              {viewMode === 'discover'
                  ? 'Keşfet bölümü henüz hazır değil.'
                  : 'Henüz gösterilecek liste yok.'}
            </div>
        )}

        {showCreateModal && (
            <CreateList
                onClose={() => setShowCreateModal(false)}
                onCreated={async () => {
                  await fetchLists();
                  setShowCreateModal(false);
                }}
            />
        )}
      </div>
  );
}
