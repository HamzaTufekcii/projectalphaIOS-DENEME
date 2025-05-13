import React from 'react';
import './Button.css';

// props
const Button = ({ text, onClick, className = "" }) => {
    return (
        <button className={`my-button ${className}`} onClick={onClick}>
            {text}
        </button>
    );
};

export default Button;