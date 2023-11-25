import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { SECRET_DB_URL, SECRET_DB_AUTH_TOKEN } from '$env/static/private';

const client = createClient({ url: SECRET_DB_URL, authToken: SECRET_DB_AUTH_TOKEN });
 
export const db = drizzle(client);