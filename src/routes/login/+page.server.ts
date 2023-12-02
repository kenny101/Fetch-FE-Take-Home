import { db } from "$lib/server/db.js";
import { usersTable } from "$lib/server/schema.js";
import { error, fail, redirect } from "@sveltejs/kit";
import { eq, and } from "drizzle-orm";
import { createAuthJWT } from "$lib/server/jwt.js";
import { z } from "zod";
import { superValidate } from "sveltekit-superforms/server";

const userLoginSchema = z.object({
  name: z.string().min(1),
  email: z.string().email()
})

export const load = async (event) => {
  // get the sessionId from the cookie
  const token = event.cookies.get("auth_token");

  // if there is a token, redirect to the user page
  if (token && token !== "") {
    throw redirect(301, "/");
  }

  const form = await superValidate(event, userLoginSchema);

  return {
    form
  }
};

export const actions = {
  default: async (event) => {
    const form = await superValidate(event, userLoginSchema);
    console.log("form:", form);

    if (!form.valid) {
      return fail(400, { form })
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

    event.cookies.set("auth_token", token, {
      path: "/",
      secure: true,
      httpOnly: true,
      maxAge: 60 * 60 * 2,
    });

    throw redirect(301, "/");
  },
};

