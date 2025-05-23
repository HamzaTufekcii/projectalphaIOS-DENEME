// src/services/listService.js

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
export function getUserLists() {
    return new Promise(resolve =>
        setTimeout(() => resolve([...mockUserLists]), 200)
    );
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
