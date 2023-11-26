import { writable } from 'svelte/store';

export const favoriteDogs = writable<Dog[]>([]);

export async function syncFavoriteDogs(favoriteDogs: Dog[]) {
    let formData = new FormData();
    formData.append('favoriteDogs', JSON.stringify(favoriteDogs));

    fetch('?/sync', {
        body: formData,
        method: 'POST'
    });
}

export function addIsFavoriteFlag(dogsList: Dog[]) {
    const updatedWithIsFavoriteFlag = dogsList.map((dog) => ({
        ...dog,
        isFavorite: false
    }));
    return updatedWithIsFavoriteFlag;
}