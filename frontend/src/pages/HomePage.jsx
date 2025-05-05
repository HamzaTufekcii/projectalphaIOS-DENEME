// src/pages/HomePage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaSearch, FaFilter, FaMapMarkerAlt, FaHeart, FaRegHeart, FaPizzaSlice, FaCoffee, FaHamburger, FaWineGlassAlt } from 'react-icons/fa';
import '../styles/HomePage.css';
import Popup from '../components/Popup';
import Button from '../components/Button';
import { FaEnvelope } from 'react-icons/fa';
import CustomInput from '../components/CustomInput';
import LoginPopup from '../components/HomePageComponents/LoginPopup';
import ConfirmationPopup from '../components/HomePageComponents/ConfirmationPopup';
import RegisterEmailPopup from '../components/HomePageComponents/RegisterEmailPopup';
import SetPasswordPopup from '../components/HomePageComponents/SetPasswordPopup';
import RestaurantList from '../components/HomePageComponents/RestaurantList';
import axios from "axios";


const HomePage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('');
    const [favorites, setFavorites] = useState([2, 4]);
    const [showPopup, setShowPopup] = useState(false);
    const [showSecondPopup, setShowSecondPopup] = useState(false);
    const [showThirdPopup, setShowThirdPopup] = useState(false);
    const [showFourthPopup, setShowFourthPopup] = useState(false);
    const [registerEmail, setRegisterEmail] = useState(''); //kullanıcının kaydolurken girdiği mail
    const [registerName, setRegisterName] = useState('');   // Kullanıcının girdiği isim
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerPasswordControl, setRegisterPasswordControl] = useState('');
    const [selectedTab, setSelectedTab] = useState('user');
    const [inputValue, setInputValue] = useState('');
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

    const handleGoBack = () => {
        setShowThirdPopup(false);
        setShowPopup(true);
    };


    const featuredRestaurants = [
        { id: 1, name: "Sardunya", type: "Wine House", distance: "0.5 miles away", rating: 4.5, image: "https://static.wixstatic.com/media/91a1e5_da596005b0d64069b04f0ba1fa7bde51~mv2.jpg/v1/fill/w_442,h_589,q_90,enc_avif,quality_auto/91a1e5_da596005b0d64069b04f0ba1fa7bde51~mv2.jpg" },
        { id: 2, name: "Botanica", type: "Fine Dining", distance: "1.2 miles away", rating: 4.0, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSus3XssJfNT4VBjmkZmrdiRKSYfbwy7kjquw&s" }
    ];

    const allRestaurants = [
        { id: 3, name: "Naya", type: "Fine Dining", distance: "0.3 miles away", rating: 4.7, image: "https://profitnesetgune.com/wp-content/uploads/2023/06/1-6-scaled.jpg" },
        { id: 4, name: "The Soul", type: "Pub", distance: "0.7 miles away", rating: 4.6, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_d-yhdv2ZkhWp-sj5d2DLDZ76nOk7RAdGNQ&s" },
        { id: 5, name: "Olive Garden", type: "Italian", distance: "1.0 miles away", rating: 4.3, image: "https://parade.com/.image/t_share/MjEzNzg3ODkwNjU4ODQ2MTU5/olive-garden-exterior.jpg" },
        { id: 6, name: "Spice Route", type: "Indian", distance: "0.8 miles away", rating: 4.4, image: "https://social.massimodutti.com/paper/wp-content/uploads/2020/09/The-Spice-Route-2.jpg" }
    ];

    const handleFilterClick = (filter) => {
        setSelectedFilter(filter);
    };

    const toggleFavorite = (id, e) => {
        e.preventDefault();
        e.stopPropagation();
        if (favorites.includes(id)) {
            setFavorites(favorites.filter(fav => fav !== id));
        } else {
            setFavorites([...favorites, id]);
        }
    };


    const handleSelectUser = () => setSelectedTab('user');
    const handleSelectOwner = () => setSelectedTab('owner');

    const handleInputValue = () => {
        if (inputValue.trim() === '') {
            alert("Alan boş bırakılamaz!");
        }
    }

    //pop up işlemleri başlangıç
    const openPopup = () => {
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
        resetForm();
    };

    const openSecondPopup = () => {
        setShowSecondPopup(true);
        setShowThirdPopup(false); // İstersen ilk popup kapanır, ikincisi açılır

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

    const resetForm = () => {  //popup kapandığında bilgilerin resetlenmesi
        // Kullanıcı giriş bilgileri
        setUserLoginEmail('');
        setUserLoginPassword('');

        // İşletme giriş bilgileri
        setOwnerLoginEmail('');
        setOwnerLoginPassword('');

        // Kayıt bilgileri
        setRegisterName('');
        setRegisterEmail('');

        // Şifre oluşturma bilgileri
        setRegisterPassword('');
        setRegisterPasswordControl('');

        // Onay kodu
        setConfirmationCode('');

        // Hatalar
        setErrors({
            userEmail: '',
            userPassword: '',
            ownerEmail: '',
            ownerPassword: ''
        });

        setError('');
    };


    //pop-up bitiş

    //mail geçerlilik kontrolü
    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleRegister = async () => {
        if (!validateEmail(registerEmail)) {
            alert("Lütfen geçerli bir email adresi giriniz.");
        }

        try{
             // boşlukları temizle
            const response = await axios.post(
                "http://localhost:8080/api/auth/send-verification-code",
                {
                email: registerEmail.trim()
                }
            );
            setError('');
            openSecondPopup();

        } catch (err) {
            const msg = err.response?.data || err.message;
            alert('E-posta gönderilemedi: ' + msg);
            console.error(err);
        }
    };

    //şifre belirlemede girilen iki şifrenin birbirine eşit olup olmadığının kontrlu
    const checkEqual = () => {
        // Şifre eşit mi kontrolü
        if (registerPassword !== registerPasswordControl) {
            setError('Girilen şifreler birbiriyle aynı olmalıdır.');
            return;
        }

        // Şifre boş mu kontrolü
        if (registerPassword.trim() === '') {
            setError('*Şifre alanı boş bırakılamaz.');
            return;
        }

        // Şifre minimum 6 karakter mi?
        if (registerPassword.length < 6) {
            setError('*Şifre en az 6 karakter olmalıdır.');
            return;
        }

        // Şifre tekrar alanı boş mu kontrolü
        if (registerPasswordControl.trim() === '') {
            setError('*Şifre tekrarı alanı boş bırakılamaz.');
            return;
        }

        handleSetPassword();
        setError('');
        closeFourthPopup();
    };

    const handleConfirmationCodeClick = async () => {
        // 2️⃣ Boş kod kontrolü
        if (!confirmationCode.trim()) {
            setError('*Onay kodu boş bırakılamaz.');
            return;
        }

        try {
            // 3️⃣ Doğrulama isteğini await ile yap, ve sadece başarılıysa devam et
            const response = await axios.post(
                "http://localhost:8080/api/auth/verify-verification-code",
                {
                    email: registerEmail.trim(),         // mutlaka .trim() ile kesin email gönder
                    token: confirmationCode.trim(),      // backend’in beklediği alan adı ‘token’
                }
            );

            // 4️⃣ Başarılıysa token’ı state’e al, hata mesajını temizle
            setToken(response.data.token);
            setError('');

            // 5️⃣ Sadece burada openFourthPopup() çağır: hata yoksa şifre ekranına geç
            openFourthPopup();

        } catch (err) {
            // 6️⃣ Hata varsa kullanıcıya göster, popup’ı açma
            const msg = err.response?.data?.message || err.message;
            setError('Doğrulama hatalı: ' + msg);
            console.error(err);
        }
    };

    const handleUserLogin = async () => {
        let newErrors = {};

        if (userLoginEmail.trim() === '') {
            newErrors.email = '*Email alanı boş bırakılamaz.';
        }

        if (userLoginPassword.trim() === '') {
            newErrors.password = '*Şifre alanı boş bırakılamaz.';
        }
        try{
            const response = await axios.post(
                "http://localhost:8080/api/auth/login",
                {
                    email: userLoginEmail.trim(),
                    password: userLoginPassword.trim()
                }
            );
            const { access_token, refresh_token, user } = response.data;
            console.log('Kullanıcı girişi başarılı');
            closePopup();
        } catch(err) {
            const msg = err.response?.data?.message || err.message;
            setError('Giriş yapılamadı: ' + msg);
            console.error(err);
        }




    };

    const handleOwnerLogin = () => {
        let newErrors = {};

        if (ownerLoginEmail.trim() === '') {
            newErrors.ownerEmail = '*İşletme email alanı boş bırakılamaz.';
        }

        if (ownerLoginPassword.trim() === '') {
            newErrors.ownerPassword = '*İşletme şifre alanı boş bırakılamaz.';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            console.log('İşletme girişi başarılı');
            closePopup();
        }
    };


    const handleSetPassword = async () => {
        try {
            const email = registerEmail.trim();
            const password = registerPassword.trim();

            const response = await axios.post(
                "http://localhost:8080/api/auth/set-password",
                {
                    email: email,
                    password: password,
                }
            );
            setError("");
        } catch(error) {
            setError("Şifre belirlenirken bir hata oluştu.");
        }
    };

    const login = async () => {
        const email = userLoginEmail.trim();
        const password = userLoginPassword.trim();

        try{
            const response = await axios.post(
                "http://localhost:8080/api/auth/login",
                {
                    email,
                    password
                }
            );
            const {access_token, refresh_token, user } = response.data;
        } catch(error) {

        }
    };

    return (
        <div className="app-container">
            <header className="app-header">
                <div className="header-content">
                    <h1 className="site-title">Home</h1>
                    <nav className="main-nav">
                        <Link to="/" className="nav-item active">Home</Link>
                        <Link to="/favorites" className="nav-item">Favorites</Link>
                        <div>

                            <Button text="Login" onClick={openPopup} ></Button>


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

                            {/* İkinci Popup */}


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

                        </div>

                    </nav>
                </div>
            </header>

            <main className="main-content">
                <div className="search-container">
                    <div className="search-wrapper">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="filter-btn">
                        Filters
                        <FaFilter />
                    </button>
                </div>

                <div className="filter-container">
                    <div className="search-filters">
                        <button onClick={() => handleFilterClick('all')} >
                            <span style={{ color: selectedFilter === 'all' ? 'tomato' : 'gray', fontSize: '18px' }}>
                                ALL
                            </span>
                        </button>

                        <button onClick={() => handleFilterClick('alcohol')}>
                            <FaWineGlassAlt size={30} color={selectedFilter === 'alcohol' ? 'tomato' : 'gray'} />
                        </button>

                        <button onClick={() => handleFilterClick('pizza')}>
                            <FaPizzaSlice size={30} color={selectedFilter === 'pizza' ? 'tomato' : 'gray'} />
                        </button>

                        <button onClick={() => handleFilterClick('coffee')}>
                            <FaCoffee size={30} color={selectedFilter === 'coffee' ? 'tomato' : 'gray'} />
                        </button>
                        <button onClick={() => handleFilterClick('hamburger')}>
                            <FaHamburger size={30} color={selectedFilter === 'hamburger' ? 'tomato' : 'gray'} />
                        </button>

                        <button onClick={() => handleFilterClick('cafes')}>
                            <span style={{ color: selectedFilter === 'cafes' ? 'tomato' : 'gray', fontSize: '18px' }}>
                                Cafes
                            </span>
                        </button>

                        <button onClick={() => handleFilterClick('casual')}>
                            <span style={{ color: selectedFilter === 'casual' ? 'tomato' : 'gray', fontSize: '18px' }}>
                                Casual
                            </span>
                        </button>


                    </div>
                </div>

                {/* Şu an seçili filtreyi gösterelim */}
                <div>

                    <p><strong>Filter:</strong> {selectedFilter}</p>
                </div>

                <section className="featured-section">
                    <h2 className="section-heading">Featured</h2>
                    <div className="featured-cards">
                        {featuredRestaurants.map(restaurant => (
                            <Link to={`/restaurant/${restaurant.id}`} className="restaurant-card" key={restaurant.id}>
                                <div className="card-header">
                                    <img src={restaurant.image} alt={restaurant.name} className="restaurant-img" />
                                    <button className="favorite-btn" onClick={(e) => toggleFavorite(restaurant.id, e)}>
                                        {favorites.includes(restaurant.id) ? (
                                            <FaHeart className="heart-icon favorited" />
                                        ) : (
                                            <FaRegHeart className="heart-icon" />
                                        )}
                                    </button>
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

                <section className="all-restaurants-section">
                    <RestaurantList title="Tüm Restoranlar" />

                </section>
            </main>
        </div>
    );
};

export default HomePage;