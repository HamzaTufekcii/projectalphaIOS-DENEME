import React from 'react';

const BackButton = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            onMouseOver={(e) => {
                e.target.style.backgroundColor = '#ff8787';
                e.target.style.transform = 'scale(1.1)';
            }}
            onMouseOut={(e) => {
                e.target.style.backgroundColor = '#ff6b6b';
                e.target.style.transform = 'scale(1)';
            }}
            style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
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
        >
            ←
        </button>
    );
};

export default BackButton;
