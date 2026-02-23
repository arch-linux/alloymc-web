CREATE TABLE `pack_comments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`pack_id` integer NOT NULL,
	`content` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`pack_id`) REFERENCES `packs`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `pack_comments_pack_id_idx` ON `pack_comments` (`pack_id`);--> statement-breakpoint
CREATE TABLE `pack_reports` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`reporter_id` integer NOT NULL,
	`pack_id` integer NOT NULL,
	`reason` text NOT NULL,
	`description` text,
	`status` text DEFAULT 'open' NOT NULL,
	`created_at` integer NOT NULL,
	`resolved_at` integer,
	`resolved_by` integer,
	FOREIGN KEY (`reporter_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`pack_id`) REFERENCES `packs`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`resolved_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `pack_reports_pack_id_idx` ON `pack_reports` (`pack_id`);--> statement-breakpoint
CREATE INDEX `pack_reports_status_idx` ON `pack_reports` (`status`);--> statement-breakpoint
CREATE TABLE `pack_stars` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`pack_id` integer NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`pack_id`) REFERENCES `packs`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `pack_stars_user_pack_idx` ON `pack_stars` (`user_id`,`pack_id`);--> statement-breakpoint
CREATE TABLE `pack_versions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`pack_id` integer NOT NULL,
	`version` text NOT NULL,
	`changelog` text,
	`download_url` text NOT NULL,
	`minecraft_version` text,
	`file_size` integer,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`pack_id`) REFERENCES `packs`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `pack_versions_pack_id_idx` ON `pack_versions` (`pack_id`);--> statement-breakpoint
CREATE TABLE `packs` (
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
CREATE UNIQUE INDEX `packs_slug_unique` ON `packs` (`slug`);--> statement-breakpoint
CREATE INDEX `packs_owner_id_idx` ON `packs` (`owner_id`);--> statement-breakpoint
CREATE INDEX `packs_category_idx` ON `packs` (`category`);