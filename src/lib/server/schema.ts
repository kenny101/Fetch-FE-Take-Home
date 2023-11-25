import { relations, sql } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable('users', {
    id: integer('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
});

integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true })


export const dogsTable = sqliteTable('dogs', {
    id: integer('id').primaryKey(),
    img: text('img'),
    name: text('name'),
    age: text('age'),
    zip_code: text('zip_code'),
    breed: text('breed'),
});

export const usersTableRelations = relations(usersTable, ({ many }) => ({
    dogs: many(dogsTable),
}));

