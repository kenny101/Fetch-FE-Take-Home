import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
    event.cookies.delete("auth_token");
    throw redirect(301, '/login');
};