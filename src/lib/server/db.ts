import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { SECRET_DB_URL, SECRET_DB_AUTH_TOKEN } from '$env/static/private';
import { dogsTable } from './schema';
import { eq, and } from "drizzle-orm";


export async function deleteDogFromDB(dogId: string, user_id: number) {
    await db
        .delete(dogsTable)
        .where(
            and(
                eq(dogsTable.dog_id, dogId),
                eq(dogsTable.user_id, user_id)
            )
        );
}

export async function getAllFavoriteDogs(user_id: number)  {
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

export async function insertDogIntoDB(dog: Dog, user_id: number) {
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

/**
 * Checks if two dogs are equal, ignores the favorite attribut from `Dog`
 *
 * @param dog1 - first dog to check
 * @param dog2 - second dog to check
 * @returns True if dog attributes are equal, false otherwise.
 */
export function areDogsEqual(dog1: Dog, dog2: Dog): boolean {
    return (
        dog1.id === dog2.id &&
        dog1.img === dog2.img &&
        dog1.name === dog2.name &&
        dog1.age === dog2.age &&
        dog1.zip_code === dog2.zip_code &&
        dog1.breed === dog2.breed && 
        dog1.isFavorite == dog2.isFavorite
    );
}

const client = createClient({ url: SECRET_DB_URL, authToken: SECRET_DB_AUTH_TOKEN });
 
export const db = drizzle(client);