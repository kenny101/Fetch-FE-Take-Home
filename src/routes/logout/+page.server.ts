import { redirect } from '@sveltejs/kit';

export const load = async ({ cookies }) => {
    cookies.delete("auth_token");
    throw redirect(302, '/login');
};