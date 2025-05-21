// src/services/listService.js

// 1) Modül seviyesinde mock dizi
let mockLists = [
    { id: '1', name: 'Hafta Sonu Favorilerim', containsItem: false },
    { id: '2', name: 'Denenecek Yerler',       containsItem: false },
    { id: '3', name: 'Favori Kahvaltıcılar',    containsItem: false },
];

// 2) Listeleri dönen fonksiyon (değişmedi)
export async function getUserLists() {
    return new Promise(resolve => {
        setTimeout(() => resolve([...mockLists]), 200);
    });
}

// → İşte eklenecek: mockLists’i günceller
export async function addToList(itemId, listId) {
    mockLists = mockLists.map(l =>
        l.id === listId ? { ...l, containsItem: true } : l
    );
    return Promise.resolve();
}

// → İşte eklenecek: mockLists’i günceller
export async function removeFromList(itemId, listId) {
    mockLists = mockLists.map(l =>
        l.id === listId ? { ...l, containsItem: false } : l
    );
    return Promise.resolve();
}

// 5) Yeni liste oluşturma (zaten başına ekliyorduk)
export async function createList({ name }) {
    const newList = {
        id: Date.now().toString(),
        name,
        containsItem: false,
        userName: 'Sen',
        businesses: [],
    };
    mockLists = [newList, ...mockLists];
    return new Promise(resolve => {
        setTimeout(() => resolve(newList), 200);
    });
}
