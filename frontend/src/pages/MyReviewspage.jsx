// GEREKLİ KÜTÜPHANELER VE SERVİSLER
import { useState, useEffect } from 'react';
import { Star, Edit, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { getAllRestaurants } from '../services/restaurantService.js';
import '../styles/MyReviewsPage.css';
import Button from '../components/Button.jsx';

// Geçici mock yorum verileri (Backend entegrasyonu tamamlanana kadar kullanılıyor)
/*
useEffect(() => {
    const fetchUserReviews = async () => {
        const userReviews = await getUserReviews(userId); // backend'den kullanıcıya ait yorumları getir
        setReviews(userReviews);
    };
    fetchUserReviews();
}, []);
*/
//getAllRestaurants ile restaurantService dosyasında olan restoran verileri alındı onlara mock yorumlar eklendi
const sampleReviews = [
    {
        id: 1,
        restaurantId: 3,
        rating: 4,
        reviewText: "Harika yemek ve özenli servis. Ortam gerçekten çok temiz ve nezihti. Yüksek fiyatlı ama özel günlerde kesinlikle tercih edilebilir.",
        date: "May 15, 2025"
    },
    {
        id: 2,
        restaurantId: 4,
        rating: 5,
        reviewText: "Rahatlıkla bir şeyler içip arkadaşlarınızla eğlenebileceğiniz bir ortam. Pub olmasına rağmen ortam ferah ve rahattı. Müzik rahatsız edici değildi.",
        date: "May 10, 2025"
    },
    {
        id: 3,
        restaurantId: 1,
        rating: 3,
        reviewText: "Çok cozy ve romantik bir mekan. Fakat fazla küçük olmasından kaynaklı uzun süre sıra bekledik ve rezervasyon yaptıramadık. Ayrıca dışarıdaki ısıtma sistemi yeterli değildi.",
        date: "May 3, 2025"
    }
];

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

//kullanıcın tüm yorumları burada listeleniyor
export default function MyReviews() {
    // ----------------------
    // STATE TANIMLARI
    // ----------------------
    const [reviews, setReviews] = useState(sampleReviews); // ✅ Gerçek backend'de: sampleReviews yerine setReviews(await getUserReviews())
    const [restaurants, setRestaurants] = useState([]);
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');
    const [filterRestaurant, setFilterRestaurant] = useState('');
    const [expandedReviews, setExpandedReviews] = useState({});
    const [editingReview, setEditingReview] = useState(null);
    const [editedText, setEditedText] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);


    // Tüm restoranları çek (restaurantService.js 'den)
    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                setIsLoading(true);
                const allRestaurants = await getAllRestaurants();
                setRestaurants(allRestaurants);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching restaurants:', error);
                setError('Failed to load restaurants. Please try again later.');
                setIsLoading(false);
            }
        };

        fetchRestaurants();
    }, []);

    //yorumlarla restoranları eşlemeyi yapar
    const enrichedReviews = reviews.map(review => {
        const restaurant = restaurants.find(r => r.id === review.restaurantId) || {};
        return {
            ...review,
            restaurantName: restaurant.name || 'Unknown Restaurant',
            restaurantImage: restaurant.image || '/api/placeholder/100/100',
            cuisine: restaurant.type || 'Unknown'
        };
    });

    //filtreleme ve sıralama
    const filteredAndSortedReviews = [...enrichedReviews]
        .filter(review =>
            filterRestaurant === '' || review.restaurantId === parseInt(filterRestaurant)
        )
        .sort((a, b) => {
            if (sortBy === 'date') {
                return sortOrder === 'asc' ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date);
            } else if (sortBy === 'rating') {
                return sortOrder === 'asc' ? a.rating - b.rating : b.rating - a.rating;
            }
            return 0;
        });

    //açılıp kapanır yorum metni(burası kaldırılabilir)
    const toggleExpanded = (reviewId) => {
        setExpandedReviews(prev => ({
            ...prev,
            [reviewId]: !prev[reviewId]
        }));
    };

    //yorum silme(olmalı mı?)
    const handleDeleteReview = (reviewId) => {
        if (window.confirm('Are you sure you want to delete this review?')) {
            // ✅ Gerçek backend'de: await deleteReview(reviewId);
            setReviews(reviews.filter(review => review.id !== reviewId));
        }
    };

    //yorum düzenleme
    const handleStartEdit = (review) => {
        setEditingReview(review.id);
        setEditedText(review.reviewText);
    };

    //düzenlenen yorumu kaydetme
    const handleSaveEdit = (reviewId) => {
        // ✅ Gerçek backend'de: await updateReview(reviewId, editedText);
        setReviews(reviews.map(review =>
            review.id === reviewId
                ? { ...review, reviewText: editedText }
                : review
        ));
        setEditingReview(null);
        setEditedText('');
    };

    //düzenlemeyi iptal etme
    const handleCancelEdit = () => {
        setEditingReview(null);
        setEditedText('');
    };


    if (isLoading) return <div className="loading-indicator">Loading reviews...</div>;
    if (error) return <div className="error-message">{error}</div>;


    return (
        <div className="reviews-container">
            <h1 className="page-title">Değerlendirmelerim</h1>

            {/* ------------------ FİLTRELER VE SIRALAMA ------------------ */}
            <div className="filters-container">
                <div className="filters-layout">
                    <div className="filter-group">
                        <label className="filter-label">Restorana Göre Filtrele</label>
                        <select
                            value={filterRestaurant}
                            onChange={(e) => setFilterRestaurant(e.target.value)}
                            className="filter-select"
                        >
                            <option value="">Bütün Restoranlar</option>
                            {restaurants.map(restaurant => (
                                <option key={restaurant.id} value={restaurant.id}>{restaurant.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label className="filter-label">Filtrele</label>
                        <div className="sort-controls">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="filter-select"
                            >
                                <option value="date">Tarih</option>
                                <option value="rating">Puanlama</option>
                            </select>
                            <button
                                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                className="sort-direction-button"
                            >
                                {sortOrder === 'asc' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ------------------ YORUM KARTLARI ------------------ */}
            <div className="reviews-list">
                {filteredAndSortedReviews.length > 0 ? (
                    filteredAndSortedReviews.map(review => (
                        <div key={review.id} className="review-card">
                            <div className="review-content">
                                {/* GÖRSEL */}
                                <div className="restaurant-image-container-reviews">
                                    <img
                                        src={review.restaurantImage}
                                        alt={review.restaurantName}
                                        className="restaurant-image-reviews"
                                    />
                                </div>

                                {/* YORUM DETAYLARI */}
                                <div className="review-details">
                                    <div className="review-header">
                                        <h3 className="restaurant-name">{review.restaurantName}</h3>
                                        <span className="review-date">{review.date}</span>
                                    </div>

                                    <div className="review-meta">
                                        <span className="cuisine-tag">{review.cuisine}</span>
                                        <StarRating rating={review.rating} />
                                    </div>

                                    {editingReview === review.id ? (
                                        // DÜZENLEME FORMU
                                        <div className="edit-review-form">
                                            <textarea
                                                value={editedText}
                                                onChange={(e) => setEditedText(e.target.value)}
                                                className="review-text-edit"
                                            />
                                            <div className="edit-controls">
                                                <button onClick={handleCancelEdit} className="cancel-button">Cancel</button>
                                                <button onClick={() => handleSaveEdit(review.id)} className="save-button">Save</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            {/* YORUM METNİ */}
                                            <p className={!expandedReviews[review.id] && review.reviewText.length > 120 ? 'review-text truncated' : 'review-text'}>
                                                {review.reviewText}
                                            </p>
                                            {/* DAHA FAZLA GÖSTER */}
                                            {review.reviewText.length > 120 && (
                                                <button onClick={() => toggleExpanded(review.id)} className="read-more-button">
                                                    {expandedReviews[review.id] ? 'Read less' : 'Read more'}
                                                </button>
                                            )}
                                            {/* DÜZENLE / SİL */}
                                            <div className="review-actions">
                                                <div className="action-buttons">
                                                    <button onClick={() => handleStartEdit(review)} className="edit-button" title="Edit review">
                                                        <Edit size={18} />
                                                    </button>
                                                    <button onClick={() => handleDeleteReview(review.id)} className="delete-button" title="Delete review">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-reviews-message">
                        <p>No reviews match your filters.</p>
                    </div>
                )}
            </div>

            {/* ------------------ ÖZET BÖLÜMÜ ------------------ */}
            <div className="summary-container">
                <h3 className="summary-title">Your Review Summary</h3>
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-value">{reviews.length}</div>
                        <div className="stat-label">Toplam Değerlendirme</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">
                            {reviews.length > 0
                                ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
                                : "0.0"}
                        </div>
                        <div className="stat-label">Ortalama Puan</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">
                            {new Set(reviews.map(review => review.restaurantId)).size}
                        </div>
                        <div className="stat-label">Ziyaret Edilen Restoranlar</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
