import { writable } from 'svelte/store'

export const favoriteDogs = writable<Dog[]>([]);
export const removedDogs = writable<Dog[]>([]);