import { z } from "zod";

export const userLoginSchema = z.object({
  name: z.string().min(1),
  email: z.string().email()
})

export const listOfDogsSchema = z.array(z.object({
  id: z.string(),
  img: z.string().url(),
  name: z.string(),
  age: z.number(),
  zip_code: z.string(),
  breed: z.string(),
  isFavorite: z.boolean(),
}));
