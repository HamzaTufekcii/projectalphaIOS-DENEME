import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ListRestaurantCard from '../components/ListRestaurantCard'
import { getUserLists, getUserListItems } from '../services/listService'
import { getUserIdFromStorage } from '../services/userService'
import '../styles/InsideListPage.css'

const InsideListPage = () => {
    const { listId } = useParams()
    const userId     = getUserIdFromStorage()

    const [listName, setListName] = useState('Liste Detayları')
    const [items,    setItems]    = useState([])
    const [loading,  setLoading]  = useState(true)
    const [error,    setError]    = useState(null)

    useEffect(() => {
        if (!userId || !listId) return

        const fetchData = async () => {
            try {
                setLoading(true)

                // 1) Tüm listeleri çek, ilgili listId'nin adını bul
                const lists = await getUserLists(userId)
                const me    = lists.find(l => l.id === listId)
                if (me && me.name) setListName(me.name)

                // 2) O listenin öğelerini çek
                const listItems = await getUserListItems(userId, listId)
                setItems(listItems)
            } catch (err) {
                console.error('InsideListPage fetch error:', err)
                setError('Liste yüklenemedi.')
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [userId, listId])

    if (loading) return <div className="loading-indicator">Yükleniyor...</div>
    if (error)   return <div className="error-message">{error}</div>

    return (
        <div className="inside-list-page">
            <h2 className="page-title">{listName}</h2>

            {items.length > 0 ? (
                <div className="items-grid">
                    {items.map(rest => (
                        <ListRestaurantCard
                            key={rest.id}
                            restaurant={rest}
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

export default InsideListPage
