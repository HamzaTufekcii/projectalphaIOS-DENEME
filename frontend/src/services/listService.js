// src/services/listService.js

import axios from 'axios';
import {getUserFavoritesIdFromStorage, getUserIdFromStorage} from "./userService.js";

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
        `${API_URL}/diner_user/${userId}/lists`, {
            name: name,
            "is_public": isPublic
        });
    return response.data;

}
export const removeList = async (userId, listId) => {

    await axios.delete(`${API_URL}/diner_user/${userId}/lists/${listId}`);
}

export const updateList = async (userId, name, isPublic, listId) => {
    const response = await axios.patch(
        `${API_URL}/diner_user/${userId}/lists/${listId}`,
        {
            name: name,
            "is_public": isPublic,
        });
    return response.data;
}



/** Kullanıcının kendi listelerini döner */
export const getUserLists = async (id) => {

    const listResponse = await axios.get(`${API_URL}/diner_user/${id}/lists`);
    const lists = listResponse.data;

    return lists;

}
export const getUserListItems = async(id,listId) => {
    const listItemResponse = await axios.get(`${API_URL}/diner_user/${id}/lists/${listId}/items`);

    return listItemResponse.data;
}

/** Halka açık listeleri döner */
export const getPublicLists = async () => {
    const listResponse = await axios.get(`${API_URL}/diner_user/public/lists`);
    return listResponse.data;

}

/** Yeni bir liste oluşturur */


/** Var olan bir listeyi siler (mockUserLists’ten kaldırır) */
export function deleteList(listId) {
    mockUserLists = mockUserLists.filter(l => l.id !== listId);
    return Promise.resolve();
}
export const toggleFavorite = async (id) => {

    const favorites = await getUserListItems(getUserIdFromStorage(), getUserFavoritesIdFromStorage());
    const isFavorited = favorites.some(fav => fav.id === id);


    if (isFavorited) {
        await removeFromList(getUserIdFromStorage(), getUserFavoritesIdFromStorage(), id);
        return await getUserListItems(getUserIdFromStorage(), getUserFavoritesIdFromStorage());

    } else {
        await addToFavorites(getUserIdFromStorage(), id);
        return await getUserListItems(getUserIdFromStorage(), getUserFavoritesIdFromStorage());
    }
}
