import React, { useState, useEffect } from 'react';
import '../styles/RestaurantRegister.css';
import CustomInput from '../components/CustomInput';
import { FaAt } from "react-icons/fa";
import { BsFillPersonVcardFill } from "react-icons/bs";
import { CiMoneyBill } from "react-icons/ci";
import Button from '../components/Button';
import InfoForBusiness from '../components/RestaurantRegistrationComponents/InfoForBusiness';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';

export default function RestaurantRegistration() {
    // Form adımı: 1 = Email girişi, 2 = Kod doğrulama, 3 = Kayıt formu
    const [formStep, setFormStep] = useState(1);

    // E-posta ve doğrulama kodu
    const [registerEmail, setRegisterEmail] = useState('');
    const [confirmationCode, setConfirmationCode] = useState('');
    const [emailError, setEmailError] = useState('');
    const [codeError, setCodeError] = useState('');


    // Kayıt formu alanları
    const [formData, setFormData] = useState({
        ownerName: '',
        taxNo: '',
        name: '',
        email: '',
        phone: '',
        addressCity: '',
        addressDistrict: '',
        addressNeighborhood: '',
        cuisine: ''
    });

    const [name, surname] = formData.ownerName.trim().split(' ').reduce((acc, part, i, arr) => {
        if (i === 0) acc[0] = part; // İlk kelime ismi
        else acc[1] += (acc[1] ? ' ' : '') + part; // Geri kalanı soyadı gibi al
        return acc;
    }, ['', '']);

    // Hata mesajları ve kayıt durumu
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const navigate = useNavigate();

    // Email doğrulandıysa formData.email'e aktar
    useEffect(() => {
        if (formStep === 3 && !formData.email) {
            setFormData(prev => ({ ...prev, email: registerEmail }));
        }
    }, [formStep]);

    // Giriş alanlarında değişiklik kontrolü
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Validasyon kontrolleri
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validateTaxNo = (taxNo) => /^\d{10}$/.test(taxNo.trim());
    const validatePhone = (phone) => {
        const cleaned = phone.replace(/[\s\-()]/g, '').replace(/^\+90/, '').replace(/^0/, '');
        return /^5\d{9}$/.test(cleaned);
    };

    // Adım 1: Email doğrulama (şimdilik backend bağlantısı olmadan geçilir)
    const handleSendVerificationCode = async () => {
        setEmailError('');
        if (!validateEmail(registerEmail)) {
            setEmailError('*Geçerli bir e-posta giriniz.');
            return;
        }


        try {
            await axios.post('http://localhost:8080/api/auth/send-verification-code', {
                email: registerEmail.trim()
            });
            setFormStep(2);
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                if (err.response.data.message.includes("User is not verified")) {
                    setCodeError('E-Postanı henüz doğrulamamışsın. Yeni kod e-postana yollandı.');
                    setFormStep(2);
                }
                if(err.response.data.message.includes("Email is already registered")) {
                    setEmailError('Bu e-posta ile oluşturulmuş bir hesap mevcut.');
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

    // Adım 2: Kod doğrulama (şimdilik kod girildiyse geçerli sayılır)
    const handleVerifyCode = async () => {
        setCodeError('');
        if (!confirmationCode.trim()) {
            setCodeError('*Kod boş bırakılamaz.');
            return;
        }


        try {
            await axios.post('http://localhost:8080/api/auth/verify-verification-code', {
                email: registerEmail.trim(),
                token: confirmationCode.trim()
            });
            setFormStep(3);
        } catch (err) {
            const msg = err.response?.data?.message || err.message;
            if (err.response.data.message.includes("Verification code is incorrect")) {
                setCodeError('Onay kodu yanlış girildi. Lütfen tekrar deneyin.');
            } else {
                setCodeError('Doğrulama başarısız: ' + msg);
            }
            console.error(err);
        }


        // Şimdilik doğrudan ilerle

    };

    // Adım 3: Form gönderme işlemi ve kontrolleri
    const handleSubmit = async () => {
        let hasError = false;
        const newErrors = {};

        if (Object.values(formData).some(value => value.trim() === '')) {
            newErrors.form = '*Lütfen tüm alanları doldurunuz.';
            hasError = true;
        }

        if (!validateEmail(formData.email)) {
            newErrors.email = '*Geçerli bir e-posta giriniz.';
            hasError = true;
        }

        if (!validateTaxNo(formData.taxNo)) {
            newErrors.taxNo = '*Vergi numarası 10 haneli olmalıdır.';
            hasError = true;
        }

        if (!validatePhone(formData.phone)) {
            newErrors.phone = '*Geçerli bir telefon numarası giriniz.';
            hasError = true;
        }

        setErrors(newErrors);
        if (hasError) return;

        // Tüm hataları aynı anda kullanıcıya göstermek için
        if (Object.keys(newErrors).length > 0) return;
        try {
            const requestBody = {
                email: formData.email.trim(),
                password: 'isletmetest', // Eğer kullanıcıdan almıyorsan default bir şifre gönder
                role: 'owner_user',
                requestBusiness: {
                    name: formData.name.trim(),
                    description: formData.cuisine.trim()
                },
                requestAddress: {
                    city: formData.addressCity.trim(),
                    district: formData.addressDistrict.trim(),
                    neighborhood: formData.addressNeighborhood.trim()
                },
                requestOwner: {
                    name,
                    surname,
                    phone_numb: formData.phone.trim()
                }
            };

            await axios.post('http://localhost:8080/api/auth/update-owner-user', requestBody);

            setSubmitted(true);
            alert("Test aşamasında işletme profili şifresi otomatik olarak isletmetest olmaktadır.");
            setTimeout(() => {
                setFormData({
                    ownerName: '', taxNo: '', name: '', email: '', phone: '',
                    addressCity: '', addressDistrict: '', addressNeighborhood: '', cuisine: ''
                });
                setSubmitted(false);
                navigate('/');
            }, 3000);
        } catch (err) {
            console.error('Kayıt başarısız:', err);
            setErrors({ form: 'Kayıt sırasında hata oluştu: ' + (err.response?.data?.message || err.message) });
        }
    };

    return (
        <div className="registration-container">
            <div className="registration-form-side">
                <div className="registration-form-wrapper">
                    <h1 className="form-title">İşletmen İçin Kayıt Ol</h1>
                    <p className="form-subtitle">Uygulamamıza Katılın ve İşletmenizi Online olarak Büyütün</p>

                    {/* Adım 1: E-posta girişi */}
                    {formStep === 1 && (
                        <div className="form-container">
                            <div className="form-group">
                                <label className="form-label">E-posta adresiniz</label>
                                <div className="input-container">
                                    <span className="input-icon"><FaAt /></span>
                                    <CustomInput
                                        type="email"
                                        name="registerEmail"
                                        value={registerEmail}
                                        onChange={(e) => setRegisterEmail(e.target.value)}
                                        placeholder="email@example.com"
                                        className="component-input input-style"
                                    />
                                </div>
                                {emailError && (
                                    <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                                        {emailError}
                                    </div>
                                )}
                            </div>
                            <Button text="Doğrulama Kodunu Gönder" onClick={handleSendVerificationCode} className="register-button" />
                        </div>
                    )}


                    <AnimatePresence mode="wait">
                        {/* STEP 2 – Kod Doğrulama */}
                        {formStep === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ duration: 0.4 }}
                                className="form-container"
                            >
                                <div className="form-group">
                                    <label className="form-label">Doğrulama Kodu</label>
                                    <div className="input-container">
                                        <CustomInput
                                            type="text"
                                            name="confirmationCode"
                                            value={confirmationCode}
                                            onChange={(e) => setConfirmationCode(e.target.value)}
                                            placeholder="6 haneli kod"
                                            className="component-input"
                                        />
                                    </div>
                                    {codeError && (
                                        <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                                            {codeError}
                                        </div>
                                    )}
                                </div>
                                <Button text="Kodu Onayla" onClick={handleVerifyCode} className="register-button" />
                            </motion.div>
                        )}

                        {/* STEP 3 – Kayıt Formu */}
                        {formStep === 3 && !submitted && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ duration: 0.4 }}
                                className="form-container"
                            >
                                <div className="form-group">
                                    <label className="form-label">Hesap Sahibi Ad Soyad</label>
                                    <div className="input-container">
                                        <span className="input-icon"><BsFillPersonVcardFill /></span>
                                        <CustomInput
                                            type="text"
                                            name="ownerName"
                                            value={formData.ownerName}
                                            onChange={handleChange}
                                            placeholder="Ad Soyad"
                                            className="component-input input-style"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Vergi Numarası</label>
                                    <div className="input-container">
                                        <span className="input-icon"><CiMoneyBill /></span>
                                        <CustomInput
                                            type="text"
                                            name="taxNo"
                                            value={formData.taxNo}
                                            onChange={handleChange}
                                            placeholder="1234567890"
                                            className="component-input input-style"
                                        />
                                        {errors.taxNo && (
                                            <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                                                {errors.taxNo}
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
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="İşletme İsmi"
                                            className="component-input input-style"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Telefon</label>
                                    <div className="input-container">
                                        <span className="input-icon">📞</span>
                                        <CustomInput
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="(500) 000 0000"
                                            className="component-input input-style"
                                        />
                                        {errors.phone && (
                                            <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                                                {errors.phone}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Adres</label>
                                    <div className="address-container">

                                        <div className="input-container">
                                            <span className="input-icon">📍</span>
                                            <CustomInput
                                                type="text"
                                                placeholder="Şehir"
                                                name="addressCity"
                                                value={formData.addressCity}
                                                onChange={handleChange}
                                                className="component-input input-style"
                                            />
                                        </div>

                                        <div className="input-container">
                                            <span className="input-icon">📍</span>
                                            <CustomInput
                                                type="text"
                                                placeholder="İlçe"
                                                name="addressDistrict"
                                                value={formData.addressDistrict}
                                                onChange={handleChange}
                                                className="component-input input-style"
                                            />
                                        </div>

                                        <div className="input-container">
                                            <span className="input-icon">📍</span>
                                            <CustomInput
                                                type="text"
                                                placeholder="Mahalle"
                                                name="addressNeighborhood"
                                                value={formData.addressNeighborhood}
                                                onChange={handleChange}
                                                className="component-input input-style"
                                            />
                                        </div>

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

                                {errors.form && (
                                    <div style={{ color: 'red', fontSize: '16px', marginTop: '4px' }}>
                                        {errors.form}
                                    </div>
                                )}

                                <Button
                                    onClick={handleSubmit}
                                    className="register-button"
                                    text='Kayıt Ol'
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>


                    {/* Kayıt başarılıysa gösterilen mesaj */}
                    {submitted && (
                        <div className="success-message">
                            <div className="success-icon">✓</div>
                            <h2 className="success-title">Registration Successful!</h2>
                            <p className="success-text">Thank you for registering your restaurant.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Sağdaki bilgi paneli */}
            <InfoForBusiness />
        </div>
    );
}
