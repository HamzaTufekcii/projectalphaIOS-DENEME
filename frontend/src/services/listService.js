// src/services/listService.js

import axios from 'axios';
import {getUserFavoritesIdFromStorage} from "./userService.js";

const API_URL = 'http://localhost:8080/api/users';

export const addToList = async (userId, listId, itemId) => {
    const response = await axios.post(`${API_URL}/diner_user/${userId}/lists/${listId}/items/${itemId}`, {});
    return response.data;
}
export const addToFavorites = async (userId, itemId) => {
    const response = await axios.post(`${API_URL}/diner_user/${userId}/lists/${getUserFavoritesIdFromStorage()}/items/${itemId}`, {});
    return response.data;
}
export const removeFromList = async (userId, listId,itemId) => {
    await axios.delete(`${API_URL}/diner_user/${userId}/lists/${listId}/items/${itemId}`);
}
export const createList = async (userId, name, isPublic) => {
    const response = await axios.post(
        `${API_URL}/diner_user/${userId}/lists`,
        {
        name: name,
        isPublic: isPublic,
    });
    return response.data;
}//"/diner_user/{userId}/lists"
export const removeList = async (userId, listId) => {

    await axios.delete(`${API_URL}/diner_user/${userId}/lists/${listId}`);
}

export const updateList = async (userId, name, isPublic, listId) => {
    const response = await axios.patch(
        `${API_URL}/diner_user/${userId}/lists/${listId}`,
        {
            name: name,
            isPublic: isPublic,
        });
    return response.data;
}


// Mock veri
let mockUserLists = [
    {
        id: 'u1',
        name: 'Hafta Sonu Favorilerim',
        containsItem: false,
        isPrivate: false,
        businesses: []
    },
    {
        id: 'u3',
        name: 'Favori Kahvaltıcılar',
        containsItem: false,
        isPrivate: false,
        businesses: []
    }
];


/** Kullanıcının kendi listelerini döner */
export const getUserLists = async (id) => {

    const listResponse = await axios.get(`${API_URL}/diner_user/${id}/lists`);
    const lists = listResponse.data;

// "favorilerim" isimli listeyi filtrele (isim küçük-büyük harfe duyarlı olabilir ona göre kontrol yap)
    const filteredLists = lists.filter(list => list.name.toLowerCase() !== 'favorilerim');

    return filteredLists;

}
export const getUserListItems = async(id,listId) => {
    const listItemResponse = await axios.get(`${API_URL}/diner_user/${id}/lists/${listId}/items`);

    return listItemResponse.data;
}

/** Halka açık listeleri döner */
export function getPublicLists() {
    return new Promise(resolve =>
        setTimeout(
            () => resolve(mockUserLists.filter(l => !l.isPrivate)),
            200
        )
    );
}

/** Yeni bir liste oluşturur */


/** Var olan bir listeyi siler (mockUserLists’ten kaldırır) */
export function deleteList(listId) {
    mockUserLists = mockUserLists.filter(l => l.id !== listId);
    return Promise.resolve();
}

