import axios from 'axios';

const API_URL = 'http://localhost:8080/api/users';

/**
 * save user data to local storage
 * @param {Object} userData - User data with user info
 * @param {String} role - User role
 */
export const saveUserData = (userData, role) => {
    if(role === 'diner_user'){
        localStorage.setItem('userData', JSON.stringify(userData.profile));
        const favoriteList = userData?.dinerLists?.find(list => list.name === 'Favorilerim');
        if (favoriteList) {
            localStorage.setItem('userLists', JSON.stringify(favoriteList));
        } else {
            localStorage.removeItem('userLists');
        }
    } else if(role === 'owner_user') {
        localStorage.setItem('userData', JSON.stringify(userData.profile));
        localStorage.setItem('ownerData', JSON.stringify(userData?.ownedBusiness));
    } else {
        localStorage.removeItem('userData');
        localStorage.removeItem('ownerData');
    }
}
export const changePassword = async (id, newPassword) => {
    try{
        const response =
            await axios.patch(`${API_URL}/${id}/change-password`,
                 { newPassword: newPassword.trim() },
                { headers: {'Content-Type': 'application/json'} }
            );
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message || 'Password is not matched';
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
export const getUserFavoritesIdFromStorage = () => {
    const stored = localStorage.getItem("userLists");
    if (stored) {
        const favorilerim = JSON.parse(stored); // doğrudan obje
        return favorilerim?.id;
    }
    return null;
}
export const getUserFavorites = async () =>{
    const favoriId = getUserFavoritesIdFromStorage();
    if(favoriId){
        try{
            const response = await axios.get(`${API_URL}/${favoriId}/favorites`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message || 'Error getting favorites';
        }
    }
}
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

export const getUserReviews = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/diner_user/${id}/reviews`);
        return response.data.data;
    } catch (error) {
        throw error.response?.data || error.message || 'Error getting reviews';
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
    if(role === 'owner_user'){
        const requestBody = {
            email: newData.email.trim(),
            role,

            requestOwner: {
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
    if(role === 'diner_user') {
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
}