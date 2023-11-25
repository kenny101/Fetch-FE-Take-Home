import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config();


export default {
  schema: "./src/lib/server/schema.ts",
  out: "./drizzle",
  driver: "turso",
  dbCredentials: {
    url: process.env.SECRET_DB_URL as string,
    authToken: process.env.SECRET_DB_AUTH_TOKEN as string,
  },
} satisfies Config;