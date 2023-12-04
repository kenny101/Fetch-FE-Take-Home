// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

type JWTPayload = {
    name: string;
    email: string;
    id: number
};


namespace App {
    // interface Error {}
    interface Locals {
        user: JWTPayload;
    }
    // interface PageData {}
    // interface Platform {}
}

interface DogSearchResult {
    resultIds: string[];
    total: number;
    next?: string;
    prev?: string;
  }
  

interface Dog {
    id: string
    img: string
    name: string
    age: number
    zip_code: string
    breed: string
    isFavorite: boolean
}

interface Match {
    match: string
}

interface User {
    name: string
    email: string
}
