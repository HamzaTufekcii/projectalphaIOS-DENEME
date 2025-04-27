import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import OwnerRegisterPage from './pages/OwnerRegisterPage'
import './styles/HomePage.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/owner-register" element={<OwnerRegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App;