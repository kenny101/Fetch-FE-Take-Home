import { SECRET_JWT_SECRET } from "$env/static/private";
import jose from "jose";
import { redirect, type RequestEvent} from "@sveltejs/kit";

export const createAuthJWT = async (data: JWTPayload) => {
    const jwt = await new jose.SignJWT(data)
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime('2h')
        .sign(new TextEncoder().encode(SECRET_JWT_SECRET));
    return jwt;
};

export const verifyAuthJWT = async (token: string, event: RequestEvent): Promise<JWTPayload> => {
    try {
        const { payload } = await jose.jwtVerify(
            token,
            new TextEncoder().encode(SECRET_JWT_SECRET)
        );
        return payload as JWTPayload;
    } catch {
        event.cookies.delete('auth_token');
        throw redirect(302, 'login');
    }
};

export const revalidateJWT = async (event: RequestEvent) => {
    if (event.locals.user) {
        const newToken = await createAuthJWT(event.locals.user);
        event.cookies.set('auth_token', newToken);
    } else {
        redirect(302, 'login')
    }
}
