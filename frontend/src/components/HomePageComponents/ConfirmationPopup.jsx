// src/components/ConfirmationPopup.jsx

import React from 'react';
import Popup from '../Popup';
import CustomInput from '../CustomInput';
import Button from '../Button';
import './ConfirmationPopup.css'

const ConfirmationPopup = ({
    isOpen,
    onClose,
    confirmationCode,
    setConfirmationCode,
    error,
    onConfirm
}) => {
    return (
        <Popup isOpen={isOpen} onClose={onClose}>
            <div className='second-popup-container'>
                <h2>Onay Kodu Girişi</h2><br />

                <CustomInput
                    type="text"
                    placeholder="Onay Kodunu Giriniz"
                    name="confirmationCode"
                    value={confirmationCode}
                    onChange={(e) => setConfirmationCode(e.target.value)}
                />

                {error && (
                    <div style={{
                        color: 'red',
                        fontSize: '12px',
                        marginBottom: '5px',
                        textAlign: 'left'
                    }}>
                        {error}
                    </div>
                )}

                <Button text="Doğrula" onClick={onConfirm} />
            </div>
        </Popup>
    );
};

export default ConfirmationPopup;
