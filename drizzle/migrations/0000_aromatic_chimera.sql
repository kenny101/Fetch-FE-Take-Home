CREATE TABLE `dogs` (
	`id` integer PRIMARY KEY NOT NULL,
	`img` text NOT NULL,
	`name` text NOT NULL,
	`age` integer NOT NULL,
	`zip_code` text NOT NULL,
	`breed` text NOT NULL,
	`is_favorite` integer NOT NULL,
	`dog_id` text NOT NULL,
	`user_id` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL
);
