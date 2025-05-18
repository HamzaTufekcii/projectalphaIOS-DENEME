import React, { useState, useEffect } from 'react';
import '../styles/OwnerReviewsPage.css';
import Button from "../components/Button.jsx";

export default function ReviewsPage() {
    // Yorumları tutan state
    const [reviews, setReviews] = useState([]);


    const [sortField, setSortField] = useState('date');
    const [sortDirection, setSortDirection] = useState('desc');
    const [filterRating, setFilterRating] = useState(0);
    const [viewingReview, setViewingReview] = useState(null);

    // yorumları çek
    useEffect(() => {

        // axios.get(`/api/reviews/restaurant/${restaurantId}`).then(response => setReviews(response.data));

        // Şimdilik mock veri
        setReviews([
            {
                id: 1,
                customerName: "John Smith",
                rating: 5,
                date: "2025-05-16",
                content: "Amazing food and excellent service! The pasta was cooked to perfection and the wine selection is impressive."
            },
            {
                id: 2,
                customerName: "Emma Johnson",
                rating: 4,
                date: "2025-05-15",
                content: "Great atmosphere and delicious food. Took a bit long to get our appetizers but the main course made up for it."
            },
            {
                id: 3,
                customerName: "Michael Brown",
                rating: 3,
                date: "2025-05-14",
                content: "Food was good but service was a bit slow. Would give another chance though."
            },
            {
                id: 4,
                customerName: "Sarah Davis",
                rating: 5,
                date: "2025-05-13",
                content: "Best Italian restaurant in town! The tiramisu is to die for."
            },
            {
                id: 5,
                customerName: "David Wilson",
                rating: 2,
                date: "2025-05-12",
                content: "Disappointed with my experience. The food was cold when served and staff was not very attentive."
            },
            {
                id: 6,
                customerName: "Lisa Miller",
                rating: 5,
                date: "2025-05-11",
                content: "Celebrated my anniversary here and had an unforgettable experience. The chef's special was outstanding!"
            },
        ]);
    }, []);

    // Sıralama değişikliği
    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('desc');
        }
    };

    // Sıralama ve filtreleme uygulanmış liste
    const filteredAndSortedReviews = [...reviews]
        .filter(review => filterRating === 0 || review.rating === filterRating)
        .sort((a, b) => {
            const modifier = sortDirection === 'asc' ? 1 : -1;
            if (sortField === 'date') {
                return modifier * (new Date(a.date) - new Date(b.date));
            } else if (sortField === 'rating') {
                return modifier * (a.rating - b.rating);
            }
            return 0;
        });

    // Filtreyi güncelle
    const handleFilterByRating = (rating) => {
        setFilterRating(filterRating === rating ? 0 : rating);
    };

    // gösterilecek yorumu ayarlar
    const handleViewReview = (id) => {
        setViewingReview(reviews.find(review => review.id === id));
    };

    // Yıldız simgelerini oluştur
    const renderStars = (rating, size = "normal") => {
        return Array.from({ length: 5 }, (_, i) => (
            <span
                key={i}
                className={`star ${i + 1 <= rating ? 'filled' : ''} ${size}`}
            >
        ★
      </span>
        ));
    };

    return (
        <div className="reviews-page">
            {/* Üst bar */}
            <header className="header">
                <div className="container">
                    <div className="header-content">
                        <h1>Customer Reviews</h1>
                        <button
                            onClick={() => window.history.back()}
                            className="back-button"
                        >
                            Ana Sayfaya Dön
                        </button>
                    </div>
                </div>
            </header>

            {/* Ana içerik */}
            <main className="container">
                {/* Filtreleme alanı */}
                <div className="filter-section">
                    <div className="filter-content">
                        <div className="filter-label">
                            <span className="filter-icon">⚙️</span>
                            Filter by rating:
                        </div>
                        <div className="rating-filters">
                            {[1, 2, 3, 4, 5].map(rating => (
                                <button
                                    key={rating}
                                    onClick={() => handleFilterByRating(rating)}
                                    className={`rating-filter-button ${filterRating === rating ? 'active' : ''}`}
                                >
                                    {renderStars(rating, "small")}
                                </button>
                            ))}
                            {filterRating > 0 && (
                                <button
                                    onClick={() => setFilterRating(0)}
                                    className="clear-filter-button"
                                >
                                    Clear filter
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Yorum tablosu */}
                <div className="reviews-table-container">
                    <table className="reviews-table">
                        <thead>
                        <tr>
                            <th>Customer</th>
                            <th className="sortable" onClick={() => handleSort('rating')}>
                                <div className="th-content">
                                    Rating
                                    {sortField === 'rating' && (
                                        <span className="sort-arrow">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                                    )}
                                </div>
                            </th>
                            <th className="sortable" onClick={() => handleSort('date')}>
                                <div className="th-content">
                                    Date
                                    {sortField === 'date' && (
                                        <span className="sort-arrow">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                                    )}
                                </div>
                            </th>
                            <th><span className="sr-only">Actions</span></th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredAndSortedReviews.map((review) => (
                            <tr key={review.id}>
                                <td><div className="customer-name">{review.customerName}</div></td>
                                <td><div className="star-rating">{renderStars(review.rating)}</div></td>
                                <td>{new Date(review.date).toLocaleDateString()}</td>
                                <td className="actions-cell">
                                    <button
                                        onClick={() => handleViewReview(review.id)}
                                        className="view-button"
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Yorum detay popup (modal) */}
                {viewingReview && (
                    <div className="modal-overlay">
                        <div className="review-modal">
                            <h3 className="modal-title">
                                Review from {viewingReview.customerName}
                            </h3>

                            <div className="review-details">
                                <div className="review-meta">
                                    <div className="star-rating">{renderStars(viewingReview.rating)}</div>
                                    <span className="review-date">
                    {new Date(viewingReview.date).toLocaleDateString()}
                  </span>
                                </div>
                                <p className="review-content">{viewingReview.content}</p>
                            </div>

                            <div className="modal-actions">
                                <button
                                    onClick={() => setViewingReview(null)}
                                    className="my-button close-button"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}


