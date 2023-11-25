import { relations } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable('users', {
    id: integer('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
});


export const dogsTable = sqliteTable('dogs', {
    id: integer('id').primaryKey(),
    img: text('img').notNull(),
    name: text('name').notNull(),
    age: integer('age', { mode: 'number' }).notNull(),
    zip_code: text('zip_code').notNull(),
    breed: text('breed').notNull(),
    is_favorite: integer('is_favorite', { mode: 'boolean' }).notNull(),
    dog_id: text('dog_id').notNull(),
    user_id: integer("user_id").notNull(),
});


export const usersRelations = relations(usersTable, ({ many }) => ({
    dogs: many(dogsTable),
}));


export const dogsTableRelations = relations(dogsTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [dogsTable.user_id],
        references: [usersTable.id],
    }),
}));