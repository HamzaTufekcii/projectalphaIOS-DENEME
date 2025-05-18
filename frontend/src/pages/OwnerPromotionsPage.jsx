// OwnerPromotionsPage.jsx
import { useState, useEffect } from 'react';
import { Calendar, Edit, Trash, Save, Plus, X } from 'lucide-react';
import Button from '../components/Button'; // Özel buton bileşeni
import '../styles/OwnerPromotionsPage.css';

export default function OwnerPromotionsPage() {
    const [promotions, setPromotions] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingPromotion, setEditingPromotion] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        isActive: true
    });

    // Gerçek veriler backend'den çekilecek
    useEffect(() => {

        /*
        useEffect(() => {
            const fetchPromotions = async () => {
                try {
                    const response = await axios.get('http://localhost:8080/api/promotions/owner');
                    setPromotions(response.data);
                } catch (error) {
                    console.error('Kampanyalar yüklenemedi:', error);
                }
            };
            fetchPromotions();
        }, []);
        */

        setPromotions([
            {
                id: 1,
                title: "Happy Hour",
                description: "16.00 - 19.00 arası tüm içeceklerde %15 indirim",
                startDate: "2025-05-01",
                endDate: "2025-06-30",
                isActive: true
            },
            {
                id: 2,
                title: "Aile Menüsü",
                description: "4 kişilik menü alanlara tatlı ikramı",
                startDate: "2025-05-10",
                endDate: "2025-05-31",
                isActive: true
            },
            {
                id: 3,
                title: "Öğle Yemeği Fırsatı",
                description: "Hafta içi tüm öğle menülerinde %20 indirim",
                startDate: "2025-04-01",
                endDate: "2025-04-30",
                isActive: false
            }
        ]);
    }, []);

    const formatDateForInput = (date) => date.toISOString().split('T')[0];

    //yeni kampanya ekleme
    const openAddModal = () => {
        setFormData({
            title: '',
            description: '',
            startDate: formatDateForInput(new Date()),
            endDate: formatDateForInput(new Date(new Date().setMonth(new Date().getMonth() + 1))),
            isActive: true
        });
        setEditingPromotion(null);
        setShowAddModal(true);
    };

    //mevcut promosyon düzenleme
    const openEditModal = (promotion) => {
        setFormData({ ...promotion });
        setEditingPromotion(promotion.id);
        setShowAddModal(true);
    };

    // Formdaki input değişikliklerini işler
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSubmit = () => {
        if (editingPromotion) {
            // PUT isteği gönderilerek güncelleme yapılabilir
            setPromotions(promotions.map(p => p.id === editingPromotion ? { ...p, ...formData } : p));
        } else {
            // POST isteği ile yeni kampanya backend'e gönderilmeli
            const newPromotion = { id: Date.now(), ...formData };
            setPromotions([...promotions, newPromotion]);
        }
        setShowAddModal(false);
        setEditingPromotion(null);
    };
    /*
    const handleSubmit = async () => {
        try {
            if (editingPromotion) {
                //Kampanyayı güncelle
                await axios.put(`http://localhost:8080/api/promotions/${editingPromotion}`, formData);
                const updatedList = promotions.map(p => p.id === editingPromotion ? { ...p, ...formData } : p);
                setPromotions(updatedList);
            } else {
                //Yeni kampanya ekle
                const response = await axios.post('http://localhost:8080/api/promotions', formData);
                setPromotions([...promotions, response.data]);
            }
            setShowAddModal(false);
            setEditingPromotion(null);
        } catch (error) {
            console.error('Kampanya kaydedilemedi:', error);
        }
    };
    */



    const handleDeletePromotion = (id) => {
        const confirmDelete = window.confirm("Bu kampanyayı silmek istediğinize emin misiniz?");
        if (confirmDelete) {

            setPromotions(promotions.filter(p => p.id !== id));
        }
    };

    const handleToggleActive = (id) => {

        setPromotions(promotions.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p));
    };
    /*
    const handleDeletePromotion = async (id) => {
        const confirmDelete = window.confirm("Bu kampanyayı silmek istediğinize emin misiniz?");
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:8080/api/promotions/${id}`);
                setPromotions(promotions.filter(p => p.id !== id));
            } catch (error) {
                console.error('Silme işlemi başarısız:', error);
            }
        }
    };


    const handleToggleActive = async (id) => {
        try {
            await axios.patch(`http://localhost:8080/api/promotions/${id}/toggle`);
            setPromotions(promotions.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p));
        } catch (error) {
            console.error('Aktiflik değiştirilemedi:', error);
        }
    };
    */

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
                            <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} className="form-control" />

                            <label>Bitiş</label>
                            <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} className="form-control" />

                            <div className="checkbox-group">
                                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} className="checkbox" />
                                <label>Aktif Olsun</label>
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
