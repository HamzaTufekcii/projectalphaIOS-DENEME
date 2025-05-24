import React from 'react';
import './ListBox.css';

export default function ListBox({ list }) {
    return (
        <div className="list-box">
            <h3>{list.name}</h3>
            {list.diner_name && (
                <p className="list-owner">Oluşturan: {list.diner_name}</p>
            )}
        </div>
    );
}
