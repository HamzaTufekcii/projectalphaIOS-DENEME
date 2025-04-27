import React from "react";
import './PopupStyle.css';
import Button from './Button'

function Popup({isOpen,onClose,children}){
    if(!isOpen){
        return null;
    }

    const handleBackgroundClick = () => {
        onClose(); // Arka plana tıklanınca popup kapansın
      };
    
      const handlePopupClick = (e) => {
        e.stopPropagation(); // Popup içeriğine tıklayınca arka plan click tetiklenmesin
      };

    return(    
        <div className="popup" onClick={handleBackgroundClick}>
            <div className="popup-content" onClick={handlePopupClick}>
                {children} {/* popup ın içerisine gelecek olan içerik=children */ }
                {/*<button onClick={onClose}>Kapat</button>*/ }
            </div>
        </div>
    );
}

export default Popup;