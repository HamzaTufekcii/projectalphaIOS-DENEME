import React from 'react';
import './ListBox.css';

export default function ListBox({ list, onClick }) {
    return (
        <div className="list-box" onClick={() => onClick(list.id)}>
            {list.name}
        </div>
    );
}
