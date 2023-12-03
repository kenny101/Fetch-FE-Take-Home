import { getAllFavoriteDogs, areDogsEqual, deleteDogFromDB, insertDogIntoDB } from "$lib/server/db.js";
import { verifyAuthJWT } from "$lib/server/jwt.js";
import { redirect } from "@sveltejs/kit";

export const load = async ({ cookies }) => {
    const token = cookies.get("auth_token");

    if (!token) {
        throw redirect(301, "/login");
    }

    const userPayload = await verifyAuthJWT(token);
    const dogs = await getAllFavoriteDogs(userPayload.id);
    const uniqueDogs: Dog[] = Array.from(new Set(dogs.map(dog => dog.id)))
        .map(id => dogs.find(d => d.id === id))
        .filter(dog => dog !== undefined) as Dog[];
    return { favoriteDogs: uniqueDogs };
};

export const actions = {
    sync: async (event) => {
        const formData = Object.fromEntries(await event.request.formData()) as {
            favoriteDogs: string;
        };

        let parsedDogs: Dog[] = JSON.parse(formData.favoriteDogs);
        const token = event.cookies.get("auth_token");
        if (!token) {
            throw redirect(301, "/login");
        }

        const userPayload = await verifyAuthJWT(token);
        const favoriteDogs: Dog[] = await getAllFavoriteDogs(userPayload.id);

        // Get dogs that are in parsedDogs but not in favoriteDogs to insert into DB
        const dogsInParsedButNotFavorite = parsedDogs.filter(parsedDog =>
            !favoriteDogs.some(favoriteDog => areDogsEqual(favoriteDog, parsedDog))
        );

        // Get dogs that are in favoriteDogs but not in parsedDogs to delete from DB
        const dogsInFavoriteButNotParsed = favoriteDogs.filter(favoriteDog =>
            !parsedDogs.some(parsedDog => areDogsEqual(parsedDog, favoriteDog))
        );

        dogsInParsedButNotFavorite.map((dog) => { insertDogIntoDB(dog, userPayload.id) })
        dogsInFavoriteButNotParsed.map((dog) => { deleteDogFromDB(dog.id, userPayload.id) })

        return await getAllFavoriteDogs(userPayload.id);
    }
}
