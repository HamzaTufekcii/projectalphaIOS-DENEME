// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaStar, 
  FaSearch, 
  FaFilter, 
  FaMapMarkerAlt, 
  FaHeart, 
  FaRegHeart, 
  FaPizzaSlice, 
  FaCoffee, 
  FaHamburger, 
  FaWineGlassAlt,
  FaUtensils,
  FaLocationArrow
} from 'react-icons/fa';
import '../styles/HomePage.css';
import Button from '../components/Button';
import CustomInput from '../components/CustomInput';
import LoginPopup from '../components/HomePageComponents/LoginPopup';
import ConfirmationPopup from '../components/HomePageComponents/ConfirmationPopup';
import RegisterEmailPopup from '../components/HomePageComponents/RegisterEmailPopup';
import SetPasswordPopup from '../components/HomePageComponents/SetPasswordPopup';
import RestaurantList from '../components/HomePageComponents/RestaurantList';
import { getFeaturedRestaurants, getRestaurants } from '../services/restaurantService';
import axios from "axios";

const HomePage = () => {
    // Auth and registration state
    const [showPopup, setShowPopup] = useState(false);
    const [showSecondPopup, setShowSecondPopup] = useState(false);
    const [showThirdPopup, setShowThirdPopup] = useState(false);
    const [showFourthPopup, setShowFourthPopup] = useState(false);
    const [selectedTab, setSelectedTab] = useState('user');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerName, setRegisterName] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerPasswordControl, setRegisterPasswordControl] = useState('');
    const [confirmationCode, setConfirmationCode] = useState('');
    const [error, setError] = useState('');
    const [userLoginEmail, setUserLoginEmail] = useState('');
    const [userLoginPassword, setUserLoginPassword] = useState('');
    const [ownerLoginEmail, setOwnerLoginEmail] = useState('');
    const [ownerLoginPassword, setOwnerLoginPassword] = useState('');
    const [token, setToken] = useState('');
    const [errors, setErrors] = useState({
        email: '',
        password: '',
        ownerEmail: '',
        ownerPassword: ''
    });
    
    // Search and filter state
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [activeFilters, setActiveFilters] = useState({});
    const [isSearching, setIsSearching] = useState(false);

    // Location state
    const [userLocation, setUserLocation] = useState(null);
    const [locationStatus, setLocationStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
    
    // Featured restaurants
    const [featuredRestaurants, setFeaturedRestaurants] = useState([]);
    const [isLoadingFeatured, setIsLoadingFeatured] = useState(true);
    
    // Expose this component instance to be accessed by Navbar
    useEffect(() => {
        // Bileşeni global olarak erişilebilir yap
        window.homePageInstance = {
            openLoginPopup: openPopup
        };
        
        // Cleanup: Component unmount olduğunda referansı temizle
        return () => {
            window.homePageInstance = null;
        };
    }, []);
    
    // Get user location when component mounts
    useEffect(() => {
        getUserLocation();
        loadFeaturedRestaurants();
    }, []);
    
    // Load featured restaurants
    const loadFeaturedRestaurants = async () => {
        try {
            setIsLoadingFeatured(true);
            const data = await getFeaturedRestaurants();
            setFeaturedRestaurants(data);
        } catch (err) {
            console.error('Error loading featured restaurants:', err);
        } finally {
            setIsLoadingFeatured(false);
        }
    };
    
    // Get user's geolocation
    const getUserLocation = () => {
        if (navigator.geolocation) {
            setLocationStatus('loading');
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                    setLocationStatus('success');
                },
                (error) => {
                    console.error('Error getting user location:', error);
                    setLocationStatus('error');
                }
            );
        } else {
            setLocationStatus('error');
            console.error('Geolocation is not supported by this browser.');
        }
    };
    
    // Handle search submission
    const handleSearch = async (e) => {
        e.preventDefault();
        
        if (!searchTerm.trim()) return;
        
        try {
            setIsSearching(true);
            const results = await getRestaurants({ 
                searchTerm: searchTerm,
                ...activeFilters
            });
            setSearchResults(results);
        } catch (err) {
            console.error('Error searching restaurants:', err);
        } finally {
            setIsSearching(false);
        }
    };
    
    // Clear search results
    const clearSearch = () => {
        setSearchTerm('');
        setSearchResults([]);
        setActiveFilters({});
    };

    // Handle filter click
    const handleFilterClick = (filter) => {
        setSelectedFilter(filter);
        
        // Apply the filter based on the selected category
        let newFilters = {};
        
        switch(filter) {
            case 'all':
                newFilters = {};
                break;
            case 'wine':
                newFilters = { tag: 'wine' };
                break;
            case 'pizza':
                newFilters = { tag: 'pizza' };
                break;
            case 'coffee':
                newFilters = { tag: 'coffee' };
                break;
            case 'burger':
                newFilters = { tag: 'burgers' };
                break;
            case 'cafe':
                newFilters = { tag: 'cafe' };
                break;
            case 'promo':
                newFilters = { hasActivePromo: true };
                break;
            default:
                newFilters = {};
        }
        
        setActiveFilters(newFilters);
    };

    // Login and registration functions
    const handleGoBack = () => {
        setShowThirdPopup(false);
        setShowPopup(true);
    };

    const handleSelectUser = () => setSelectedTab('user');
    const handleSelectOwner = () => setSelectedTab('owner');

    // Popup management
    const openPopup = () => {
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
        resetForm();
    };

    const openSecondPopup = () => {
        setShowSecondPopup(true);
        setShowThirdPopup(false);
    };

    const closeSecondPopup = () => {
        setShowSecondPopup(false);
        resetForm();
    };

    const openThirdPopUp = () => {
        setShowThirdPopup(true);
        setShowPopup(false);
    };

    const closeThirdPopup = () => {
        setShowThirdPopup(false);
        resetForm();
    };

    const openFourthPopup = () => {
        setShowFourthPopup(true);
        setShowSecondPopup(false);
    };

    const closeFourthPopup = () => {
        setShowFourthPopup(false);
        resetForm();
    };

    const resetForm = () => {
        setUserLoginEmail('');
        setUserLoginPassword('');
        setOwnerLoginEmail('');
        setOwnerLoginPassword('');
        setRegisterName('');
        setRegisterEmail('');
        setRegisterPassword('');
        setRegisterPasswordControl('');
        setConfirmationCode('');
        setErrors({
            userEmail: '',
            userPassword: '',
            ownerEmail: '',
            ownerPassword: ''
        });
        setError('');
    };

    // Email validation
    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    // Registration flow
    const handleRegister = async () => {
        if (!validateEmail(registerEmail)) {
            alert("Lütfen geçerli bir e-posta adresi girin.");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:8080/api/auth/send-verification-code",
                { email: registerEmail.trim() }
            );
            setError('');
            openSecondPopup();

        } catch (err) {
            console.error("Kayıt hatası:", err);

            // Eğer kullanıcı daha önce doğrulanmamışsa uyar ve popupı aç
            if (err.response && err.response.data && err.response.data.message) {
                if (err.response.data.message.includes("User is not verified")) {
                    setError('E-Postanı henüz doğrulamamışsın. Yeni kod e-postana yollandı.');
                    openSecondPopup();
                } else {
                    alert('E-posta gönderilemedi: ' + err.response.data.message);
                }
            } else if (err.message) {
                alert('E-posta gönderilemedi: ' + err.message);
            } else {
                alert('E-posta gönderilemedi: Bilinmeyen bir hata oluştu.');
            }
        }
    };

    // Password validation
    const checkEqual = () => {
        if (registerPassword !== registerPasswordControl) {
            setError('Şifreler eşleşmelidir.');
            return;
        }

        if (registerPassword.trim() === '') {
            setError('Şifre alanı boş bırakılamaz.');
            return;
        }

        if (registerPassword.length < 6) {
            setError('Şifre en az 6 karakter olmalıdır.');
            return;
        }

        if (registerPasswordControl.trim() === '') {
            setError('Şifre tekrar alanı boş bırakılamaz.');
            return;
        }

        handleSetPassword();
        setError('');
        closeFourthPopup();
    };

    // Verification code handling
    const handleConfirmationCodeClick = async () => {
        if (!confirmationCode.trim()) {
            setError('Doğrulama kodu boş bırakılamaz.');
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:8080/api/auth/verify-verification-code",
                {
                    email: registerEmail.trim(),
                    token: confirmationCode.trim(),
                }
            );

            setToken(response.data.token);
            setError('');
            openFourthPopup();
        } catch (err) {
            const msg = err.response?.data?.message || err.message;
            setError('Doğrulama başarısız: ' + msg);
            console.error(err);
        }
    };

    // User login
    const handleUserLogin = async () => {
        let newErrors = {};

        if (userLoginEmail.trim() === '') {
            newErrors.email = 'E-posta alanı boş bırakılamaz.';
        }

        if (userLoginPassword.trim() === '') {
            newErrors.password = 'Şifre alanı boş bırakılamaz.';
        }
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        
        try {
            const response = await axios.post(
                "http://localhost:8080/api/auth/login",
                {
                    email: userLoginEmail.trim(),
                    password: userLoginPassword.trim()
                }
            );
            const { access_token, refresh_token, user } = response.data;
            console.log('Kullanıcı girişi başarılı');
            
            // Store tokens in localStorage for later use
            localStorage.setItem('token', access_token);
            localStorage.setItem('refreshToken', refresh_token);
            localStorage.setItem('user', JSON.stringify(user));
            
            closePopup();
        } catch(err) {
            const msg = err.response?.data?.message || err.message;
            setError('Giriş başarısız: ' + msg);
            console.error(err);
        }
    };

    // Owner login
    const handleOwnerLogin = async () => {
        let newErrors = {};

        if (ownerLoginEmail.trim() === '') {
            newErrors.ownerEmail = 'İşletme e-posta alanı boş bırakılamaz.';
        }

        if (ownerLoginPassword.trim() === '') {
            newErrors.ownerPassword = 'İşletme şifre alanı boş bırakılamaz.';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        
        try {
            const response = await axios.post(
                "http://localhost:8080/api/auth/login",
                {
                    email: ownerLoginEmail.trim(),
                    password: ownerLoginPassword.trim()
                }
            );
            
            const { access_token, refresh_token, user } = response.data;
            
            // Store tokens in localStorage for later use
            localStorage.setItem('token', access_token);
            localStorage.setItem('refreshToken', refresh_token);
            localStorage.setItem('user', JSON.stringify(user));
            
            console.log('İşletme girişi başarılı');
            closePopup();
        } catch(err) {
            const msg = err.response?.data?.message || err.message;
            setError('Giriş başarısız: ' + msg);
            console.error(err);
        }
    };

    // Set user password
    const handleSetPassword = async () => {
        try {
            const email = registerEmail.trim();
            const password = registerPassword.trim();
            const response = await axios.post(
                "http://localhost:8080/api/auth/update-user",
                {
                    email: email,
                    password: password,
                    role: "diner_user"
                }
            );
            setError("");
            
            // Auto login after successful registration
            try {
                const loginResponse = await axios.post(
                    "http://localhost:8080/api/auth/login",
                    {
                        email: email,
                        password: password
                    }
                );
                
                const { access_token, refresh_token, user } = loginResponse.data;
                
                // Store tokens in localStorage for later use
                localStorage.setItem('token', access_token);
                localStorage.setItem('refreshToken', refresh_token);
                localStorage.setItem('user', JSON.stringify(user));
                
                console.log('Otomatik giriş başarılı');
            } catch (loginErr) {
                console.error('Otomatik giriş başarısız:', loginErr);
                // Otomatik giriş hatasını göstermeyin
            }
            
        } catch(error) {
            console.error('Şifre ayarlama hatası:', error);
            setError("Şifre ayarlama sırasında bir hata oluştu.");
        }
    };

    return (
        <div className="app-container">
            {/* Hidden popups that will be shown when triggered */}
            <LoginPopup
                isOpen={showPopup}
                onClose={closePopup}
                selectedTab={selectedTab}
                handleSelectUser={handleSelectUser}
                handleSelectOwner={handleSelectOwner}
                userLoginEmail={userLoginEmail}
                setUserLoginEmail={setUserLoginEmail}
                userLoginPassword={userLoginPassword}
                setUserLoginPassword={setUserLoginPassword}
                ownerLoginEmail={ownerLoginEmail}
                setOwnerLoginEmail={setOwnerLoginEmail}
                ownerLoginPassword={ownerLoginPassword}
                setOwnerLoginPassword={setOwnerLoginPassword}
                errors={errors}
                handleUserLogin={handleUserLogin}
                handleOwnerLogin={handleOwnerLogin}
                openThirdPopUp={openThirdPopUp}
            />

            <ConfirmationPopup
                isOpen={showSecondPopup}
                onClose={closeSecondPopup}
                confirmationCode={confirmationCode}
                setConfirmationCode={setConfirmationCode}
                error={error}
                onConfirm={handleConfirmationCodeClick}
            />

            <RegisterEmailPopup
                isOpen={showThirdPopup}
                onClose={closeThirdPopup}
                registerEmail={registerEmail}
                setRegisterEmail={setRegisterEmail}
                onSendCode={handleRegister}
                onBack={handleGoBack}
            />

            <SetPasswordPopup
                isOpen={showFourthPopup}
                onClose={closeFourthPopup}
                registerPassword={registerPassword}
                setRegisterPassword={setRegisterPassword}
                registerPasswordControl={registerPasswordControl}
                setRegisterPasswordControl={setRegisterPasswordControl}
                error={error}
                onSubmit={checkEqual}
            />

            <main className="main-content">
                {/* Hero Section */}
                <section className="hero-section">
                    <div className="hero-content">
                        <h1 className="hero-title">Mükemmel Yemek Deneyimini Keşfedin</h1>
                        <p className="hero-subtitle">
                            Gerçek zamanlı promosyonlarla restoranları ve kafeleri bulun, rezervasyon yapın ve yeni favoriler keşfedin.
                        </p>
                        
                        <form className="hero-search-form" onSubmit={handleSearch}>
                            <div className="search-wrapper">
                                <FaSearch className="search-icon" />
                                <input
                                    type="text"
                                    className="search-input"
                                    placeholder="Restoran, mutfak veya konum ara..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <button type="submit" className="search-btn">Ara</button>
                            
                            {locationStatus === 'success' && (
                                <div className="location-badge">
                                    <FaLocationArrow />
                                    <span>Konumunuz kullanılıyor</span>
                                </div>
                            )}
                            
                            {locationStatus === 'error' && (
                                <button 
                                    type="button" 
                                    className="location-btn"
                                    onClick={getUserLocation}
                                >
                                    <FaLocationArrow /> Konumumu kullan
                                </button>
                            )}
                        </form>
                    </div>
                    <div className="hero-overlay"></div>
                </section>

                {/* Category Filter Pills */}
                <div className="category-filter-container">
                    <div className="category-filters">
                        <button 
                            className={`category-pill ${selectedFilter === 'all' ? 'active' : ''}`}
                            onClick={() => handleFilterClick('all')}
                        >
                            <FaUtensils className="category-icon" />
                            <span>Tümü</span>
                        </button>
                        
                        <button 
                            className={`category-pill ${selectedFilter === 'promo' ? 'active' : ''}`}
                            onClick={() => handleFilterClick('promo')}
                        >
                            <span className="promo-badge-small">%</span>
                            <span>Promosyonlar</span>
                        </button>
                        
                        <button 
                            className={`category-pill ${selectedFilter === 'cafe' ? 'active' : ''}`}
                            onClick={() => handleFilterClick('cafe')}
                        >
                            <FaCoffee className="category-icon" />
                            <span>Kafeler</span>
                        </button>
                        
                        <button 
                            className={`category-pill ${selectedFilter === 'pizza' ? 'active' : ''}`}
                            onClick={() => handleFilterClick('pizza')}
                        >
                            <FaPizzaSlice className="category-icon" />
                            <span>Pizza</span>
                        </button>
                        
                        <button 
                            className={`category-pill ${selectedFilter === 'burger' ? 'active' : ''}`}
                            onClick={() => handleFilterClick('burger')}
                        >
                            <FaHamburger className="category-icon" />
                            <span>Burgerler</span>
                        </button>
                        
                        <button 
                            className={`category-pill ${selectedFilter === 'wine' ? 'active' : ''}`}
                            onClick={() => handleFilterClick('wine')}
                        >
                            <FaWineGlassAlt className="category-icon" />
                            <span>Şarap & Akşam Yemeği</span>
                        </button>
                    </div>
                </div>

                {/* Search Results (if any) */}
                {searchResults.length > 0 && (
                    <section className="search-results-section">
                        <div className="search-header">
                            <h2>
                                Arama Sonuçları
                                <span className="result-count">{searchResults.length} sonuç</span>
                            </h2>
                            <button className="clear-search-btn" onClick={clearSearch}>
                                Aramayı Temizle
                            </button>
                        </div>
                        
                        <div className="restaurant-grid">
                            {searchResults.map(restaurant => (
                                <Link 
                                    to={`/restaurant/${restaurant.id}`} 
                                    className="restaurant-card" 
                                    key={restaurant.id}
                                >
                                    <div className="card-header">
                                        <img src={restaurant.image} alt={restaurant.name} className="restaurant-img" />
                                        {restaurant.hasActivePromo && (
                                            <div className="promo-tag">
                                                <FaStar className="promo-icon" />
                                                <span>Promotion</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="card-body">
                                        <h3 className="restaurant-title">{restaurant.name}</h3>
                                        <div className="restaurant-details">
                                            <span className="restaurant-type">{restaurant.type}</span>
                                            <div className="distance">
                                                <FaMapMarkerAlt className="location-icon" />
                                                <span>{restaurant.distance}</span>
                                            </div>
                                        </div>
                                        <div className="rating-container">
                                            <FaStar className="star-icon" />
                                            <span className="rating-value">{restaurant.rating}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Featured Restaurants Section */}
                {featuredRestaurants.length > 0 && !isLoadingFeatured && (
                    <section className="featured-section">
                        <h2 className="section-heading">Öne Çıkan Restoranlar</h2>
                        <div className="featured-cards">
                            {featuredRestaurants.map(restaurant => (
                                <Link 
                                    to={`/restaurant/${restaurant.id}`} 
                                    className="restaurant-card featured" 
                                    key={restaurant.id}
                                >
                                    <div className="card-header">
                                        <img src={restaurant.image} alt={restaurant.name} className="restaurant-img" />
                                        {restaurant.hasActivePromo && (
                                            <div className="promo-tag">
                                                <FaStar className="promo-icon" />
                                                <span>{restaurant.promoDetails}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="card-body">
                                        <div className="card-top">
                                            <h3 className="restaurant-title">{restaurant.name}</h3>
                                            <span className="price-range">{restaurant.priceRange}</span>
                                        </div>
                                        <div className="restaurant-details">
                                            <span className="restaurant-type">{restaurant.type}</span>
                                            <div className="distance">
                                                <FaMapMarkerAlt className="location-icon" />
                                                <span>{restaurant.distance}</span>
                                            </div>
                                        </div>
                                        <div className="rating-container">
                                            <FaStar className="star-icon" />
                                            <span className="rating-value">{restaurant.rating}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* All Restaurants Section */}
                <section className="all-restaurants-section">
                    <RestaurantList 
                        title="Restoranları Keşfedin" 
                        filters={activeFilters} 
                        useGrid={true} 
                    />
                </section>
            </main>
            
            <footer className="app-footer">
                <div className="footer-content">
                    <div className="footer-logo">
                        <h2>FeastFine</h2>
                        <p>Yeni favori yemek deneyiminizi keşfedin</p>
                    </div>
                    
                    <div className="footer-links">
                        <div className="footer-section">
                            <h3>Keşfet</h3>
                            <ul>
                                <li><Link to="/">Ana Sayfa</Link></li>
                                <li><Link to="/favorites">Favoriler</Link></li>
                                <li><Link to="/restaurants">Tüm Restoranlar</Link></li>
                                <li><Link to="/promotions">Promosyonlar</Link></li>
                            </ul>
                        </div>
                        
                        <div className="footer-section">
                            <h3>Hakkında</h3>
                            <ul>
                                <li><Link to="/about">Hakkımızda</Link></li>
                                <li><Link to="/contact">İletişim</Link></li>
                                <li><Link to="/privacy">Gizlilik Politikası</Link></li>
                                <li><Link to="/terms">Kullanım Koşulları</Link></li>
                            </ul>
                        </div>
                        
                        <div className="footer-section">
                            <h3>Restoran Sahipleri</h3>
                            <ul>
                                <li><Link to="/restaurant-signup">Restoranınızı Ekleyin</Link></li>
                                <li><Link to="/business-login">İşletme Girişi</Link></li>
                                <li><Link to="/promotions-guide">Promosyon Oluşturma</Link></li>
                                <li><Link to="/help">Yardım Merkezi</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} FeastFine. Tüm hakları saklıdır.</p>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;