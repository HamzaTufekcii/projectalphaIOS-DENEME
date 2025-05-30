// src/pages/UserListsPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CreateList from '../components/RestaurantDetailComponents/CreateList';
import EditList from '../components/RestaurantDetailComponents/EditList';
import ListBox from '../components/ListBox';
import { Star, Edit, Trash2 } from 'lucide-react';
import {
  getUserLists,
  getPublicLists,
  removeList,
} from '../services/listService';
import '../styles/UserListsPage.css';
import { getUserIdFromStorage } from '../services/userService';

export default function UserListsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [viewMode, setViewMode]     = useState('mine');
  const [lists, setLists]           = useState([]);
  const [isLoading, setIsLoading]   = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [confirmListId, setConfirmListId]     = useState(null);

  // Düzenleme için tek obje state’i
  const [editingList, setEditingList] = useState(null);



  // URL query’den sekmeyi al
  useEffect(() => {
    const mode = new URLSearchParams(location.search).get('mode');
    if(mode !== 'mine' && mode !== 'discover'){
      setViewMode('mine');
    }
    setViewMode(mode === 'mine' ? 'mine' : 'discover');
  }, [location.search]);


  // Listeleri çek
  const fetchLists = async () => {
    setIsLoading(true);
    try {
      const data =
          viewMode === 'mine'
              ? await getCustomListsbyUser()
              : await getPublicLists();
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
  const getCustomListsbyUser = async () =>{
    const lists =  await getUserLists(getUserIdFromStorage());
    return lists.filter(list => list.name.toLowerCase() !== 'favorilerim'); //favorilerimi gösterme bu sayfada
  }

  // Liste içi sayfaya yönlendir
  const handleClick = (listId,listName) => {
    if(viewMode === 'discover')
      return navigate(`/lists/discover/${listId}`, {
        state: { listName: listName }
      });
    if(viewMode === 'mine')
      return navigate(`/lists/${listId}`);
  };

  // Silme onayı aç/kapat
  const onDeleteClick = listId => setConfirmListId(listId);
  const handleCancelDelete = () => setConfirmListId(null);
  const handleConfirmDelete = async () => {
    try {
      await removeList(getUserIdFromStorage(),confirmListId);
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
                        onClick={() => handleClick(list.id,list.name)}
                    >
                      <ListBox list={list} />
                    </div>

                    {viewMode === 'mine' && (
                        <div className="list-card-actions">
                          <button
                              className="edit-list-btn"
                              onClick={() => setEditingList(list)}
                              title="Listeyi düzenle"
                          >
                            <Edit size={20} />
                          </button>
                          <button
                              className="delete-list-btn"
                              onClick={() => onDeleteClick(list.id)}
                              title="Listeyi sil"
                          >
                            <Trash2 size={20} />
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

        {/* Düzenle Modal yerine EditList bileşeni */}
        {editingList && (
            <EditList
                list={editingList}
                onClose={() => setEditingList(null)}
                onUpdated={updatedList => {
                  setLists(prev =>
                      prev.map(l => (l.id === updatedList.id ? updatedList : l))
                  );
                }}
            />

        )}
      </div>
  );
}
