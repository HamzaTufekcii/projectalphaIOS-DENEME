// src/pages/HomePage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaSearch, FaFilter, FaMapMarkerAlt, FaHeart, FaRegHeart, FaPizzaSlice, FaCoffee, FaHamburger, FaWineGlassAlt } from 'react-icons/fa';
import '../styles/HomePage.css';
import Popup from '../components/Popup';
import Button from '../components/Button';
import { FaEnvelope } from 'react-icons/fa';
import axios from 'axios';



const HomePage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('');
    const [favorites, setFavorites] = useState([2, 4]);
    const [showPopup, setShowPopup] = useState(false);
    const [showSecondPopup, setShowSecondPopup] = useState(false);
    const [showThirdPopup, setShowThirdPopup] = useState(false);
    const [showFourthPopup, setShowFourthPopup] = useState(false);
    const [registerEmail, setRegisterEmail] = useState(''); //kullanıcının kaydolurken girdiği mail
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

    const handleSendOTP = async () => {
        try {
            const trimmedEmail = registerEmail.trim(); // boşlukları temizle
            const response = await axios.post("http://localhost:8080/api/auth/send-verification-code", {
                email: trimmedEmail // doğru alan adıyla gönder
            });
            alert("Onay kodu gönderildi. Lütfen e-postanızı kontrol ediniz.");
        } catch (error) {
            alert("Bir hata oluştu: " + (error.response?.data?.message || error.message));
        }
    };

        const handleRegister = () => {
        if (!validateEmail(registerEmail)) {
            alert("Lütfen geçerli bir email adresi giriniz.");
        } else {
            handleSendOTP();
            openSecondPopup(); // Eğer email geçerliyse 2. popup'ı açıyoruz
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
        setError('');
        closeFourthPopup();
    };

    const VerifyOtp = async () => {
        const trimmedEmail = registerEmail.trim();
        const trimmedCode = confirmationCode.trim();
        const [token, setToken] = useState("");
        try {
            const response = await axios.post("/api/auth/verify-verification-code", {
                email,
                token: trimmedCode ,
            });
            setToken(response.data.token);
            setError('');
        } catch (error) {
            setError('Doğrulama hatalı: ' + error.response?.data || error.message);
        }
    }

    const handleConfirmationCodeClick = () => {
        if (confirmationCode.trim() === '') {
            setError('*Onay kodu boş bırakılamaz.');
        } else {
            VerifyOtp();
            openFourthPopup();
        }
    };

    const handleUserLogin = () => {
        let newErrors = {};

        if (userLoginEmail.trim() === '') {
            newErrors.email = '*Email alanı boş bırakılamaz.';
        }

        if (userLoginPassword.trim() === '') {
            newErrors.password = '*Şifre alanı boş bırakılamaz.';
        }

        setErrors(newErrors);

        // Eğer hiçbir hata yoksa giriş başarılı
        if (Object.keys(newErrors).length === 0) {
            console.log('Kullanıcı girişi başarılı');
            closePopup();
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

    const handleMailRegister = () => {
            handleRegister(); // Zaten email geçerliliği vs burada kontrol ediliyor
            setError('');
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

                            <Popup isOpen={showPopup} onClose={closePopup}>
                                <div className='popup-container'>
                                    <div className='user-or-owner'>

                                        <div className="user-or-owner-check">
                                            <div className="user-or-owner-check">
                                                <div className="tab-options">
                                                    {/* Hareketli arkaplan */}
                                                    <div className={`tab-background ${selectedTab}`}></div>

                                                    <div
                                                        className={`tab-option ${selectedTab === 'user' ? 'active' : ''}`}
                                                        onClick={handleSelectUser}
                                                    >
                                                        KULLANICI
                                                    </div>
                                                    <div
                                                        className={`tab-option ${selectedTab === 'owner' ? 'active' : ''}`}
                                                        onClick={handleSelectOwner}
                                                    >
                                                        İŞLETME
                                                    </div>
                                                </div>
                                            </div>

                                        </div>

                                        <div />


                                        <div className='middle-content'>
                                            {selectedTab === 'user' && (
                                                <div className="tab-content animate-slide">
                                                    <p>Kullanıcı Girişi</p>
                                                    <input type="email" placeholder="Email"
                                                        name='userLoginMail'
                                                        value={userLoginEmail}
                                                        onChange={(e) => setUserLoginEmail(e.target.value)} />
                                                    {errors.email && <div style={{ color: 'red', fontSize: '12px', marginBottom: "5px", textAlign: "left" }}>{errors.email}</div>}

                                                    <input type="password" placeholder='Şifre'
                                                        name='userLoginPassword'
                                                        value={userLoginPassword}
                                                        onChange={(e) => setUserLoginPassword(e.target.value)} />
                                                    {errors.password && <div style={{ color: 'red', fontSize: '12px', marginBottom: "5px", textAlign: "left" }}>{errors.password}</div>}
                                                    <Button
                                                        text="Giriş Yap"
                                                        onClick={handleUserLogin}
                                                        className='loged-in'
                                                    />
                                                </div>

                                            )}

                                            {selectedTab === 'owner' && (
                                                <div className="tab-content animate-slide">
                                                    <p>İşletme Girişi</p>
                                                    <input type="email" placeholder="İşletme Email" name='ownerLoginMail'
                                                        value={ownerLoginEmail}
                                                        onChange={(e) => setOwnerLoginEmail(e.target.value)} />
                                                    {errors.ownerEmail && <div style={{ color: 'red', fontSize: '12px', marginBottom: "5px", textAlign: "left" }}>{errors.ownerEmail}</div>}
                                                    <input type="password" placeholder='İşletme Şifresi' name='ownerLoginPassword'
                                                        value={ownerLoginPassword}
                                                        onChange={(e) => setOwnerLoginPassword(e.target.value)} />
                                                    {errors.ownerPassword && <div style={{ color: 'red', fontSize: '12px', marginBottom: "5px", textAlign: "left" }}>{errors.ownerPassword}</div>}
                                                    <Button
                                                        text="İşletme Girişi Yap"
                                                        onClick={handleOwnerLogin}
                                                        className='loged-in'
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <div className='popup-footer'>
                                            <p>Hesabın yok mu?</p>
                                            {selectedTab === 'user' && (
                                                <a onClick={openThirdPopUp} className='register'>Kayıt Ol</a>
                                            )}

                                            {selectedTab === 'owner' && (
                                                <Link to="/owner-register" className='register'>Kayıt Ol</Link>
                                            )}

                                        </div>
                                    </div>
                                </div>
                            </Popup>

                            {/* İkinci Popup */}
                            {showSecondPopup && (
                                <Popup isOpen={showSecondPopup} onClose={closeSecondPopup}>
                                    <div className='second-popup-container'>
                                        <h2>Onay Kodu Girişi</h2>
                                        <input type="text" placeholder="Onay Kodunu Giriniz" name='confirmationCode'
                                            value={confirmationCode}
                                            onChange={(e) => setConfirmationCode(e.target.value)} />
                                        {/* HATA MESAJI */}
                                        {error && <div style={{ color: 'red', fontSize: '12px', marginBottom: "5px", textAlign: "left" }}>{error}</div>}
                                        <Button text="Doğrula" onClick={handleConfirmationCodeClick} />
                                    </div>
                                </Popup>
                            )}

                            {showThirdPopup && (
                                <Popup isOpen={showThirdPopup} onClose={closeThirdPopup}>
                                    <div
                                        className="third-popup-container"
                                        style={{
                                            position: 'relative',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: '10px'
                                        }}
                                    >
                                        <button
                                            onClick={handleGoBack}
                                            style={{
                                                position: 'absolute',
                                                top: '2px',
                                                left: '8px',
                                                width: '40px',
                                                height: '40px',
                                                backgroundColor: '#ff6b6b',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '8px',
                                                fontSize: '18px',
                                                lineHeight: '1',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                                                transition: 'all 0.3s ease',
                                            }}
                                            onMouseOver={(e) => {
                                                e.target.style.backgroundColor = '#ff8787';
                                                e.target.style.transform = 'scale(1.1)';
                                            }}
                                            onMouseOut={(e) => {
                                                e.target.style.backgroundColor = '#ff6b6b';
                                                e.target.style.transform = 'scale(1)';
                                            }}
                                        >
                                            ←
                                        </button>
                                        <FaEnvelope
                                            style={{
                                                fontSize: '50px',
                                                color: '#ff6b6b',
                                                marginBottom: '10px'
                                            }}
                                        />

                                        <h3>Yeni Kullanıcı Kaydı</h3>

                                        {/* SADECE Mail adresi input'u kaldı */}
                                        <input
                                            type="text"
                                            placeholder="Mail adresi giriniz"
                                            name="registerMail"
                                            value={registerEmail}
                                            onChange={(e) => setRegisterEmail(e.target.value)}
                                            style={{
                                                width: '80%',
                                                padding: '12px',
                                                marginTop: '20px',
                                                marginBottom: '20px',
                                                borderRadius: '30px',
                                                border: '1px solid #ff8787',
                                                fontSize: '16px',
                                            }}
                                        />

                                        <Button
                                            text="Onay Kodu Gönder"
                                            onClick={handleMailRegister}
                                            className="mail-approve"
                                        />
                                    </div>
                                </Popup>
                            )}




                            {showFourthPopup && (
                                <Popup isOpen={showFourthPopup} onClose={closeFourthPopup}>
                                    <div className='fourth-popup-container'>
                                        <h3>Yeni Şifre Belirleme</h3>

                                        <input
                                            type="password"
                                            placeholder='Şifrenizi oluşturunuz'
                                            name='newPassword'
                                            value={registerPassword}
                                            onChange={(e) => setRegisterPassword(e.target.value)}
                                        />
                                        {/* HATA MESAJI */}
                                        {error && <div style={{ color: 'red', fontSize: '12px', marginBottom: "5px", textAlign: "left" }}>{error}</div>}

                                        <input
                                            type="password"
                                            placeholder='Şifre tekrar'
                                            name='newPasswordAgain'
                                            value={registerPasswordControl}
                                            onChange={(e) => setRegisterPasswordControl(e.target.value)}
                                        />
                                        {/* HATA MESAJI */}
                                        {error && <div style={{ color: 'red', fontSize: '12px', marginBottom: "5px", textAlign: "left" }}>{error}</div>}
                                        <Button
                                            text="Kayıt Ol"
                                            onClick={checkEqual}
                                            className='register-last'
                                        />
                                    </div>
                                </Popup>
                            )}

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
                    <h2 className="section-heading">All Restaurants</h2>
                    <div className="restaurant-list">
                        {allRestaurants.map(restaurant => (
                            <Link to={`/restaurant/${restaurant.id}`} className="restaurant-item" key={restaurant.id}>
                                <div className="restaurant-item-img">
                                    <img src={restaurant.image} alt={restaurant.name} className="restaurant-img" />
                                </div>
                                <div className="restaurant-item-left">

                                    <h3 className="restaurant-title">{restaurant.name}</h3>
                                    <div className="restaurant-meta">
                                        <p className="restaurant-category">{restaurant.type}</p>
                                        <div className="restaurant-location">
                                            <span className="bullet">•</span>
                                            <span>{restaurant.distance}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="restaurant-item-right">
                                    <div className="rating-display">
                                        <FaStar className="star-icon" />
                                        <span className="rating-number">{restaurant.rating}</span>
                                    </div>
                                    <button className="favorite-small-btn" onClick={(e) => toggleFavorite(restaurant.id, e)}>
                                        {favorites.includes(restaurant.id) ? (
                                            <FaHeart className="heart-small favorited" />
                                        ) : (
                                            <FaRegHeart className="heart-small" />
                                        )}
                                    </button>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default HomePage;