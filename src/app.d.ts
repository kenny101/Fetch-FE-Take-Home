// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
}

interface Dog {
    id: string
    img: string
    name: string
    age: number
    zip_code: string
    breed: string
    isFavorite: boolean // added additional bool flag for unfavoriting favorited dogs
}

interface Match {
    match: string
}

interface User {
    name: string
    email: string
}