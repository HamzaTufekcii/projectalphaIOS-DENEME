// OwnerPromotionsPage.jsx
import React, { useState, useEffect } from 'react';
import { Calendar, Edit, Trash, Save, Plus, X } from 'lucide-react';
import Button from '../components/Button'; // Özel buton bileşeni
import '../styles/OwnerPromotionsPage.css';
import {useParams} from "react-router-dom";
import {deletePromotion, getBusinessPromotions, newPromotion, updatePromotion} from "../services/businessService.js";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {addToFavorites, removeFromList} from "../services/listService.js";

export default function OwnerPromotionsPage() {
    const {businessId} = useParams();
    const [promotions, setPromotions] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingPromotion, setEditingPromotion] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        amount: '',
        isActive: true,
    });
    const queryClient = useQueryClient();

    // Gerçek veriler backend'den çekilecek
    useEffect(() => {
        const fetchPromotions = async () => {
            const fetchedPromotions = await getBusinessPromotions(businessId);

            const mappedPromotions = fetchedPromotions.map(promo => ({
                id: promo.id,
                title: promo.title,
                description: promo.description,
                startDate: promo.startat,  // burası startat oldu
                endDate: promo.endat,      // burası endat oldu
                amount: promo.amount,
                isActive: promo.active,    // burası active oldu
            }));

            setPromotions(mappedPromotions);
        };
        fetchPromotions();
    }, [businessId]);

    // Tarihi local datetime-local formatına çevir (backend UTC tarih gönderir)
    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const utcDate = new Date(dateString);  // UTC olarak alıyor zaten
        // UTC zamanı local time’a çevir
        const localDate = new Date(utcDate.getTime() + utcDate.getTimezoneOffset() * 60000);

        const pad = (n) => n.toString().padStart(2, '0');
        return `${localDate.getFullYear()}-${pad(localDate.getMonth() + 1)}-${pad(localDate.getDate())}T${pad(localDate.getHours())}:${pad(localDate.getMinutes())}`;
    };
    const formatLocalDateForInput = (date) => {
        const pad = (n) => n.toString().padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    };


    //yeni kampanya ekleme
    // Yeni kampanya ekleme modali açılırken
    const openAddModal = () => {
        setFormData({
            title: '',
            description: '',
            startDate: formatLocalDateForInput(new Date()),
            endDate: formatLocalDateForInput(new Date(new Date().setMonth(new Date().getMonth() + 1))),
            isActive: true
        });
        setEditingPromotion(null);
        setShowAddModal(true);
    };

// Backend'den gelen promosyonları inputa uyarlarken
    const openEditModal = (promotion) => {
        setFormData({
            ...promotion,
            startDate: formatDateForInput(new Date(promotion.startDate)),
            endDate: formatDateForInput(new Date(promotion.endDate)),
        });
        setEditingPromotion(promotion.id);
        setShowAddModal(true);
    };

    // Formdaki input değişikliklerini işler
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSubmit = async () => {
        try {
            if (editingPromotion) {
                await promoMutation.mutateAsync({
                    action: 'update',
                    bizId: businessId,
                    id: editingPromotion,
                    data: formData
                });

                const updatedList = promotions.map(p =>
                    p.id === editingPromotion ? { ...p, ...formData } : p
                );
                setPromotions(updatedList);
            } else {
                const response = await promoMutation.mutateAsync({
                    action: 'create',
                    bizId: businessId,
                    data: formData
                });

                const newPromo = {
                    ...response,
                    startDate: response.startat,
                    endDate: response.endat,
                    isActive: response.active ?? response.isActive,
                };

                setPromotions([...promotions, newPromo]);
            }

            setShowAddModal(false);
            setEditingPromotion(null);
        } catch (error) {
            console.error('Kampanya kaydedilemedi:', error);
            alert('Kampanya kaydedilemedi:');
        }
    };

    const handleDeletePromotion = async (id) => {
        const confirmDelete = window.confirm("Bu kampanyayı silmek istediğinize emin misiniz?");
        if (!confirmDelete) return;

        try {
            await promoMutation.mutateAsync({
                action: 'delete',
                bizId: businessId,
                id: id,
                data: null
            });

            setPromotions(promotions.filter(p => p.id !== id));
        } catch (error) {
            console.error('Kampanya silinemedi:', error);
            alert('Kampanya silinirken bir hata oluştu.');
        }
    };
    const promoMutation = useMutation({
        mutationFn: async ({ action, bizId, id, data }) => {
            if (action === 'delete') {
                return await deletePromotion(bizId, id);
            } else if (action === 'create') {
                return await newPromotion(bizId, data);
            } else if (action === 'update') {
                return await updatePromotion(bizId, id, data);
            }
            throw new Error('Geçersiz işlem türü');
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['promotions', businessId]);
        },
        onError: (err) => {
            console.error('Kampanya işlemi hatası:', err);
            alert('Kampanya işlemi sırasında bir hata oluştu.');
        }
    });

    const handleToggleActive = async (id) => {
        try {
            const promotion = promotions.find(p => p.id === id);
            if (!promotion) return;

            const updatedData = {
                ...promotion,
                isActive: !promotion.isActive
            };

            await updatePromotion(businessId, id, updatedData);

            setPromotions(promotions.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p));
        } catch (error) {
            console.error('Aktiflik değiştirilemedi:', error);
        }
    };

    return (
        <div className="promotions-container">
            <header className="header">
                <div className="header-content">
                    <h1 className="page-title">Promosyonları Yönet</h1>
                    <div className="header-buttons">
                        <Button text="Yeni Promosyon Oluştur" onClick={openAddModal} className="btn btn-primary" />

                    </div>
                </div>
            </header>

            <main className="main-content">
                <div className="section-header">
                    <h2>Aktif Promosyonlar</h2>
                    <p className="section-description">Mevcut indirim ve fırsatlarınızı buradan yönetin</p>
                </div>

                <div className="promotions-grid">
                    {promotions.filter(p => p.isActive).map(promo => (
                        <PromotionCard
                            key={promo.id}
                            promotion={promo}
                            onEdit={openEditModal}
                            onDelete={handleDeletePromotion}
                            onToggleActive={handleToggleActive}
                        />
                    ))}

                    {promotions.filter(p => p.isActive).length === 0 && (
                        <p className="empty-state">Hiç aktif promosyon yok. Hemen ekleyin!</p>
                    )}
                </div>

                {promotions.some(p => !p.isActive) && (
                    <>
                        <h2 className="inactive-header">Pasif Promosyonlar</h2>
                        <div className="promotions-grid">
                            {promotions.filter(p => !p.isActive).map(promo => (
                                <PromotionCard
                                    key={promo.id}
                                    promotion={promo}
                                    onEdit={openEditModal}
                                    onDelete={handleDeletePromotion}
                                    onToggleActive={handleToggleActive}
                                />
                            ))}
                        </div>
                    </>
                )}
            </main>

            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h3>{editingPromotion ? 'Promosyonu Düzenle' : 'Yeni Promosyon Ekle'}</h3>
                            <Button onClick={() => { setShowAddModal(false); setEditingPromotion(null); }} className="close-button">
                                <X size={20} />
                            </Button>
                        </div>

                        <div className="modal-body">
                            <label>Başlık</label>
                            <input name="title" value={formData.title} onChange={handleInputChange} className="form-control" />

                            <label>Açıklama</label>
                            <textarea name="description" value={formData.description} onChange={handleInputChange} className="form-control" />

                            <label>Başlangıç</label>
                            <input type="datetime-local" name="startDate" value={formData.startDate} onChange={handleInputChange} className="form-control" />

                            <label>Bitiş</label>
                            <input type="datetime-local" name="endDate" value={formData.endDate} onChange={handleInputChange} className="form-control" />


                            <div className="percent-input-wrapper">
                                <label>İndirim Miktarı</label>
                                <div className="percent-input-container">
                                    <span className="percent-sign">%</span>
                                    <input
                                        type="number"
                                        min={0}
                                        max={100}
                                        step={5}
                                        name="amount"
                                        value={formData.amount}
                                        onChange={handleInputChange}
                                        className="percent-input"
                                    />
                                </div>
                            </div>

                            <div className="checkbox-group">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleInputChange}
                                    className="checkbox"
                                    id="isActive"
                                />
                                <label htmlFor="isActive">Aktif Olsun</label>
                            </div>

                            <div className="modal-actions">
                                <Button text="İptal" onClick={() => { setShowAddModal(false); setEditingPromotion(null); }} className="btn btn-secondary" />
                                <Button text={editingPromotion ? 'Güncelle' : 'Oluştur'} onClick={handleSubmit} className="btn btn-primary" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


// Tekil kampanya kartı bileşeni
function PromotionCard({ promotion, onEdit, onDelete, onToggleActive }) {
    const now = new Date();

    const start = new Date(promotion.startDate);
    const end = new Date(promotion.endDate);

    const status = !promotion.isActive
        ? 'Pasif'
        : end < now
            ? 'Süresi Dolmuş'
            : start > now
                ? 'Zamanlanmış'
                : 'Aktif';

    return (
        <div className={`promotion-card ${promotion.isActive ? 'card-active' : 'card-inactive'}`}>
            <div className="card-content">
                <div className="card-header">
                    <h3>{promotion.title}</h3>
                    <span className={`status-badge status-${status.toLowerCase()}`}>{status}</span>
                </div>
                <p className="card-description">{promotion.description}</p>
                {promotion.amount && (
                    <p className="card-discount">İndirim: %{promotion.amount}</p>
                )}
                <div className="card-dates">
                    <Calendar size={14} /> {start.toLocaleDateString()} - {end.toLocaleDateString()}
                </div>
                <div className="card-actions">
                    <Button text={promotion.isActive ? 'Devre Dışı Bırak' : 'Etkinleştir'} onClick={() => onToggleActive(promotion.id)} className="btn btn-outline" />
                    <Button text="Düzenle" onClick={() => onEdit(promotion)} className="btn btn-primary" />
                    <Button text="Sil" onClick={() => onDelete(promotion.id)} className="btn btn-danger" />
                </div>
            </div>
        </div>
    );
}
