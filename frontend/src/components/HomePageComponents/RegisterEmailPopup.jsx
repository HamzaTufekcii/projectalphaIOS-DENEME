// src/components/RegisterEmailPopup.jsx

import React from 'react';
import Popup from '../Popup';
import CustomInput from '../CustomInput';
import Button from '../Button';
import { FaEnvelope } from 'react-icons/fa';

const RegisterEmailPopup = ({
    isOpen,
    onClose,
    registerEmail,
    setRegisterEmail,
    onSendCode,
    onBack
}) => {
    return (
        <Popup isOpen={isOpen} onClose={onClose}>
            <div
                className="third-popup-container"
                style={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '10px',
                    width:'480px',
                }}
            >
                <button
                    onClick={onBack}
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

                <FaEnvelope style={{
                    fontSize: '50px',
                    color: '#ff6b6b',
                    marginBottom: '10px'
                }} />

                <h3>Yeni Kullanıcı Kaydı</h3>

                <CustomInput
                    type="text"
                    placeholder="Mail adresi giriniz"
                    name="registerMail"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                />

                <Button
                    text="Onay Kodu Gönder"
                    onClick={onSendCode}
                    className="mail-approve"
                />
            </div>
        </Popup>
    );
};

export default RegisterEmailPopup;
