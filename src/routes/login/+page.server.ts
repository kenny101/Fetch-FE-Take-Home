import { db } from "$lib/server/db.js";
import { usersTable } from "$lib/server/schema.js";
import { eq, and } from "drizzle-orm";
import { createAuthJWT } from "$lib/server/jwt.js";
import { userLoginSchema } from "$lib/schemas/formSchemas.js";
import { message, setError, superValidate } from "sveltekit-superforms/server";

export const load = async ({ request }) => {
  const form = await superValidate(request, userLoginSchema);
  return {
    form
  }
};

export const actions = {
  default: async ({ request, cookies }) => {
    const form = await superValidate(request, userLoginSchema);

    form.data.email = form.data.email.toLowerCase();
    form.data.name = form.data.name.toLowerCase();

    if (!form.valid) {
      return message(form, 'Invalid form');
    }

    const userGivenEmail = await db
      .select({ email: usersTable.email, name: usersTable.name })
      .from(usersTable)
      .where(eq(usersTable.email, form.data.email))
      .limit(1);

    if (userGivenEmail[0]) {
      if (userGivenEmail[0].name !== form.data.name) {
        return setError(form, 'email', 'Email already exists with a different name.');
      }
    }

    // check if the user exists and create new user if not exists
    let user = await db
      .select({
        email: usersTable.email,
        name: usersTable.name,
        id: usersTable.id
      })
      .from(usersTable)
      .where(and(eq(usersTable.email, form.data.email), eq(usersTable.name, form.data.name)))
      .limit(1);

    if (!user.length) {
      user = await db.insert(usersTable).values({
        email: form.data.email,
        name: form.data.name,
      }).returning();
    }

    const token = await createAuthJWT({
      name: form.data.name,
      email: form.data.email,
      id: user[0].id
    });

    cookies.set("auth_token", token, {
      path: "/",
      secure: true,
      httpOnly: true,
      maxAge: 60 * 60 * 2,
      sameSite: 'strict'
    });
  },
};

