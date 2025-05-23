import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CreateList from '../components/RestaurantDetailComponents/CreateList';
import ListBox from '../components/ListBox';
import {
  getUserLists,
  getPublicLists,
  deleteList,
} from '../services/listService';
import {  } from '../services/listService';
import '../styles/UserListsPage.css';
import { getUserIdFromStorage } from '../services/userService';

export default function UserListsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [viewMode, setViewMode]         = useState('discover');
  const [lists, setLists]               = useState([]);
  const [isLoading, setIsLoading]       = useState(false);

  const [showCreateModal, setShowCreateModal]   = useState(false);
  const [confirmListId,   setConfirmListId]     = useState(null);

  // Düzenleme modalı için
  const [showEditModal,   setShowEditModal]     = useState(false);
  const [editingListId,   setEditingListId]     = useState(null);
  const [editingListName, setEditingListName]   = useState('');

  // URL query’den sekmeyi al
  useEffect(() => {
    const mode = new URLSearchParams(location.search).get('mode');
    setViewMode(mode === 'mine' ? 'mine' : 'discover');
  }, [location.search]);

  // Listeleri çek
  const fetchLists = async () => {
    setIsLoading(true);
    try {
      const data =
          viewMode === 'mine'
              ? await getUserLists(getUserIdFromStorage())
              : await getPublicLists();
      setLists(data);
    } catch (err) {
      console.error('Liste çekme hatası:', err);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => { fetchLists(); }, [viewMode]);

  // Liste içi sayfaya yönlendir
  const handleClick = (listId) => {
    navigate(`/lists/${listId}`);
  };

  // Silme onayı aç/kapat
  const onDeleteClick     = (listId) => setConfirmListId(listId);
  const handleCancelDelete = () => setConfirmListId(null);
  const handleConfirmDelete = async () => {
    try {
      await deleteList(confirmListId);
      setLists(prev => prev.filter(l => l.id !== confirmListId));
    } catch (err) {
      console.error('Liste silme hatası:', err);
    } finally {
      setConfirmListId(null);
    }
  };

  return (
      <div className="user-lists-page">
        {/* Başlık & Sekmeler */}
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

        {/* Liste Kartları */}
        {isLoading ? (
            <div className="loading-spinner">Yükleniyor...</div>
        ) : lists.length > 0 ? (
            <div className="lists-container">
              {lists.map(list => (
                  <div className="list-card" key={list.id}>
                    <div
                        className="list-card-content"
                        onClick={() => handleClick(list.id)}
                    >
                      <ListBox list={list} />
                    </div>

                    {viewMode === 'mine' && (
                        <div className="list-card-actions">
                          <button
                              className="edit-list-btn"
                              onClick={() => {
                                setEditingListId(list.id);
                                setEditingListName(list.name);
                                setShowEditModal(true);
                              }}
                              title="Liste adını düzenle"
                          >
                            ✏️
                          </button>
                          <button
                              className="delete-list-btn"
                              onClick={() => onDeleteClick(list.id)}
                              title="Listeyi sil"
                          >
                            🗑️
                          </button>
                        </div>
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
                  <button className="btn confirm" onClick={handleConfirmDelete}>
                    Evet
                  </button>
                  <button className="btn cancel" onClick={handleCancelDelete}>
                    Hayır
                  </button>
                </div>
              </div>
            </div>
        )}

        {/* Oluştur Modal */}
        {showCreateModal && (
            <CreateList
                onClose={() => {
                  setShowCreateModal(false);
                  fetchLists();
                }}
            />
        )}

        {/* Düzenle Modal */}
        {showEditModal && (
            <div className="confirm-overlay">
              <div className="confirm-modal">
                <h3>Liste Adını Düzenle</h3>
                <input
                    className="edit-input"
                    type="text"
                    value={editingListName}
                    onChange={e => setEditingListName(e.target.value)}
                />
                <div className="confirm-buttons">
                  <button
                      className="btn confirm"
                      onClick={async () => {
                        try {
                          await updateListName(
                              getUserIdFromStorage(),
                              editingListId,
                              editingListName
                          );
                          setLists(ls =>
                              ls.map(l =>
                                  l.id === editingListId
                                      ? { ...l, name: editingListName }
                                      : l
                              )
                          );
                        } catch (err) {
                          console.error('Güncelleme hatası', err);
                        } finally {
                          setShowEditModal(false);
                          setEditingListId(null);
                        }
                      }}
                  >
                    Tamam
                  </button>
                  <button
                      className="btn cancel"
                      onClick={() => {
                        setShowEditModal(false);
                        setEditingListId(null);
                      }}
                  >
                    İptal
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}
