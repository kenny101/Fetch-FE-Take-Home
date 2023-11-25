import "dotenv/config";
import { migrate } from "drizzle-orm/libsql/migrator";
import { createClient } from '@libsql/client';
import { drizzle } from "drizzle-orm/libsql/driver";

const client = createClient({
  url: process.env.SECRET_DB_URL as string,
  authToken: process.env.SECRET_DB_AUTH_TOKEN as string
});

const db = drizzle(client);

async function main() {
  try {
    await migrate(db, {
      migrationsFolder: "drizzle/migrations",
    });
    console.log("Tables migrated!");
    process.exit(0);
  } catch (error) {
    console.error("Error performing migration: ", error);
    process.exit(1);
  }
}

main();