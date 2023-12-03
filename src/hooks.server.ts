import { verifyAuthJWT, revalidateJWT } from "$lib/server/jwt";
import { redirect, type Handle } from "@sveltejs/kit";



export const handle: Handle = async ({ event, resolve }) => {
    const token = event.cookies.get("auth_token");

    if (event.url.pathname === '/') {
        if (!token) throw redirect(302, "/login");

        event.locals.user = await verifyAuthJWT(token, event);
        revalidateJWT(event);
    }

    if (event.url.pathname === '/login') {
        if (token) {
            event.locals.user = await verifyAuthJWT(token, event);
            throw redirect(302, "/");
        }
    }

    const response = await resolve(event);
    return response;
}