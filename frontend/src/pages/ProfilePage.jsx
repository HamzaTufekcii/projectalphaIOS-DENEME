import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/ProfilePage.css';

import {
  getUserIdFromStorage,
  getUserRoleFromStorage,
  fetchUserData,
  updateUserData,
  changePassword
} from '../services/userService';
import {checkPassword, updateUser} from "../services/authService.js";

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
  const { userId } = useParams();
  const {role} = useParams();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [useMockData, setUseMockData] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isCurrentFalse,setIsCurrentFalse] = useState(false);
  const [isSucceed, setIsSucceed] = useState(false);
  const [isLessThanSix, setIsLessThanSix] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const profileData = JSON.parse(localStorage.getItem('userData'));
const [passwordData, setPasswordData] = useState({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});


  const currentUserId = userId || getUserIdFromStorage().trim();
  const currentUserRole = role || getUserRoleFromStorage().trim();


  useEffect(() => {
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');

    if (!token || !userJson) {
      navigate('/');
      return;
    }

    const userData = JSON.parse(userJson);
    const userId = userData.id || userData.userId;
const getUserData = async () => {
  try{
    setUserProfile(profileData);
    setEditFormData(profileData);
    setIsLoading(false);
  } catch (err) {
    console.error('Profil verisi alınamadı, mock veri kullanılacak:', err);
    setUserProfile(MOCK_USER_PROFILE);
    setEditFormData(MOCK_USER_PROFILE);
    setUseMockData(true);
    setIsLoading(false);
    }
  };
    getUserData();
  }, [currentUserId, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    const updatedPasswordData = { ...passwordData, [name]: value };
    setPasswordData(updatedPasswordData);

    // check after state is updated
    if (
        updatedPasswordData.newPassword.length >= 6 &&
        updatedPasswordData.confirmPassword.length >= 6
    ) {
      setIsLessThanSix(false);
    } else {
      setIsLessThanSix(true);
    }
  };

  const handleProfileEdit = async (e) => {
    e.preventDefault();
    try {
      await updateUserData(editFormData, currentUserId, currentUserRole);
      setUserProfile(editFormData);
      localStorage.setItem("shouldRunAfterReload", "true");
      await getUser();
      setIsEditing(false);
    } catch (err) {
      console.error('Güncelleme hatası:', err);
      setUserProfile(editFormData);
      setIsEditing(false);
    }
  };
  const checkLength = () => {
    if (
        passwordData.newPassword.length < 6 ||
        passwordData.confirmPassword.length < 6
    ) {
      setIsLessThanSix(true);
    } else {
      setIsLessThanSix(false);
    }
  };
  const handlePasswordEdit = async (e) => {
    setIsCurrentFalse(false);
    try {
      const response = await checkPassword(userProfile.email, passwordData.currentPassword, currentUserRole);
      console.log(response.status);
      setIsCurrentFalse(false);
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || '';
      if (message.includes("Invalid login credentials")) {
        setIsCurrentFalse(true);
        return null;
      }
    }setIsCurrentFalse(false);

    try{
      const responseChange = await changePassword(currentUserId, passwordData.confirmPassword);
      console.log(responseChange.status);
      setIsSucceed(true);
      setIsCurrentFalse(false);
    } catch(err) {
      setIsSucceed(false);
      return null;
    }
  }
  const getUser = async () => {
    if (localStorage.getItem("shouldRunAfterReload") === "true") {
        localStorage.removeItem("shouldRunAfterReload");
        setIsLoading(false);
        window.location.reload();
    }
  }

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
                name="phone_numb"
                value={editFormData.phone_numb || ''}
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
           {isCurrentFalse === true && (
               <p style={{ color: 'red', marginBottom: '10px' }}>
                 Mevcut şifreni yanlış girdin.
               </p>
           )}
           {isCurrentFalse === false && (
               <p style={{ color: 'red', marginBottom: '10px' }}>
               </p>
           )}
           {isSucceed && passwordData.newPassword === passwordData.confirmPassword && (
               <div className="verified-badge">
                  ✔ Şifren değiştirildi.
               </div>
           )}
           {isLessThanSix && isEditingPassword && (
               <p style={{ color: 'red', marginBottom: '10px' }}>
                 Şifren 6 haneden az olmamalıdır.
               </p>
           )}

           <button
             className="save-button"
             onClick={(e) => {
               e.preventDefault();
               setIsCurrentFalse(false);
               setIsSucceed(false);
               if (isEditingPassword) {
                 if (passwordData.newPassword === passwordData.confirmPassword) {
                   handlePasswordEdit();
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
                isEditingPassword && (
                    passwordData.newPassword !== passwordData.confirmPassword ||
                    !passwordData.newPassword ||
                     !passwordData.currentPassword ||
                     isLessThanSix
               )

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
