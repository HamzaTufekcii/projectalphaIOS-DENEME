import React from 'react';
import './CustomInput.css'; // CSS dosyanın yolu

const CustomInput = ({ type = 'text', placeholder, name, value, onChange }) => {
    return (
        <input
            type={type}
            placeholder={placeholder}
            name={name}
            value={value}
            onChange={onChange}
            className="custom-input"
        />
    );
};

export default CustomInput;
