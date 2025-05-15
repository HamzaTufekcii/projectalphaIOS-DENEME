import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BusinessRegistration from './pages/RestaurantRegistration';
import BusinessDetailPage from './pages/RestaurantDetailPage';
import ProfilePage from './pages/ProfilePage';
import FavoritesPage from './pages/FavoritesPage';
import UserListsPage from './pages/UserListsPage';
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
            <Route path="/business-register" element={<BusinessRegistration />} />
            <Route path="/business/:id" element={<BusinessDetailPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/:userId" element={<ProfilePage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/lists" element={<UserListsPage />} />
            <Route path="/login" element={<div>Login Page</div>} />
            {/* For backward compatibility */}
            <Route path="/restaurant/:id" element={<BusinessDetailPage />} />
            <Route path="/owner-register" element={<BusinessRegistration />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;