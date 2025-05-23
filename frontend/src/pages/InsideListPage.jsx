// src/pages/InsideListPage.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getListDetails } from "../services/listService";
// RestaurantCard artık HomePageComponents altından import ediliyor:
import RestaurantCard from "../components/HomePageComponents/RestaurantCard";
import "../styles/InsideListPage.css";

export default function InsideListPage() {
    const { listId } = useParams();
    const [list, setList]       = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getListDetails(listId)
            .then(data => setList(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [listId]);

    if (loading) return <p>Yükleniyor…</p>;
    if (!list)   return <p>Liste bulunamadı.</p>;

    return (
        <div className="inside-list-page">
            <h2>{list.name}</h2>
            {(!list.businesses || list.businesses.length === 0) ? (
                <p>Bu listede henüz restoran yok.</p>
            ) : (
                <div className="restaurant-grid">
                    {list.businesses.map(rest => (
                        <RestaurantCard
                            key={rest.id}
                            restaurant={rest}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
