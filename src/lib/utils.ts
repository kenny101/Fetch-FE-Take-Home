import { goto } from '$app/navigation';
import { PUBLIC_API_URL } from '$env/static/public';
import { writable } from 'svelte/store';

export const favoriteDogs = writable<Dog[]>([]);

/**
 * Synchronize favorite dogs with the server.
 *
 * @param favoriteDogs - An array of Dog objects representing the user's favorite dogs.
 * @returns {Promise<void>} - A promise that resolves when the synchronization is complete.
 */
export async function syncFavoriteDogs(favoriteDogs: Dog[]): Promise<void> {
    let formData = new FormData();
    formData.append('favoriteDogs', JSON.stringify(favoriteDogs));

    await fetch('?/sync', {
        body: formData,
        method: 'POST'
    });
}

/**
 * Adds an 'isFavorite' flag to each dog in the provided list.
 *
 * @param dogsList - The list of dogs to update with the 'isFavorite' flag.
 * @returns A new array of dogs with the 'isFavorite' flag set to false for each dog.
 */
export function addIsFavoriteFlag(dogsList: Dog[]) {
    const updatedWithIsFavoriteFlag = dogsList.map((dog) => ({
        ...dog,
        isFavorite: false,
    }));
    return updatedWithIsFavoriteFlag;
}

/**
 * Searches for dogs based on various criteria.
 *
 * @param {boolean} sortAscending - Whether to sort the results in ascending order based on breed.
 * @param {number} maxAge - The maximum age of the dogs to search for.
 * @param {string} zipcode - The zipcode to filter dogs by.
 * @param {number} size - The size of dogs to search for.
 * @param {string[]} selectedBreeds - An array of selected dog breeds to include in the search.
 *
 * @returns {Promise<DogSearchResult>} A promise that resolves to the result of the dog search.
 */
export const searchDogs = async (
    sortAscending: boolean,
    maxAge: number,
    zipcode: string,
    size: number,
    selectedBreeds: string[]
): Promise<DogSearchResult> => {
    try {
        const sortBreedParam = sortAscending ? '&sort=breed:asc' : '&sort=breed:desc';
        const maxAgeParam = maxAge ? `&ageMax=${maxAge}` : '';
        const zipcodeParam = zipcode.length !== 0 && zipcode.length === 5 ? `&zipCodes=${zipcode}` : '';
        const sizeParam = size ? `&size=${size}` : '';
        const breedsParams =
            selectedBreeds.length && selectedBreeds.length > 0
                ? `breeds=${selectedBreeds.join('&breeds=')}`
                : '';
        const queryUrl = `${PUBLIC_API_URL}/dogs/search?${breedsParams}${sortBreedParam}${maxAgeParam}${zipcodeParam}${sizeParam}`;
        const response = await fetch(queryUrl, {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) goto('/logout');
        const data: DogSearchResult = await response.json();

        return data;
    } catch (error) {
        console.error('Error:', error);
    }

    // Return a default result in case of an error
    return {
        resultIds: [],
        total: 0,
    } as DogSearchResult;
};



/**
 * Fetches the next set of dogs based on the provided pagination query.
 *
 * @param nextPaginationQuery - The pagination query for the next set of dogs.
 * @returns A promise that resolves to the DogSearchResult containing resultIds and total.
 *          If an error occurs during the fetch, a default DogSearchResult is returned.
 */
export const fetchNextDogs = async (nextPaginationQuery: string): Promise<DogSearchResult> => {
    try {
        const queryUrl = `${PUBLIC_API_URL}${nextPaginationQuery}`;
        const response = await fetch(queryUrl, {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) goto('/logout');

        const data: DogSearchResult = await response.json();
        return data;
    } catch (error) {
        // Log any errors that occur during the fetch
        console.error('Error:', error);
    }

    // If an error occurs or the fetch fails, return a default DogSearchResult
    return {
        resultIds: [],
        total: 0
    } as DogSearchResult;
};

/**
 * Fetches list of Dog object from API
 *
 * @param listOfDogIds - An array of dog IDs to fetch information for.
 * @returns An array of Dog objects containing information about the fetched dogs.
 *          If an error occurs during the fetch, an empty array is returned.
 */
export const fetchDogs = async (listOfDogIds: string[]) => {
    try {
        const response = await fetch(`${PUBLIC_API_URL}/dogs`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(listOfDogIds)
        });

        if (!response.ok) goto('/logout');
        const data: Dog[] = addIsFavoriteFlag(await response.json());
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
    return [] as Dog[];
};

/**
 * Fetches random dog `Match` object from list of Dog Ids 
 *
 * @param listOfDogIds - An array of string identifiers representing dog IDs.
 * @returns A Promise that resolves to the matched dog information.
 *          The shape of the resolved object is defined by the `Match` interface.
 *          If an error occurs during the fetch operation, it logs the error
 *          and returns a default `Match` object with an empty string for the 'match' property.
 */
export const fetchMatchedDogId = async (listOfDogIds: string[]): Promise<Match> => {
    try {
        const response = await fetch(`${PUBLIC_API_URL}/dogs/match`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(listOfDogIds)
        });

        if (!response.ok) goto('/logout');
        const data: Match = await response.json();

        return data;
    } catch (error) {
        console.error('Error:', error);
    }
    return { match: '' } as Match;
};


/**
 * Requests login auth token  
 *
 * @param name - Name to authenticate.
 * @param email - Email to authenticate.
 * @returns True if the dog is a favorite, false otherwise.
 */
export const fetchLoginSession = async (name: string, email: string) => {
    try {
        const response = await fetch(`${PUBLIC_API_URL}/auth/login`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email })
        });

        if (response.ok) {
            goto('/');
        } else {
            console.error('Authentication failed');
        }
    } catch (error) {
        console.error('Error:', error);
    }
};


/**
 * Checks if a given dog is present in the array of favorite dogs.
 *
 * @param favoriteDogs - Array of favorite dogs.
 * @param dogToCheck - The dog to check for in the favorites.
 * @returns True if the dog is a favorite, false otherwise.
 */
export const dogIsAFavoriteDog = (favoriteDogs: Dog[], dogToCheck: Dog): boolean => {
    return favoriteDogs.some((favoriteDog: Dog) => areDogIdsEqual(favoriteDog, dogToCheck));
};

/**
 * Checks if two dogs are equal, ignores the favorite attribute from `Dog`
 *
 * @param dog1 - first dog to check
 * @param dog2 - second dog to check
 * @returns True if dog attributes are equal, false otherwise.
 */
export function areDogIdsEqual(dog1: Dog, dog2: Dog): boolean {
    return (
        dog1.id === dog2.id
    );
}