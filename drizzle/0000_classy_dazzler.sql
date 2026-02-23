CREATE TABLE `comments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`mod_id` integer NOT NULL,
	`content` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`mod_id`) REFERENCES `mods`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `comments_mod_id_idx` ON `comments` (`mod_id`);--> statement-breakpoint
CREATE TABLE `mod_versions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`mod_id` integer NOT NULL,
	`version` text NOT NULL,
	`changelog` text,
	`download_url` text NOT NULL,
	`minecraft_version` text,
	`file_size` integer,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`mod_id`) REFERENCES `mods`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `mod_versions_mod_id_idx` ON `mod_versions` (`mod_id`);--> statement-breakpoint
CREATE TABLE `mods` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`short_description` text NOT NULL,
	`long_description` text,
	`github_repo` text,
	`owner_id` integer NOT NULL,
	`icon_url` text,
	`banner_url` text,
	`category` text NOT NULL,
	`download_count` integer DEFAULT 0 NOT NULL,
	`star_count` integer DEFAULT 0 NOT NULL,
	`use_github_readme` integer DEFAULT false NOT NULL,
	`webhook_secret` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `mods_slug_unique` ON `mods` (`slug`);--> statement-breakpoint
CREATE INDEX `mods_owner_id_idx` ON `mods` (`owner_id`);--> statement-breakpoint
CREATE INDEX `mods_category_idx` ON `mods` (`category`);--> statement-breakpoint
CREATE TABLE `reports` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`reporter_id` integer NOT NULL,
	`mod_id` integer NOT NULL,
	`reason` text NOT NULL,
	`description` text,
	`status` text DEFAULT 'open' NOT NULL,
	`created_at` integer NOT NULL,
	`resolved_at` integer,
	`resolved_by` integer,
	FOREIGN KEY (`reporter_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`mod_id`) REFERENCES `mods`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`resolved_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `reports_mod_id_idx` ON `reports` (`mod_id`);--> statement-breakpoint
CREATE INDEX `reports_status_idx` ON `reports` (`status`);--> statement-breakpoint
CREATE TABLE `stars` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`mod_id` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`mod_id`) REFERENCES `mods`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `stars_user_mod_idx` ON `stars` (`user_id`,`mod_id`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`github_id` integer NOT NULL,
	`github_username` text NOT NULL,
	`avatar_url` text NOT NULL,
	`display_name` text NOT NULL,
	`bio` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_github_id_unique` ON `users` (`github_id`);