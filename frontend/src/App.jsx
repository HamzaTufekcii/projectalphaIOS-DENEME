import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RestaurantRegistration from './pages/RestaurantRegistration';
import RestaurantDetailPage from './pages/RestaurantDetailPage';
import Navbar from './components/Navbar';
import './styles/HomePage.css';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="page-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/owner-register" element={<RestaurantRegistration />} />
            <Route path="/restaurant/:id" element={<RestaurantDetailPage />} />
            <Route path="/favorites" element={<div>Favorites Page</div>} />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;