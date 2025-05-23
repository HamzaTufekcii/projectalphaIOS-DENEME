// src/services/listService.js

// 1️⃣ Kullanıcının oluşturduğu listeler; her liste businesses dizisi tutuyor
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

// 2️⃣ Keşfet sekmesi için statik public listeler
const mockPublicLists = [
    { id: 'p1', name: 'Keşif Listesi 1' },
    { id: 'p2', name: 'Keşif Listesi 2' },
    { id: 'p3', name: 'Keşif Listesi 3' }
];

/** Kullanıcının listelerini getirir */
export async function getUserLists() {
    return new Promise(resolve => setTimeout(() => resolve([...mockUserLists]), 200));
}

/** Keşfet sekmesi için public listeleri getirir */
export async function getPublicLists() {
    return new Promise(resolve => setTimeout(() => resolve([...mockPublicLists]), 200));
}

/** Tek bir listeyi ve içindeki işletmeleri döner */
export async function getListDetails(listId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const list = mockUserLists.find(l => l.id === listId);
            if (!list) reject(new Error('Liste bulunamadı'));
            else resolve({ ...list });
        }, 200);
    });
}

/** Item'ı bir listeye ekler (containsItem ve businesses güncellenir) */
export async function addToList(itemId, listId) {
    mockUserLists = mockUserLists.map(l => {
        if (l.id === listId) {
            return {
                ...l,
                containsItem: true,
                businesses: [...l.businesses, { id: itemId }]
            };
        }
        return l;
    });
    return Promise.resolve();
}

/** Item'ı listeden çıkarır */
export async function removeFromList(itemId, listId) {
    mockUserLists = mockUserLists.map(l => {
        if (l.id === listId) {
            return {
                ...l,
                containsItem: false,
                businesses: l.businesses.filter(b => b.id !== itemId)
            };
        }
        return l;
    });
    return Promise.resolve();
}

/** Yeni bir liste oluşturur (sadece kullanıcı listelerine ekler) */
export async function createList({ name, isPrivate }) {
    const newList = {
        id: Date.now().toString(),
        name,
        isPrivate: !!isPrivate,
        containsItem: false,
        userName: 'Sen',
        businesses: []
    };
    mockUserLists = [newList, ...mockUserLists];
    return new Promise(resolve => setTimeout(() => resolve(newList), 200));
}
