// src/services/listService.js

import axios from 'axios';

const API_URL = 'http://localhost:8080/api/users';


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

    return listResponse.data;

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
export function createList({ name, isPrivate }) {
    const newList = {
        id: Date.now().toString(),
        name,
        isPrivate: !!isPrivate,
        containsItem: false,
        businesses: []
    };
    mockUserLists = [newList, ...mockUserLists];
    return new Promise(resolve =>
        setTimeout(() => resolve(newList), 200)
    );
}

/** Var olan bir listeyi siler (mockUserLists’ten kaldırır) */
export function deleteList(listId) {
    mockUserLists = mockUserLists.filter(l => l.id !== listId);
    return Promise.resolve();
}
