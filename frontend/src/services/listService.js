import axios from 'axios';

const API_URL = 'http://localhost:8080/api/users';

// — Mock veri (sadece keşfet modu için) —
let mockUserLists = [
    { id: 'u1', name: 'Hafta Sonu Favorilerim', containsItem: false, isPrivate: false, businesses: [] },
    { id: 'u3', name: 'Favori Kahvaltıcılar', containsItem: false, isPrivate: false, businesses: [] }
];

/** Kullanıcının kendi listelerini döner */
export const getUserLists = async (userId) => {
    const res = await axios.get(`${API_URL}/diner_user/${userId}/lists`);
    return res.data;
};

/** Bir listenin içindeki restoranları döner */
export const getUserListItems = async (userId, listId) => {
    const res = await axios.get(`${API_URL}/diner_user/${userId}/lists/${listId}/items`);
    return res.data;
};

/** Halka açık (public) listeleri döner (mock) */
export const getPublicLists = () => {
    return new Promise(resolve =>
        setTimeout(() => resolve(mockUserLists.filter(l => !l.isPrivate)), 200)
    );
};

/** Yeni bir liste oluşturur (mock) */
export const createList = ({ name, isPrivate }) => {
    const newList = {
        id: Date.now().toString(),
        name,
        isPrivate: !!isPrivate,
        containsItem: false,
        businesses: []
    };
    mockUserLists = [newList, ...mockUserLists];
    return new Promise(resolve => setTimeout(() => resolve(newList), 200));
};

/** Var olan bir listeyi siler (mock) */
export const deleteList = (listId) => {
    mockUserLists = mockUserLists.filter(l => l.id !== listId);
    return Promise.resolve();
};

/** Bir liste içinden restoranı kaldırır */
export const removeFromList = async (userId, listId, businessId) => {
    const res = await axios.delete(
        `${API_URL}/diner_user/${userId}/lists/${listId}/items/${businessId}`
    );
    return res.data;
};

/** Bir liste adını günceller */
export const updateListName = async (userId, listId, newName) => {
    const res = await axios.put(
        `${API_URL}/diner_user/${userId}/lists/${listId}`,
        { name: newName }
    );
    return res.data;
};
