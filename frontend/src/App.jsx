// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

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
import MyReviewsPage from './pages/MyReviewspage';
import InsideDiscoverPage from "./pages/InsideDiscoverPage.jsx";

import './styles/HomePage.css';
import './styles/App.css';

// ⚙️ React Query client'ı oluştur
const queryClient = new QueryClient();

function App() {
  return (
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="app-container">
            <Navbar />
            <div className="page-content">
              <Routes>
                {/* Genel kullanıcı ve işletme rotaları */}
                <Route path="/" element={<HomePage />} />
                <Route path="/business-register" element={<RestaurantRegistration />} />
                <Route path="/business/:id" element={<RestaurantDetailPage />} />
                {/* Profil */}
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/profile/:userId" element={<ProfilePage />} />
                {/* Sadece normal kullanıcıya açık sayfalar */}
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/lists" element={<UserListsPage />} />
                <Route path="/my-reviews" element={<MyReviewsPage />} />
                <Route path="/lists/:listId" element={<InsideListPage />} />
                <Route path="/lists/discover/:listId" element={<InsideDiscoverPage />} />
                {/* Giriş */}
                <Route path="/login" element={<div>Login Page</div>} />
                {/* İşletme kullanıcılarının paneli */}
                <Route path="/owner-dashboard" element={<OwnerHomePage />} />
                <Route path="/restaurant/:id/reviews" element={<OwnerReviewsPage />} />
                <Route path="/restaurant/:businessId/promotions" element={<OwnerPromotionsPage />} />
                <Route path="/restaurant/:id/reservations" element={<div>Rezervasyonlar</div>} />
                <Route path="/restaurant/:id/questions" element={<div>Müşteri Soruları</div>} />

                {/* Geriye dönük uyumluluk */}
                <Route path="/restaurant/:id" element={<RestaurantDetailPage />} />
                <Route path="/owner-register" element={<RestaurantRegistration />} />
              </Routes>
            </div>
          </div>
        </Router>

        {/* 🔍 Devtools (geliştirme sırasında görünür) */}
        {/*<ReactQueryDevtools initialIsOpen={false} />*/}
      </QueryClientProvider>
  );
}

export default App;