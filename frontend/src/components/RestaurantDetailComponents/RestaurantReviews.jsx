import React, { useState, useEffect } from 'react';
import { FaStar, FaUserCircle } from 'react-icons/fa';
import { format } from 'date-fns';
import './RestaurantReviews.css';
import CustomInput from "../CustomInput.jsx";
import Button from "../Button.jsx";

const RestaurantReviews = ({ restaurantId }) => {
    const [reviews, setReviews] = useState([]);
    const [statistics, setStatistics] = useState({
        average: 0,
        total: 0,
        distribution: [0, 0, 0, 0, 0]
    });
    const [userReview, setUserReview] = useState({
        name: '',
        rating: 0,
        comment: ''
    });
    const [hoveredRating, setHoveredRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [sortOrder, setSortOrder] = useState('desc'); // başta en yüksek puanlılar gelsin

    // Fetch reviews and statistics (In a real app, this would call an API)
    useEffect(() => {
        // Mock data for demonstration
        const mockData = {
            reviews: [
                {
                    id: 1,
                    name: 'Ahmet Y.',
                    rating: 5,
                    comment: 'Harika bir deneyimdi! Atmosfer mükemmeldi ve yemekler lezzetliydi. Makarna çeşitlerini ve tatlı olarak tiramisu\'yu kesinlikle tavsiye ederim.',
                    date: new Date(2025, 4, 14) // May 14, 2025
                },
                {
                    id: 2,
                    name: 'Zeynep K.',
                    rating: 4,
                    comment: 'Servis ve ambiyans çok güzeldi. Yemekler iyiydi, ancak porsiyon boyutlarına göre biraz pahalı. Muhtemelen özel günler için tekrar geleceğim.',
                    date: new Date(2025, 4, 9) // May 9, 2025
                },
                {
                    id: 3,
                    name: 'Selin B.',
                    rating: 5,
                    comment: 'Şehrin en iyi İtalyan restoranı! Lazanya efsaneydi ve servis çok hızlıydı. Kesinlikle tekrar geleceğiz.',
                    date: new Date(2025, 4, 5) // May 5, 2025
                }
            ],
            statistics: {
                average: 4.7,
                total: 120,
                distribution: [84, 24, 10, 3, 0] // 1-star to 5-star counts
            }
        };

        setReviews(mockData.reviews);
        setStatistics(mockData.statistics);
    }, [restaurantId]);

    // Calculate percentage for rating distribution bars
    const getRatingPercentage = (count) => {
        return statistics.total > 0 ? (count / statistics.total) * 100 : 0;
    };

    // Handle rating selection
    const handleRatingClick = (rating) => {
        setUserReview({ ...userReview, rating });
    };

    // formdaki input değişiklikleri
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserReview({ ...userReview, [name]: value });
    };

    // Form kayıt
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // In a real app, this would send data to the server
        setTimeout(() => {
            //listeye manuel olarakk yeni yorum ekler. normalde serverdan gelmelidir
            const newReview = {
                id: reviews.length + 1,
                ...userReview,
                date: new Date()
            };

            setReviews([newReview, ...reviews]);

            // Reset form
            setUserReview({
                name: '',
                rating: 0,
                comment: ''
            });

            setIsSubmitting(false);
            setShowSuccessMessage(true);

            // Hide success message after 3 seconds
            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 3000);
        }, 1000);
    };

    // Format date as "X days ago" or exact date
    const formatDate = (date) => {
        const now = new Date();
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Bugün';
        if (diffDays === 1) return 'Dün';
        if (diffDays < 7) return `${diffDays} gün önce`;

        return format(date, 'dd.MM.yyyy');
    };

    return (
        <div className="restaurant-reviews">
            {/* değenlendirmeler genel bilgi*/}
            <div className="reviews-summary">
                <div className="overall-rating">
                    <div className="rating-number">{statistics.average.toFixed(1)}</div>
                    <div className="rating-stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                                key={star}
                                className={star <= Math.round(statistics.average) ? "star filled" : "star"}
                            />
                        ))}
                    </div>
                    <div className="total-reviews">{statistics.total} değerlendirme</div>
                </div>

                <div className="rating-breakdown">
                    {[5, 4, 3, 2, 1].map((rating) => (
                        <div className="rating-bar" key={rating}>
                            <span className="rating-label">{rating}</span>
                            <div className="progress-bar">
                                <div
                                    className="progress"
                                    style={{ width: `${getRatingPercentage(statistics.distribution[5-rating])}%` }}
                                ></div>
                            </div>
                            <span className="count">{statistics.distribution[5-rating]}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Yorum yapma formu*/}
            <div className="review-form-container">
                <h3>Değerlendirmenizi Paylaşın</h3>
                <form onSubmit={handleSubmit} className="review-form">
                    <div className="form-group">
                        <label htmlFor="name">İsim</label>
                        <CustomInput
                            type="text"
                            placeholder=""
                            name="name"
                            value={userReview.name}
                            onChange={handleInputChange}
                            className='custom-input form-control'
                            required={true}
                            id='name'
                        />

                    </div>

                    <div className="form-group">
                        <label>Puanınız</label>
                        <div className="rating-input">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar
                                    key={star}
                                    className={
                                        (userReview.rating >= star || hoveredRating >= star)
                                            ? "star interactive filled"
                                            : "star interactive"
                                    }
                                    onClick={() => handleRatingClick(star)}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="comment">Yorumunuz</label>
                        <textarea
                            id="comment"
                            name="comment"
                            value={userReview.comment}
                            onChange={handleInputChange}
                            required
                            className="form-control"
                            placeholder="Deneyiminiz hakkındaki düşüncelerinizi paylaşın."
                            rows="4"
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        className="submit-button"
                        disabled={isSubmitting || userReview.rating === 0}
                    >
                        {isSubmitting ? 'Gönderiliyor...' : 'Değerlendirme Gönder'}
                    </button>

                    {showSuccessMessage && (
                        <div className="success-message">
                            Değerlendirmeniz için teşekkürler! Yorumunuz başarıyla gönderildi.
                        </div>
                    )}
                </form>
            </div>


            {/* yorumlar listesi ve sıralama filtresi */}
            <div className="reviews-list">
                <div className="reviews-header">
                    <h3>Yorumlar</h3>
                    <div className="sort-section">
                        <label htmlFor="sortOrder"></label>
                        <select
                            id="sortOrder"
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="sort-dropdown"
                        >
                            <option value="desc">Puan: Yüksekten Düşüğe</option>
                            <option value="asc">Puan: Düşükten Yükseğe</option>
                        </select>
                    </div>
                </div>



                {/* Yorumlar Listesi */}
                {reviews.length > 0 ? (
                    [...reviews]
                        .sort((a, b) =>
                            sortOrder === 'asc' ? a.rating - b.rating : b.rating - a.rating
                        )
                        .map((review) => (
                            <div className="review-item" key={review.id}>
                                <div className="reviewer-avatar">
                                    <FaUserCircle size={40} />
                                </div>
                                <div className="review-content">
                                    <div className="reviewer-info">
                                        <span className="reviewer-name">{review.name}</span>
                                        <span className="review-date">{formatDate(review.date)}</span>
                                    </div>
                                    <div className="review-rating">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <FaStar
                                                key={star}
                                                className={star <= review.rating ? "star filled" : "star"}
                                            />
                                        ))}
                                    </div>
                                    <p className="review-text">{review.comment}</p>
                                </div>
                            </div>
                        ))
                ) : (
                    <p className="no-reviews">Henüz değerlendirme bulunmuyor. İlk değerlendirmeyi siz yapın!</p>
                )}
            </div>



        </div>
    );
};

export default RestaurantReviews;