import React from 'react';
import './CustomInput.css'; // CSS dosyanın yolu

const CustomInput = ({ type = 'text', placeholder, name, value, onChange, className,required = false,id }) => {
    return (
        <input
            type={type}
            placeholder={placeholder}
            name={name}
            value={value}
            onChange={onChange}
            className={`custom-input ${className || ''}`}
            required={required}
            id={id}
        />
    );
};

export default CustomInput;
