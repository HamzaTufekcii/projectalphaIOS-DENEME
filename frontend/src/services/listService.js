// src/services/listService.js

import axios from 'axios';
import {getUserFavoritesIdFromStorage} from "./userService.js";

const API_URL = 'api/users';

export const addToList = async (userId, listId, itemId) => {
    const response = await axios.post(`${API_URL}/diner_user/${userId}/lists/${listId}/items/${itemId}`);
    return response.data;
}
export const addToFavorites = async (userId, itemId) => {
    const response = await axios.post(`${API_URL}/diner_user/${userId}/lists/${getUserFavoritesIdFromStorage()}/items/${itemId}`);
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

export const toggleFavorite = async (userId, itemId) => {
    const favorites = await getUserListItems(userId, getUserFavoritesIdFromStorage());
    const isFavorited = favorites.some(fav => fav.id === itemId);

    if (isFavorited) {
        await removeFromList(userId, getUserFavoritesIdFromStorage(), itemId);
    } else {
        await addToFavorites(userId, itemId);
    }

    return await getUserListItems(userId, getUserFavoritesIdFromStorage());
}
