// src/components/SettingsPopup.jsx
import React from 'react';
import Popup from '../Popup';
import Button from '../Button';
import '../../styles/SettingsPopup.css';
const SettingsPopup = ({ isOpen, onClose, onLogout, onChangePassword }) => {
    return (
        <Popup isOpen={isOpen} onClose={onClose}>
            <div className="settings-popup-content">
                <h2>Hesap Ayarları</h2>

                {/* Gizlilik Ayarları */}
                <div className="settings-section">
                    <h3>Gizlilik</h3>
                    <label>
                        <input type="checkbox" defaultChecked /> Değerlendirmelerimi herkese açık göster
                    </label>
                    <label>
                        <input type="checkbox" defaultChecked /> E-posta bildirimlerine izin ver
                    </label>
                </div>

                {/* Hesap Ayarları */}
                <div className="settings-section">

                </div>
            </div>
        </Popup>
    );
};

export default SettingsPopup;