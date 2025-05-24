// src/components/HomePageComponents/AdresFiltrelePopup.jsx
import React, { useEffect, useState } from 'react';
import { getAllBusinesses } from '../../services/businessService';
import { mapBusiness } from '../../utils/businessMapper';
import './AdresFiltrelePopup.css';

export default function AdresFiltrelePopup({ onClose, onApply }) {
    const [allRestaurants, setAllRestaurants] = useState([]);
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [neighborhoods, setNeighborhoods] = useState([]);
    const [streets, setStreets] = useState([]);

    const [selectedCity, setSelectedCity] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedNeighborhood, setSelectedNeighborhood] = useState('');
    const [selectedStreet, setSelectedStreet] = useState('');

    useEffect(() => {
        async function fetchData() {
            try {
                const raw = await getAllBusinesses();
                const mapped = raw.map(mapBusiness);
                setAllRestaurants(mapped);
                const citySet = new Set(mapped.map(r => r.address?.city).filter(Boolean));
                setCities([...citySet]);
            } catch (err) {
                console.error('Adres verisi yüklenemedi:', err);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        const ds = new Set(
            allRestaurants
                .filter(r => r.address?.city === selectedCity)
                .map(r => r.address.district)
                .filter(Boolean)
        );
        setDistricts([...ds]);
        setSelectedDistrict('');
        setNeighborhoods([]);
        setSelectedNeighborhood('');
        setStreets([]);
        setSelectedStreet('');
    }, [selectedCity, allRestaurants]);

    useEffect(() => {
        const ns = new Set(
            allRestaurants
                .filter(r => r.address?.district === selectedDistrict)
                .map(r => r.address.neighborhood)
                .filter(Boolean)
        );
        setNeighborhoods([...ns]);
        setSelectedNeighborhood('');
        setStreets([]);
        setSelectedStreet('');
    }, [selectedDistrict, allRestaurants]);

    useEffect(() => {
        const ss = new Set(
            allRestaurants
                .filter(r => r.address?.neighborhood === selectedNeighborhood)
                .map(r => r.address.street)
                .filter(Boolean)
        );
        setStreets([...ss]);
        setSelectedStreet('');
    }, [selectedNeighborhood, allRestaurants]);

    const handleApply = () => {
        onApply({
            city: selectedCity,
            district: selectedDistrict,
            neighborhood: selectedNeighborhood,
            street: selectedStreet
        });
        onClose();
    };

    return (
        <div className="adres-popup-overlay" onClick={onClose}>
            <div
                className="adres-popup"
                onClick={e => e.stopPropagation()}
            >
                <h3>Adres Filtrele</h3>

                <select
                    value={selectedCity}
                    onChange={e => setSelectedCity(e.target.value)}
                >
                    <option value="">Şehir Seçin</option>
                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>

                <select
                    value={selectedDistrict}
                    onChange={e => setSelectedDistrict(e.target.value)}
                    disabled={!districts.length}
                >
                    <option value="">İlçe Seçin</option>
                    {districts.map(d => <option key={d} value={d}>{d}</option>)}
                </select>

                <select
                    value={selectedNeighborhood}
                    onChange={e => setSelectedNeighborhood(e.target.value)}
                    disabled={!neighborhoods.length}
                >
                    <option value="">Mahalle Seçin</option>
                    {neighborhoods.map(n => <option key={n} value={n}>{n}</option>)}
                </select>

                <select
                    value={selectedStreet}
                    onChange={e => setSelectedStreet(e.target.value)}
                    disabled={!streets.length}
                >
                    <option value="">Sokak Seçin</option>
                    {streets.map(s => <option key={s} value={s}>{s}</option>)}
                </select>

                <div className="actions">
                    <button className="btn-apply" onClick={handleApply}>Uygula</button>
                    <button className="btn-cancel" onClick={onClose}>İptal</button>
                </div>
            </div>
        </div>
    );
}
