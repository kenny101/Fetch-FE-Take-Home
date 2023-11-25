import { db } from "$lib/server/db.js";
import { verifyAuthJWT } from "$lib/server/jwt.js";
import { dogsTable, usersTable } from "$lib/server/schema.js";
import { redirect } from "@sveltejs/kit";
import { eq, and } from "drizzle-orm";



export const load = async ({ cookies }) => {
    const token = cookies.get("auth_token");

    if (!token) {
        throw redirect(301, "/login");
    }

    const userPayload = await verifyAuthJWT(token);
    const dogs = await getAllFavoriteDogs(userPayload.id);
    return { favoriteDogs: dogs };
};

async function getAllFavoriteDogs(user_id: number) {
    const dogs: Dog[] = await db
        .select({
            id: dogsTable.dog_id,
            img: dogsTable.img,
            name: dogsTable.name,
            age: dogsTable.age,
            zip_code: dogsTable.zip_code,
            breed: dogsTable.breed,
            isFavorite: dogsTable.is_favorite,
        })
        .from(dogsTable)
        .where(eq(dogsTable.user_id, user_id));
    return dogs;
}

function areDogsEqual(dog1: Dog, dog2: Dog): boolean {
    return (
        dog1.id === dog2.id &&
        dog1.img === dog2.img &&
        dog1.name === dog2.name &&
        dog1.age === dog2.age &&
        dog1.zip_code === dog2.zip_code &&
        dog1.breed === dog2.breed &&
        dog1.isFavorite === dog2.isFavorite
    );
}

async function deleteDogFromDB(dogId: string, user_id: number) {
    await db
        .delete(dogsTable)
        .where(
            and(
                eq(dogsTable.dog_id, dogId),
                eq(dogsTable.user_id, user_id)
            )
        );
}

async function insertDogIntoDB(dog: Dog, user_id: number) {
    await db.insert(dogsTable).values({
        img: dog.img,
        name: dog.name,
        age: dog.age,
        zip_code: dog.zip_code,
        breed: dog.breed,
        is_favorite: dog.isFavorite,
        dog_id: dog.id,
        user_id: user_id
    });

}

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
    }
}
