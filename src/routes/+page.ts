import type { PageLoad } from './$types';
import { PUBLIC_API_URL } from '$env/static/public';
import { redirect } from '@sveltejs/kit';
import { goto } from '$app/navigation';


export const load = (async ({ fetch, params }) => {
	try {
		const response = await fetch(`${PUBLIC_API_URL}/dogs/breeds`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
			credentials: 'include',
		})

		if (response.ok) {
            const listOfBreeds:string[] = await response.json();
            return {
                breeds: listOfBreeds,
            }
		}
		
		goto('/login')

        return {
            breeds: [],
        }
	} catch (error) {
		console.error('Error:', error);
	}
}) satisfies PageLoad;