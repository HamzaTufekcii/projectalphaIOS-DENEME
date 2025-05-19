import axios from 'axios';

const API_URL = 'http://localhost:8080/api/users';

/**
 * save user data to local storage
 * @param {Object} userData - User data with user info
 * @param {String} role - User role
 */
export const saveUserData = (userData, role) => {
    if(role === 'diner_user'){
        localStorage.setItem('userData', JSON.stringify(userData));
    } else if(role === 'owner_user') {
        localStorage.setItem('userData', JSON.stringify(userData.profile));
        localStorage.setItem('ownerData', JSON.stringify(userData?.ownedBusiness));
    } else {
        localStorage.removeItem('userData');
        localStorage.removeItem('ownerData');
    }
}
export const getUserData = (role) => {
    if(role === 'diner_user'){
        const userData = JSON.parse(localStorage.getItem('userData'));
        return {userData};
    } else if(role === 'owner_user') {
        const userData = JSON.parse(localStorage.getItem('ownerData'));
        return {userData};
    }
}
export const getUserIdFromStorage = () => {
    const userJson = localStorage.getItem('user');
    if (!userJson) return null;

    try {
        const userData = JSON.parse(userJson);
        return userData.id || userData.userId || null;
    } catch (e) {
        console.error('Error parsing user data', e);
        return null;
    }
};
export const getUserRoleFromStorage = () => {
    const userJson = localStorage.getItem('user');
    if (!userJson) return null;
    try{
        const userData = JSON.parse(userJson);
        return userData.app_metadata.role || null;
    }catch(e){
        console.error('There is no role in token.', e);
        return null;
    }
}
export const fetchUserData = async (role, id) => {
    try {
        const profileResponse = await axios.get(`${API_URL}/${role}/${id}/profile`);
        if(role === 'diner_user'){
            saveUserData(profileResponse.data, role);
        } else if(role === 'owner_user') {
            saveUserData(profileResponse.data, role);
        }
    } catch (err) {
        console.error('Profil verisi alınamadı, mock veri kullanılacak:', err);
        throw err.response?.data || err.message || 'Profil verisi alınamadı, mock veri kullanılacak: ' + err.message;
    }
};
export const updateUserData = async (newData, id, role) => {
    const requestBody = {
        email: newData.email.trim(),
        role,

        requestDiner: {
            name: newData.name.trim(),
            surname: newData.surname.trim(),
            phone_numb: newData.phone_numb.trim(),
        }
    }
    try {
        await axios.put(`${API_URL}/${role}/${id}/profile`, requestBody);
        await fetchUserData(role, id);
    } catch (err) {
        console.error('Güncelleme hatası:', err);
    }
}