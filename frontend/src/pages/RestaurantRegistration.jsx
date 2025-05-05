import React, { useState } from 'react';
import '../styles/RestaurantRegister.css';
import CustomInput from '../components/CustomInput';
import { FaAt } from "react-icons/fa";
import { BsFillPersonVcardFill } from "react-icons/bs";
import { CiMoneyBill } from "react-icons/ci";
import Button from '../components/Button';
import InfoForBusiness from '../components/RestaurantRegistrationComponents/InfoForBusiness';
import { useNavigate } from 'react-router-dom';

export default function RestaurantRegistration() {
    const [formData, setFormData] = useState({
        ownerName: '',
        taxNo: '',
        name: '',
        email: '',
        phone: '',
        address: '',
        cuisine: ''

    });

    const [errorMessage, setErrorMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [taxError, setTaxError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const navigate = useNavigate();// kayıt olduktan sonra ana sayfaya yönlendirmek için

    let hasError = false; // Hata kontrol

    const handleChange = (e) => {
        const { name, value } = e.target;


        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = () => {
        let hasError = false; // Hata kontrol bayrağı
        setErrorMessage('');
        setEmailError('');
        setTaxError('');
        setPhoneError('');

        // Boş alan kontrolü
        const isEmptyField = Object.values(formData).some(value => value.trim() === '');
        if (isEmptyField) {
            setErrorMessage('*Lütfen tüm alanları doldurunuz.');
            hasError = true;
        }

        // E-posta doğrulama
        if (!validateEmail(formData.email)) {
            setEmailError('*Lütfen geçerli bir mail adresi giriniz.');
            hasError = true;
        }

        // Vergi numarası doğrulama
        if (!validateTaxNo(formData.taxNo)) {
            setTaxError('*Vergi numaranız 10 haneli olmalıdır ve sadece rakamlardan oluşmalıdır.');
            hasError = true;
        }

        const isValidPhone = validatePhone(formData.phone);
        if (!isValidPhone) {
            setPhoneError('*Lütfen geçerli bir telefon numarası giriniz.');
            hasError = true;
        }
        // Eğer herhangi bir hata varsa gönderimi durdur
        if (hasError) return;


        console.log('Form submitted:', formData);
        setSubmitted(true);

        // Reset form after 3 seconds
        setTimeout(() => {
            setFormData({
                ownerName: '',
                taxNo: '',
                name: '',
                email: '',
                phone: '',
                address: '',
                cuisine: ''

            });
            setSubmitted(false);
            navigate('/'); // Ana sayfaya yönlendirme
        }, 3000);//3 saniye bekleyip yönlendrir
    };

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validateTaxNo = (taxNo) => {
        const trimmed = taxNo.trim();
        return /^\d{10}$/.test(trimmed); // sadece 10 rakamdan oluşuyorsa true döner
    }

    const validatePhone = (phone) => {
        const cleaned = phone.replace(/[\s\-()]/g, '')  // boşluk, tire, parantez temizle
            .replace(/^\+90/, '')      // +90 varsa baştan kaldır
            .replace(/^0/, '');        // 0 ile başlıyorsa kaldır

        return /^5\d{9}$/.test(cleaned); // Kalan numara tam 10 rakamdan oluşmalı
    };



    return (
        <div className="registration-container">
            {/* sol taraf, kayıt formu */}
            <div className="registration-form-side">
                <div className="registration-form-wrapper">
                    <h1 className="form-title">İşletmen İçin Kayıt Ol</h1>
                    <p className="form-subtitle">Uygulamamıza Katılın ve İşletmenizi Online olarak Büyütün</p>

                    {submitted ? (
                        <div className="success-message">
                            <div className="success-icon">✓</div>
                            <h2 className="success-title">Registration Successful!</h2>
                            <p className="success-text">Thank you for registering your restaurant.</p>
                        </div>
                    ) : (
                        <div className="form-container">

                            <div className="form-group">
                                <label className="form-label">Hesap Sahibi İsim-Soyisim</label>
                                <div className="input-container">
                                    <span className="input-icon"><BsFillPersonVcardFill /></span>
                                    <CustomInput
                                        type="text"
                                        placeholder="İsim Soyisim"
                                        name="ownerName"
                                        value={formData.ownerName}
                                        onChange={handleChange}
                                        className="component-input"
                                    />

                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Vergi Numarası</label>
                                <div className="input-container">
                                    <span className="input-icon"><CiMoneyBill /> </span>
                                    <CustomInput
                                        type="text"
                                        placeholder="1234567890"
                                        name="taxNo"
                                        value={formData.taxNo}
                                        onChange={handleChange}
                                        className="component-input"
                                    />
                                    {taxError && (
                                        <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                                            {taxError}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">İşletme İsmi</label>
                                <div className="input-container">
                                    <span className="input-icon">🏪</span>
                                    <CustomInput
                                        type="text"
                                        placeholder="İşletme İsmi"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="component-input"
                                    />

                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Email Adres</label>
                                <div className="input-container">

                                    <span className="input-icon"><FaAt /></span>
                                    <CustomInput
                                        type="email"
                                        placeholder="email@example.com"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="component-input"
                                    />
                                    {emailError && (
                                        <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                                            {emailError}
                                        </div>
                                    )}

                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Telefon Numarası</label>
                                <div className="input-container">
                                    <span className="input-icon">📞</span>
                                    <CustomInput
                                        type="tel"
                                        placeholder="(500) 000 0000"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="component-input"
                                    />
                                    {phoneError && (
                                        <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                                            {phoneError}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Adres</label>
                                <div className="input-container">
                                    <span className="input-icon">📍</span>
                                    <CustomInput
                                        type="text"
                                        placeholder="Sokak, No, Şehir"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="component-input"
                                    />

                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">İşletme Türü</label>
                                <div className="input-container select-container">
                                    <span className="input-icon">☕</span>
                                    <select
                                        name="cuisine"
                                        value={formData.cuisine}
                                        onChange={handleChange}
                                        className="form-input form-select"
                                    >
                                        <option value="">Bir Tür Seçiniz</option>
                                        <option value="cafe">Cafe</option>
                                        <option value="italian">Italian</option>
                                        <option value="asian">Asian</option>
                                        <option value="mexican">Mexican</option>
                                        <option value="pub">Pub</option>
                                        <option value="Fine Dining">Fine Dining</option>
                                        <option value="other">Other</option>
                                    </select>
                                    <span className="select-arrow">▼</span>
                                </div>
                            </div>
                            {errorMessage && (
                                <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>
                                    {errorMessage}
                                </div>
                            )}

                            <Button
                                onClick={handleSubmit}
                                className="register-button"
                                text='Kayıt Ol'
                            />


                        </div>
                    )}
                </div>
            </div>


            <InfoForBusiness />  {/* sağ taraf, işletme kayıt info*/}

        </div>


    );
}