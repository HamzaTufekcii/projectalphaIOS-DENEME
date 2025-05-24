// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Link,useNavigate } from 'react-router-dom';
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

import LoginPopup from '../components/HomePageComponents/LoginPopup';
import ConfirmationPopup from '../components/HomePageComponents/ConfirmationPopup';
import RegisterEmailPopup from '../components/HomePageComponents/RegisterEmailPopup';
import SetPasswordPopup from '../components/HomePageComponents/SetPasswordPopup';
import RestaurantList from '../components/HomePageComponents/RestaurantList';

// Business service methods
import {mapBusiness} from "../utils/businessMapper.js";
import {
    getTopRated,
    searchBusinesses
} from '../services/businessService';
import { login, saveAuthData } from '../services/authService';
import axios from 'axios';
import { getUserIdFromStorage, getUserRoleFromStorage, fetchUserData } from '../services/userService';

const HomePage = () => {
    // Authentication & registration state
    const [showPopup, setShowPopup] = useState(false);
    const [showSecondPopup, setShowSecondPopup] = useState(false);
    const [showThirdPopup, setShowThirdPopup] = useState(false);
    const [showFourthPopup, setShowFourthPopup] = useState(false);
    const [selectedTab, setSelectedTab] = useState('user');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerPasswordControl, setRegisterPasswordControl] = useState('');
    const [confirmationCode, setConfirmationCode] = useState('');
    const [error, setError] = useState('');
    const [userLoginEmail, setUserLoginEmail] = useState('');
    const [userLoginPassword, setUserLoginPassword] = useState('');
    const [ownerLoginEmail, setOwnerLoginEmail] = useState('');
    const [ownerLoginPassword, setOwnerLoginPassword] = useState('');
    const [errors, setErrors] = useState({});

    // Search & filter state
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [activeFilters, setActiveFilters] = useState({});
    const [isSearching, setIsSearching] = useState(false);

    // Location state
    const [userLocation, setUserLocation] = useState(null);
    const [locationStatus, setLocationStatus] = useState('idle');

    // Featured (top-rated) restaurants
    const [featuredRestaurants, setFeaturedRestaurants] = useState([]);
    const [isLoadingFeatured, setIsLoadingFeatured] = useState(true);
    const navigate = useNavigate();

    // Make component accessible globally (e.g., for Navbar)
    useEffect(() => {
        window.homePageInstance = { openLoginPopup: openPopup };
        return () => { window.homePageInstance = null; };
    }, []);

    // On mount: get location & load featured
    useEffect(() => {
        getUserLocation();
        loadFeaturedRestaurants();
    }, []);

    /** Load top-rated restaurants */
    const loadFeaturedRestaurants = async () => {
        try {
            setIsLoadingFeatured(true);
            const raw = await getTopRated(5);
            const mapped = raw.map(mapBusiness);
            setFeaturedRestaurants(mapped);
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

    /** Handle search submission */
    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;

        try {
            setIsSearching(true);
            let results = await searchBusinesses(searchTerm);
            // Apply extra filters client-side
            if (activeFilters.hasActivePromo) {
                results = results.filter(r => r.hasActivePromo);
            }
            if (activeFilters.tag) {
                results = results.filter(r => r.type.toLowerCase().includes(activeFilters.tag));
            }
            setSearchResults(results);
        } catch (err) {
            console.error('Error searching restaurants:', err);
        } finally {
            setIsSearching(false);
        }
    };

    /** Clear search */
    const clearSearch = () => {
        setSearchTerm('');
        setSearchResults([]);
        setActiveFilters({});
        setSelectedFilter('all');
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
        resetForm();
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
        //setRegisterName('');
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
                }if(err.response.data.message.includes("Email is already registered")) {
                    alert('Bu e-posta ile oluşturulmuş bir hesap mevcut.');
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

            setError('');
            openFourthPopup();
        } catch (err) {
            const msg = err.response?.data?.message || err.message;
            if (err.response.data.message.includes("Verification code is incorrect")) {
                setError('Onay kodu yanlış girildi. Lütfen tekrar deneyin.');
            } else {
                setError('Doğrulama başarısız: ' + msg);
            }
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

            const role = "diner_user";
            const authData = await login(userLoginEmail, userLoginPassword, role);
            console.log('Kullanıcı girişi başarılı');

            // Store tokens using authService
            saveAuthData(authData);
            closePopup();

            localStorage.setItem("shouldRunAfterReload", "true");

            await getUser(role);

        } catch (err) {
            console.error("Giriş hatası:", err);

            const message = err?.response?.data?.message || err?.message || '';

            if (message.includes("Invalid login credentials")) {
                setErrors({ password: 'Şifrenizi hatalı girdiniz.' });
            } else if (message.includes("User not found")) {
                setErrors({ password: 'Böyle bir kullanıcı bulunmamaktadır.' });
            } else if (message.includes("Wrong role")) {
                setErrors({ ownerLoginPassword: 'Bu kullanıcı girişi içindir. Lütfen işletme girişiyle giriniz.' });
            } else {
                alert('Giriş başarısız: ' + message);
            }
        }
    };

        const getUser = async (role) => {
            if (localStorage.getItem("shouldRunAfterReload") === "true") {
                localStorage.removeItem("shouldRunAfterReload");

                await fetchUserData(getUserRoleFromStorage(), getUserIdFromStorage());
                if(role === 'diner_user'){
                    window.location.reload();
                } else if (role === 'owner_user') {
                    navigate('/owner-dashboard');
                }

            }
        }

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
            const role = "owner_user";
            const authData = await login(ownerLoginEmail, ownerLoginPassword, role);

            // Store tokens using authService
            saveAuthData(authData);
            closePopup();

            console.log('İşletme girişi başarılı');
            closePopup();

            localStorage.setItem("shouldRunAfterReload", "true");

            await getUser(role);

        } catch (err) {
            console.error("Giriş hatası:", err);

            const message = err?.response?.data?.message || err?.message || '';

            if (message.includes("Invalid login credentials")) {
                setErrors({ ownerPassword: 'Şifrenizi hatalı girdiniz.' });
            } else if (message.includes("User not found")) {
                setErrors({ ownerPassword: 'Böyle bir kullanıcı bulunmamaktadır.' });
            } else if (message.includes("Wrong role")) {
                setErrors({ ownerPassword: 'Bu kullanıcı girişi içindir. Lütfen işletme girişiyle giriniz.' });
            } else {
                alert('Giriş başarısız: ' + message);
            }
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
                error={error}
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
                error={error}
                errors={error}
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

            <main>
                {/* Hero Section (tam genişlik) */}
                <section className="hero-section">
                    <div className="hero-content">
                        <h1 className="hero-title">Mükemmel Yemek Deneyimini Keşfedin</h1>
                        <p className="hero-subtitle">
                            Gerçek zamanlı promosyonlarla restoranları ve kafeleri bulun, rezervasyon
                            yapın ve yeni favoriler keşfedin.
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

                {/* — HERO BİTİŞİ — */}

                <div className="main-content">
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
                                            <img
                                                src={restaurant.image}
                                                alt={restaurant.name}
                                                className="restaurant-img"
                                            />
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
                                                {restaurant.address && (
                                                    <div className="location">
                                                        <FaMapMarkerAlt className="location-icon" />
                                                        <span>
                        {restaurant.address.city}, {restaurant.address.district}
                      </span>
                                                    </div>
                                                )}
                                                {restaurant.tags && restaurant.tags.length > 0 && (
                                                    <div className="tag-list">
                                                        {restaurant.tags.map(tag => (
                                                            <span key={tag.id} className="tag">
                          {tag.name.trim()}
                        </span>
                                                        ))}
                                                    </div>
                                                )}
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
                </div>
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