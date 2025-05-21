import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BusinessRegistration from './pages/RestaurantRegistration';
import BusinessDetailPage from './pages/RestaurantDetailPage';
import ProfilePage from './pages/ProfilePage';
import FavoritesPage from './pages/FavoritesPage';
import UserListsPage from './pages/UserListsPage';
import Navbar from './components/Navbar';
import OwnerHomePage from './pages/OwnerHomePage';
import OwnerReviewsPage from './pages/OwnerReviewsPage';
import OwnerPromotionsPage from './pages/OwnerPromotionsPage';
import MyReviewsPage from './pages/MyReviewsPage';
import './styles/HomePage.css';
import './styles/App.css';


function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="page-content">
          <Routes>
            {/* Genel kullanıcı ve işletme rotaları */}
            <Route path="/" element={<HomePage />} />
            <Route path="/business-register" element={<BusinessRegistration />} />
            <Route path="/business/:id" element={<BusinessDetailPage />} />
            {/* Profil */}
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/:userId" element={<ProfilePage />} />
            {/* Sadece normal kullanıcıya açık sayfalar */}
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/lists" element={<UserListsPage />} />
            <Route path="/my-reviews" element={<MyReviewsPage/>} />
            {/* Giriş */}
            <Route path="/login" element={<div>Login Page</div>} />
            {/* İşletme kullanıcılarının paneli */}
            <Route path="/owner-dashboard" element={<OwnerHomePage />} />
            <Route path="/restaurant/:id/reviews" element={<OwnerReviewsPage />} />
            <Route path="/restaurant/:id/promotions" element={<OwnerPromotionsPage/>} />
            <Route path="/restaurant/:id/reservations" element={<div>Rezervasyonlar</div>} />
            <Route path="/restaurant/:id/questions" element={<div>Müşteri Soruları</div>} />

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