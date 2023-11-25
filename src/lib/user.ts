import { writable } from 'svelte/store'

export const favoriteDogs = writable<Dog[]>([]);


export function resetDogStores() {
    favoriteDogs.set([]);
}