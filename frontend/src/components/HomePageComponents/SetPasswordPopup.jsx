// src/components/SetPasswordPopup.jsx

import React from 'react';
import Popup from '../Popup';
import CustomInput from '../CustomInput';
import Button from '../Button';
import { WiDayThunderstorm } from 'react-icons/wi';

const SetPasswordPopup = ({
    isOpen,
    onClose,
    registerPassword,
    setRegisterPassword,
    registerPasswordControl,
    setRegisterPasswordControl,
    error,
    onSubmit
}) => {
    return (
        <Popup isOpen={isOpen} onClose={onClose}>
            <div className='fourth-popup-container' style={{width:'480px'}}>
                <h3>Yeni Şifre Belirleme</h3>

                <CustomInput
                    type="password"
                    placeholder="Şifrenizi oluşturunuz"
                    name="newPassword"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                />
                {error && (
                    <div style={{ color: 'red', fontSize: '12px', marginBottom: '5px', textAlign: 'left' }}>
                        {error}
                    </div>
                )}

                <CustomInput
                    type="password"
                    placeholder="Şifre tekrar"
                    name="newPasswordAgain"
                    value={registerPasswordControl}
                    onChange={(e) => setRegisterPasswordControl(e.target.value)}
                />
                {error && (
                    <div style={{ color: 'red', fontSize: '12px', marginBottom: '5px', textAlign: 'left' }}>
                        {error}
                    </div>
                )}

                <Button
                    text="Kayıt Ol"
                    onClick={onSubmit}
                    className="register-last"
                />
            </div>
        </Popup>
    );
};

export default SetPasswordPopup;
