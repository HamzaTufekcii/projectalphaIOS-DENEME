import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/ProfilePage.css';
import { FaEdit } from 'react-icons/fa';

const API_BASE_URL = 'http://localhost:8080/api';

const MOCK_USER_PROFILE = {
  id: 'user123',
  name: 'Ahmet',
  surname: 'Yılmaz',
  email: 'ahmet.yilmaz@example.com',
  phone: '+90 555 123 4567',
  profilePicture: 'https://via.placeholder.com/150',
  role: 'user'
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [useMockData, setUseMockData] = useState(false);
const [isEditingEmail, setIsEditingEmail] = useState(false);
const [isEditingPassword, setIsEditingPassword] = useState(false);

const [passwordData, setPasswordData] = useState({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');

    if (!token || !userJson) {
      navigate('/');
      return;
    }

    const userData = JSON.parse(userJson);
    const userId = userData.id || userData.userId;

    const fetchUserData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        const response = await axios.get(`${API_BASE_URL}/users/${userId}/profile`, config);
        setUserProfile(response.data);
        setEditFormData(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error('Profil verisi alınamadı, mock veri kullanılacak:', err);
        setUserProfile(MOCK_USER_PROFILE);
        setEditFormData(MOCK_USER_PROFILE);
        setUseMockData(true);
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };
const handlePasswordChange = (e) => {
  const { name, value } = e.target;
  setPasswordData({ ...passwordData, [name]: value });
};

  const handleProfileEdit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      await axios.put(`${API_BASE_URL}/users/${user.id}/profile`, editFormData, config);
      setUserProfile(editFormData);
      setIsEditing(false);
    } catch (err) {
      console.error('Güncelleme hatası:', err);
      setUserProfile(editFormData);
      setIsEditing(false);
    }
  };

  if (isLoading) return <div className="loading-spinner">Yükleniyor...</div>;

  return (
    <div className="profile-page full">
        <div className="profile-info">

          <section className="profile-section">
            <h2 className="section-title">Hesabım</h2>

            <div className="form-group">
              <label>Ad</label>
              <input
                type="text"
                name="name"
                value={editFormData.name || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            <div className="form-group">
              <label>Soyad</label>
              <input
                type="text"
                name="surname"
                value={editFormData.surname || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            <div className="form-group">
              <label>Cep telefonu</label>
              <input
                type="text"
                name="phone"
                value={editFormData.phone || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>



            <button
              className="save-button"
              onClick={(e) => {
                e.preventDefault();
                if (isEditing) {
                  handleProfileEdit(e); // sonra pasif moda döner
                } else {
                  setIsEditing(true);   // düzenleme moduna geçer
                }
              }}
            >
              {isEditing ? 'Kaydet' : 'Düzenle'}
            </button>
          </section>




          {/* ✅ E-POSTA */}
         <section className="profile-section">
           <h2 className="section-title">E-posta</h2>

           <div className="form-group">
             <label>E-posta</label>
             <input
               type="email"
               value={userProfile?.email || ''}
               disabled
             />
             <div className="verified-badge">✔ Onaylanmış</div>
           </div>
         </section>



          {/*  ŞİFRE */}
         <section className="profile-section">
           <h2 className="section-title">Şifre</h2>

           <div className="form-group">
             <label>Mevcut Şifre</label>
             <input
               type="password"
               name="currentPassword"
               value={passwordData.currentPassword}
               onChange={handlePasswordChange}
               disabled={!isEditingPassword}
               placeholder="Mevcut şifrenizi girin"
             />
           </div>

           <div className="form-group">
             <label>Yeni Şifre</label>
             <input
               type="password"
               name="newPassword"
               value={passwordData.newPassword}
               onChange={handlePasswordChange}
               disabled={!isEditingPassword}
               placeholder="Yeni şifreniz"
             />
           </div>

           <div className="form-group">
             <label>Yeni Şifre (Tekrar)</label>
             <input
               type="password"
               name="confirmPassword"
               value={passwordData.confirmPassword}
               onChange={handlePasswordChange}
               disabled={!isEditingPassword}
               placeholder="Yeni şifreyi tekrar girin"
             />
           </div>

           {/* Uyarı: Şifreler uyuşmazsa */}
           {isEditingPassword && passwordData.newPassword !== passwordData.confirmPassword && (
             <p style={{ color: 'red', marginBottom: '10px' }}>
               Yeni şifreler birbiriyle uyuşmuyor.
             </p>
           )}

           <button
             className="save-button"
             onClick={(e) => {
               e.preventDefault();
               if (isEditingPassword) {
                 if (passwordData.newPassword === passwordData.confirmPassword) {
                   // 🔐 Burada API'ye gönderme işlemi yapılabilir
                   console.log('Şifre güncellendi:', passwordData);
                   setIsEditingPassword(false);
                   setPasswordData({
                     currentPassword: '',
                     newPassword: '',
                     confirmPassword: ''
                   });
                 }
               } else {
                 setIsEditingPassword(true);
               }
             }}
             disabled={
               isEditingPassword &&
               (passwordData.newPassword !== passwordData.confirmPassword ||
                 !passwordData.newPassword ||
                 !passwordData.currentPassword)
             }
           >
             {isEditingPassword ? 'Kaydet' : 'Düzenle'}
           </button>
         </section>



        </div>
      </div>
  );
};

export default ProfilePage;
