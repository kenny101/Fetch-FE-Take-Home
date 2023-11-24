import type { PageLoad } from './$types';
import { PUBLIC_API_URL } from '$env/static/public';
import { goto } from '$app/navigation';
import { browser } from '$app/environment';

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
			const listOfBreeds: string[] = await response.json();
			return {
				breeds: listOfBreeds,
			}
		}

		$: if (browser) {
			goto('login')
		}

		return {
			breeds: [],
		}
	} catch (error) {
		console.error('Error:', error);
	}
}) satisfies PageLoad;