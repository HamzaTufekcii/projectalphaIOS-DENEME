// src/components/HomePageComponents/AdresFiltrelePopup.jsx
import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllBusinesses } from '../../services/businessService';
import { mapBusiness } from '../../utils/businessMapper';
import './AdresFiltrelePopup.css';

export default function AdresFiltrelePopup({ onClose, onApply }) {
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedNeighborhood, setSelectedNeighborhood] = useState('');
    const [selectedStreet, setSelectedStreet] = useState('');

    // 1️⃣ Tüm restoran verisini React Query ile çek ve mapBusiness uygula
    const { data: businesses = [], isLoading, error } = useQuery({
        queryKey: ['allBusinesses'],
        queryFn: async () => {
            const raw = await getAllBusinesses();
            return raw.map(mapBusiness);
        },
        staleTime: 5 * 60 * 1000,
        cacheTime: 30 * 60 * 1000,
    });

    // 2️⃣ useMemo ile yalnızca ihtiyaç duyduğunda hesapla
    const cities = useMemo(
        () => Array.from(new Set(businesses.map(r => r.address?.city).filter(Boolean))).sort(),
        [businesses]
    );
    const districts = useMemo(
        () =>
            selectedCity
                ? Array.from(
                    new Set(
                        businesses
                            .filter(r => r.address?.city === selectedCity)
                            .map(r => r.address.district)
                            .filter(Boolean),
                    ),
                ).sort()
                : [],
        [businesses, selectedCity]
    );
    const neighborhoods = useMemo(
        () =>
            selectedDistrict
                ? Array.from(
                    new Set(
                        businesses
                            .filter(r => r.address?.city === selectedCity && r.address?.district === selectedDistrict)
                            .map(r => r.address.neighborhood)
                            .filter(Boolean),
                    ),
                ).sort()
                : [],
        [businesses, selectedCity, selectedDistrict]
    );
    const streets = useMemo(
        () =>
            selectedNeighborhood
                ? Array.from(
                    new Set(
                        businesses
                            .filter(
                                r =>
                                    r.address?.city === selectedCity &&
                                    r.address?.district === selectedDistrict &&
                                    r.address?.neighborhood === selectedNeighborhood,
                            )
                            .map(r => r.address.street)
                            .filter(Boolean),
                    ),
                ).sort()
                : [],
        [businesses, selectedCity, selectedDistrict, selectedNeighborhood]
    );

    // 3️⃣ Uygula ve kapat
    const handleApply = () => {
        onApply({
            city: selectedCity,
            district: selectedDistrict,
            neighborhood: selectedNeighborhood,
            street: selectedStreet,
        });
        onClose();
    };

    if (isLoading) return <div className="adres-popup">Yükleniyor…</div>;
    if (error) return <div className="adres-popup">Adres verisi yüklenemedi.</div>;

    return (
        <div className="adres-popup-overlay" onClick={onClose}>
            <div className="adres-popup" onClick={e => e.stopPropagation()}>
                <h3>Adres Filtrele</h3>

                <select value={selectedCity} onChange={e => { setSelectedCity(e.target.value); setSelectedDistrict(''); setSelectedNeighborhood(''); setSelectedStreet(''); }}>
                    <option value="">Şehir Seçin</option>
                    {cities.map(city => (
                        <option key={city} value={city}>
                            {city}
                        </option>
                    ))}
                </select>

                <select
                    value={selectedDistrict}
                    onChange={e => { setSelectedDistrict(e.target.value); setSelectedNeighborhood(''); setSelectedStreet(''); }}
                    disabled={!districts.length}
                >
                    <option value="">İlçe Seçin</option>
                    {districts.map(district => (
                        <option key={district} value={district}>
                            {district}
                        </option>
                    ))}
                </select>

                <select
                    value={selectedNeighborhood}
                    onChange={e => { setSelectedNeighborhood(e.target.value); setSelectedStreet(''); }}
                    disabled={!neighborhoods.length}
                >
                    <option value="">Mahalle Seçin</option>
                    {neighborhoods.map(nbhd => (
                        <option key={nbhd} value={nbhd}>
                            {nbhd}
                        </option>
                    ))}
                </select>

                <select
                    value={selectedStreet}
                    onChange={e => setSelectedStreet(e.target.value)}
                    disabled={!streets.length}
                >
                    <option value="">Sokak Seçin</option>
                    {streets.map(street => (
                        <option key={street} value={street}>
                            {street}
                        </option>
                    ))}
                </select>

                <div className="actions">
                    <button className="btn-apply" onClick={handleApply}>
                        Uygula
                    </button>
                    <button className="btn-cancel" onClick={onClose}>
                        İptal
                    </button>
                </div>
            </div>
        </div>
    );
}
