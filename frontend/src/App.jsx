// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import RestaurantRegistration from './pages/RestaurantRegistration';
import RestaurantDetailPage from './pages/RestaurantDetailPage';
import ProfilePage from './pages/ProfilePage';
import FavoritesPage from './pages/FavoritesPage';
import UserListsPage from './pages/UserListsPage';
import InsideListPage from './pages/InsideListPage';
import OwnerHomePage from './pages/OwnerHomePage';
import OwnerReviewsPage from './pages/OwnerReviewsPage';
import OwnerPromotionsPage from './pages/OwnerPromotionsPage';
import './styles/HomePage.css';
import './styles/App.css';

function App() {
  return (
      <Router>
        <div className="app-container">
          <Navbar />
          <div className="page-content">
            <Routes>
              {/* Genel kullanıcı sayfaları */}
              <Route path="/" element={<HomePage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/lists" element={<UserListsPage />} />
              <Route path="/lists/:listId" element={<InsideListPage />} />
              <Route path="/profile" element={<ProfilePage />} />

              {/* Restoran kayıt ve detay sayfaları */}
              <Route path="/restaurants/new" element={<RestaurantRegistration />} />
              <Route path="/restaurant/:id" element={<RestaurantDetailPage />} />
              <Route path="/restaurants/:id" element={<RestaurantDetailPage />} />

              {/* İşletme(Owner) sayfaları */}
              <Route path="/owner" element={<OwnerHomePage />} />
              <Route path="/owner/reviews" element={<OwnerReviewsPage />} />
              <Route path="/owner/promotions" element={<OwnerPromotionsPage />} />
            </Routes>
          </div>
        </div>
      </Router>
  );
}

export default App;
