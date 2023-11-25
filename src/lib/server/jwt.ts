import { SECRET_JWT_SECRET } from "$env/static/private";
import { error } from "@sveltejs/kit";
import * as jose from "jose";

type JWTPayload = {
    name: string;
    email: string;
    id: number
};

export const createAuthJWT = async (data: JWTPayload) => {
    const jwt = await new jose.SignJWT(data)
        .setProtectedHeader({ alg: "HS256" })
        .sign(new TextEncoder().encode(SECRET_JWT_SECRET));
    return jwt;
};

export const verifyAuthJWT = async (token: string) => {
    try {
        const { payload } = await jose.jwtVerify(
            token,
            new TextEncoder().encode(SECRET_JWT_SECRET)
        );
        return payload as JWTPayload;
    } catch {
        throw error(401, "Invalid or missing JWT: Not Logged in");
    }
};