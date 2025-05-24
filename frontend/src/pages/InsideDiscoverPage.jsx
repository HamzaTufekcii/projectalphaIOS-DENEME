// src/pages/InsideDiscoverPage.jsx
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useLocation } from 'react-router-dom';
import ListRestaurantCard from '../components/ListRestaurantCard'
import { getUserLists, getUserListItems, removeFromList } from '../services/listService'
import { getUserIdFromStorage } from '../services/userService'
import '../styles/InsideListPage.css'

const InsideDiscoverPage = () => {
    const { listId } = useParams()
    const userId     = getUserIdFromStorage()
    const location = useLocation()

    const [listName, setListName]   = useState('Liste Detayları')
    const [items,    setItems]      = useState([])
    const [loading,  setLoading]    = useState(true)
    const [error,    setError]      = useState(null)
    const [isEditing, setIsEditing] = useState(false)

    useEffect(() => {
        if (!userId || !listId) return
        const fetchData = async () => {
            try {
                setLoading(true)
                setListName(location.state?.listName)

                const listItems = await getUserListItems(userId, listId)
                setItems(listItems)
            } catch (err) {
                setError('Liste yüklenemedi.')
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [userId, listId])

    // Restorantı listeden silme fonksiyonu
    const handleRemove = async (restaurantId) => {
        try {
            await removeFromList(userId, listId, restaurantId)   // kendi API’nı yaz
            setItems(items.filter(r => r.id !== restaurantId))
        } catch (err) {
            console.error('Silme hatası', err)
        }
    }

    if (loading) return <div className="loading-indicator">Yükleniyor...</div>
    if (error)   return <div className="error-message">{error}</div>

    return (
        <div className="inside-list-page">
            <div className="header-row">
                <h2 className="page-title">{listName}</h2>

            </div>

            {items.length > 0 ? (
                <div className="items-grid">
                    {items.map(rest => (
                        <ListRestaurantCard
                            key={rest.id}
                            restaurant={rest}
                            isEditing={isEditing}
                        />
                    ))}
                </div>
            ) : (
                <div className="empty-container">
                    <p className="empty-message">Bu listeye henüz restoran eklenmemiş.</p>
                </div>
            )}
        </div>
    )
}

export default InsideDiscoverPage
