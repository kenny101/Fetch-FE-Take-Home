import { listOfDogsSchema } from "$lib/schemas/formSchemas";
import { getAllFavoriteDogs, deleteDogFromDB, insertDogIntoDB, areDogsEqual } from "$lib/server/db.js";
import { error } from '@sveltejs/kit';

export const load = async ({ locals }) => {
    const dogs = await getAllFavoriteDogs(locals.user.id);
    const uniqueDogs: Dog[] = Array.from(new Set(dogs.map(dog => dog.id)))
        .map(id => dogs.find(d => d.id === id))
        .filter(dog => dog !== undefined) as Dog[];
    return { favoriteDogs: uniqueDogs };
};

export const actions = {
    sync: async ({ request, locals }) => {
        const formData = Object.fromEntries(await request.formData()) as {
            favoriteDogs: string;
        };

        let parsedDogs: Dog[] = JSON.parse(formData.favoriteDogs);

        // Validate list of favorite dogs against the schema before making changes to DB
        try {
            listOfDogsSchema.parse(parsedDogs);
        } catch {
            throw error(400, {
                message: 'Invalid data submitted.',
            });
        }

        const favoriteDogs: Dog[] = await getAllFavoriteDogs(locals.user.id);

        // Get dogs that are in parsedDogs but not in favoriteDogs to insert into DB
        const dogsInParsedButNotFavorite = parsedDogs.filter(parsedDog =>
            !favoriteDogs.some(favoriteDog => areDogsEqual(favoriteDog, parsedDog))
        );

        // Get dogs that are in favoriteDogs but not in parsedDogs to delete from DB
        const dogsInFavoriteButNotParsed = favoriteDogs.filter(favoriteDog =>
            !parsedDogs.some(parsedDog => areDogsEqual(parsedDog, favoriteDog))
        );

        dogsInParsedButNotFavorite.map((dog) => { insertDogIntoDB(dog, locals.user.id) })
        dogsInFavoriteButNotParsed.map((dog) => { deleteDogFromDB(dog.id, locals.user.id) })
    }
}
