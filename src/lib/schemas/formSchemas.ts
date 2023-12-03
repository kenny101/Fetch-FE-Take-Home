import { z } from "zod";

export const userLoginSchema = z.object({
  name: z.string().min(1),
  email: z.string().email()
})
