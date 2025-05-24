// GEREKLİ KÜTÜPHANELER VE SERVİSLER
import { useState, useEffect } from 'react';
import { Star, Edit, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
// import { getAllBusinesses } from '../services/businessService.js'; // Kaldırıldı
import '../styles/MyReviewsPage.css';
import Button from '../components/Button.jsx';
import { getUserIdFromStorage, getUserReviews } from '../services/userService.js';

// yıldızlı puanlama gösterimi
const StarRating = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    return (
        <div className="star-rating">
            {[...Array(5)].map((_, i) => (
                <Star
                    key={i}
                    size={16}
                    className={
                        i < fullStars
                            ? 'star-filled'
                            : i === fullStars && hasHalfStar
                                ? 'star-half'
                                : 'star-empty'
                    }
                />
            ))}
            <span className="rating-value">{rating.toFixed(1)}</span>
        </div>
    );
};

// kullanıcının tüm yorumları burada listeleniyor
export default function MyReviews() {
    // ----------------------
    // STATE TANIMLARI
    // ----------------------
    const [reviews, setReviews] = useState([]);
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');
    const [filterRestaurant, setFilterRestaurant] = useState('');
    const [expandedReviews, setExpandedReviews] = useState({});
    const [editingReview, setEditingReview] = useState(null);
    const [editedText, setEditedText] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // yorumları çek
    useEffect(() => {
        const fetchUserReviews = async () => {
            try {
                const data = await getUserReviews(getUserIdFromStorage());
                setReviews(data);
            } catch (err) {
                console.error('Yorumlar alınamadı:', err);
                setError('Yorumlar yüklenemedi.');
                setReviews([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserReviews();
    }, []);

    // enrichedReviews: gömülü business objesinden name, photo, description al
    const enrichedReviews = reviews.map(r => ({
        ...r,
        restaurantName: r.business.name,
        restaurantImage: r.business.photo?.[0]?.url || '/api/placeholder/100/100',
        cuisine: r.business.description
    }));

    // filtre dropdown'u için unique restoran listesi oluştur
    const restaurantsForFilter = [...new Map(
        reviews.map(r => [r.business_id, r.business.name])
    ).entries()]
        .map(([id, name]) => ({ id, name }));

    // filtreleme ve sıralama
    const filteredAndSortedReviews = [...enrichedReviews]
        .filter(r => !filterRestaurant || r.business_id === filterRestaurant)
        .sort((a, b) => {
            if (sortBy === 'date') {
                const da = new Date(a.created_at), db = new Date(b.created_at);
                return sortOrder === 'asc' ? da - db : db - da;
            }
            if (sortBy === 'rating') {
                return sortOrder === 'asc' ? a.rating - b.rating : b.rating - a.rating;
            }
            return 0;
        });

    const toggleExpanded = id => {
        setExpandedReviews(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleDeleteReview = id => {
        if (window.confirm('Bu yorumu silmek istediğinize emin misiniz?')) {

            setReviews(prev => prev.filter(r => r.id !== id));
        }
    };

    const handleStartEdit = review => {
        setEditingReview(review.id);
        setEditedText(review.comment);
    };

    const handleSaveEdit = id => {
        setReviews(prev => prev.map(r => r.id === id ? { ...r, comment: editedText } : r));
        setEditingReview(null);
        setEditedText('');
    };

    const handleCancelEdit = () => {
        setEditingReview(null);
        setEditedText('');
    };

    if (isLoading) return <div className="loading-indicator">Loading reviews...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="reviews-container">
            <h1 className="page-title">Değerlendirmelerim</h1>

            {/* ÖZET BÖLÜMÜ */}
            <div className="summary-container">
                <h3 className="summary-title">Özet</h3>
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-value">{reviews.length}</div>
                        <div className="stat-label">Toplam Değerlendirme</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0.0'}</div>
                        <div className="stat-label">Ortalama Puan</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{new Set(reviews.map(r => r.business_id)).size}</div>
                        <div className="stat-label">Ziyaret Edilen Restoranlar</div>
                    </div>
                </div>
            </div>

            {/* FİLTRELER VE SIRALAMA */}
            <div className="filters-container">
                <div className="filters-layout">
                    <div className="filter-group">
                        <label className="filter-label">Restorana Göre Filtrele</label>
                        <select
                            value={filterRestaurant}
                            onChange={e => setFilterRestaurant(e.target.value)}
                            className="filter-select"
                        >
                            <option value="">Tüm Restoranlar</option>
                            {restaurantsForFilter.map(r => (
                                <option key={r.id} value={r.id}>{r.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label className="filter-label">Sırala</label>
                        <div className="sort-controls">
                            <select
                                value={sortBy}
                                onChange={e => setSortBy(e.target.value)}
                                className="filter-select"
                            >
                                <option value="date">Tarih</option>
                                <option value="rating">Puanlama</option>
                            </select>
                            <button
                                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                                className="sort-direction-button"
                            >
                                {sortOrder === 'asc' ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* YORUM KARTLARI */}
            <div className="reviews-list">
                {filteredAndSortedReviews.length > 0 ? (
                    filteredAndSortedReviews.map(review => (
                        <div key={review.id} className="review-card">
                            <div className="review-content">
                                <div className="restaurant-image-container-reviews">
                                    <img src={review.restaurantImage} alt={review.restaurantName} className="restaurant-image-reviews" />
                                </div>
                                <div className="review-details">
                                    <div className="review-header">
                                        <h3 className="restaurant-name">{review.restaurantName}</h3>
                                        <span className="review-date">{new Date(review.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="review-meta">
                                        <span className="cuisine-tag">{review.cuisine}</span>
                                        <StarRating rating={review.rating} />
                                    </div>

                                    {editingReview === review.id ? (
                                        <div className="edit-review-form">
                      <textarea
                          value={editedText}
                          onChange={e => setEditedText(e.target.value)}
                          className="review-text-edit"
                      />
                                            <div className="edit-controls">
                                                <button onClick={handleCancelEdit} className="cancel-button">İptal</button>
                                                <button onClick={() => handleSaveEdit(review.id)} className="save-button">Kaydet</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <p className={!expandedReviews[review.id] && review.comment.length > 120 ? 'review-text truncated' : 'review-text'}>
                                                {review.comment}
                                            </p>
                                            {review.comment.length > 120 && (
                                                <button onClick={() => toggleExpanded(review.id)} className="read-more-button">
                                                    {expandedReviews[review.id] ? 'Daha Az' : 'Daha Fazla'}
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-reviews-message">
                        <p>Filtrenize uygun yorum bulunamadı.</p>
                    </div>
                )}
            </div>


        </div>
    );
}