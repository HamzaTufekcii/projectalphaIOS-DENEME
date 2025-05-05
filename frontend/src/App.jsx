import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import OwnerRegisterPage from './pages/RestaurantRegistration'
import './styles/HomePage.css';
import RestaurantRegistration from './pages/RestaurantRegistration';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/owner-register" element={<RestaurantRegistration />} />
      </Routes>
    </Router>
  );
}

export default App;