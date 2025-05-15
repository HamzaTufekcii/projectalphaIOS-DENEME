// src/components/LoginPopup.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import Popup from '../Popup';
import CustomInput from '../CustomInput';
import Button from '../Button';
import './LoginPopup.css'

const LoginPopup = ({
    isOpen,
    onClose,
    selectedTab,
    handleSelectUser,
    handleSelectOwner,
    userLoginEmail,
    setUserLoginEmail,
    userLoginPassword,
    setUserLoginPassword,
    ownerLoginEmail,
    setOwnerLoginEmail,
    ownerLoginPassword,
    setOwnerLoginPassword,
    errors,
    error,
    handleUserLogin,
    handleOwnerLogin,
    openThirdPopUp
}) => {
    return (
        <Popup isOpen={isOpen} onClose={onClose}>
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

                    {error && (
                        <div className="error-message" style={{ color: 'red', padding: '10px', marginBottom: '10px', backgroundColor: '#ffeeee', borderRadius: '4px', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}

                    <div className='middle-content'>
                        {selectedTab === 'user' && (
                            <div className="tab-content animate-slide">
                                <p>Kullanıcı Girişi</p>

                                <CustomInput
                                    type='email'
                                    placeholder="Email"
                                    name="userLoginMail"
                                    value={userLoginEmail}
                                    onChange={(e) => setUserLoginEmail(e.target.value)}
                                />

                                {errors.email && <div style={{ color: 'red', fontSize: '12px', marginBottom: "5px", textAlign: "left" }}>{errors.email}</div>}

                                <CustomInput
                                    type="password"
                                    placeholder="Şifre"
                                    name="userLoginPassword"
                                    value={userLoginPassword}
                                    onChange={(e) => setUserLoginPassword(e.target.value)}
                                />
                                

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
                                <CustomInput
                                    type="email"
                                    placeholder="İşletme Email"
                                    name="ownerLoginMail"
                                    value={ownerLoginEmail}
                                    onChange={(e) => setOwnerLoginEmail(e.target.value)}
                                />

                                {errors.ownerEmail && <div style={{ color: 'red', fontSize: '12px', marginBottom: "5px", textAlign: "left" }}>{errors.ownerEmail}</div>}
                                <CustomInput
                                    type="password"
                                    placeholder="İşletme Şifre"
                                    name="ownerLoginPassword"
                                    value={ownerLoginPassword}
                                    onChange={(e) => setOwnerLoginPassword(e.target.value)}
                                />
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
    );
};

export default LoginPopup;
