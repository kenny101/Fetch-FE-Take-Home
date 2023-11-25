import { db } from "$lib/server/db.js";
import { usersTable } from "$lib/server/schema.js";
import { error, redirect } from "@sveltejs/kit";
import { eq, and } from "drizzle-orm";
import { createAuthJWT } from "$lib/server/jwt.js";


export const load = async (event) => {
  // get the sessionId from the cookie
  const token = event.cookies.get("auth_token");

  // if there is a token, redirect to the user page
  if (token && token !== "") {
    throw redirect(301, "/");
  }
};

export const actions = {
  default: async (event) => {
    const formData = Object.fromEntries(await event.request.formData()) as {
      email: string;
      name: string;
    };

    if (!formData.email || !formData.name) {
      throw error(400, "must provide name and email");
    }

    // check if the user exists and create new user if not exists
    const user = await db
      .select({
        email: usersTable.email,
        name: usersTable.name,
        id: usersTable.id
      })
      .from(usersTable)
      .where(and(eq(usersTable.email, formData.email), eq(usersTable.name, formData.name)))
      .limit(1);

    let userId: number = 0;
    if (user.length) userId = user[0].id;

    if (user.length === 0) {
      const newUser = await db.insert(usersTable).values({
        email: formData.email,
        name: formData.name,
      }).returning();
      userId = newUser[0].id;
    }

    // create the JWT
    const token = await createAuthJWT({
      name: formData.name,
      email: formData.email,
      id: userId
    });

    event.cookies.set("auth_token", token, {
      path: "/",
      secure: true,
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 60 * 60
    });

    throw redirect(301, "/");
  },
};

