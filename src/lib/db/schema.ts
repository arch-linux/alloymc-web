import { sqliteTable, text, integer, uniqueIndex, index } from "drizzle-orm/sqlite-core";

// ─── Users ───────────────────────────────────────────────────────────────────
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  githubId: integer("github_id").notNull().unique(),
  githubUsername: text("github_username").notNull(),
  avatarUrl: text("avatar_url").notNull(),
  displayName: text("display_name").notNull(),
  bio: text("bio"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

// ─── Mods ────────────────────────────────────────────────────────────────────
export const mods = sqliteTable(
  "mods",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    shortDescription: text("short_description").notNull(),
    longDescription: text("long_description"),
    githubRepo: text("github_repo"),
    ownerId: integer("owner_id").notNull().references(() => users.id),
    iconUrl: text("icon_url"),
    bannerUrl: text("banner_url"),
    category: text("category").notNull(),
    downloadCount: integer("download_count").notNull().default(0),
    starCount: integer("star_count").notNull().default(0),
    useGithubReadme: integer("use_github_readme", { mode: "boolean" }).notNull().default(false),
    webhookSecret: text("webhook_secret"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  },
  (table) => [
    index("mods_owner_id_idx").on(table.ownerId),
    index("mods_category_idx").on(table.category),
  ]
);

// ─── Mod Versions ────────────────────────────────────────────────────────────
export const modVersions = sqliteTable(
  "mod_versions",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    modId: integer("mod_id").notNull().references(() => mods.id, { onDelete: "cascade" }),
    version: text("version").notNull(),
    changelog: text("changelog"),
    downloadUrl: text("download_url").notNull(),
    minecraftVersion: text("minecraft_version"),
    fileSize: integer("file_size"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  },
  (table) => [
    index("mod_versions_mod_id_idx").on(table.modId),
  ]
);

// ─── Stars ───────────────────────────────────────────────────────────────────
export const stars = sqliteTable(
  "stars",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("user_id").notNull().references(() => users.id),
    modId: integer("mod_id").notNull().references(() => mods.id, { onDelete: "cascade" }),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  },
  (table) => [
    uniqueIndex("stars_user_mod_idx").on(table.userId, table.modId),
  ]
);

// ─── Comments ────────────────────────────────────────────────────────────────
export const comments = sqliteTable(
  "comments",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("user_id").notNull().references(() => users.id),
    modId: integer("mod_id").notNull().references(() => mods.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
    deletedAt: integer("deleted_at", { mode: "timestamp" }),
  },
  (table) => [
    index("comments_mod_id_idx").on(table.modId),
  ]
);

// ─── Reports ─────────────────────────────────────────────────────────────────
export const reports = sqliteTable(
  "reports",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    reporterId: integer("reporter_id").notNull().references(() => users.id),
    modId: integer("mod_id").notNull().references(() => mods.id, { onDelete: "cascade" }),
    reason: text("reason", { enum: ["malware", "spam", "copyright", "other"] }).notNull(),
    description: text("description"),
    status: text("status", { enum: ["open", "reviewing", "resolved", "dismissed"] }).notNull().default("open"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
    resolvedAt: integer("resolved_at", { mode: "timestamp" }),
    resolvedBy: integer("resolved_by").references(() => users.id),
  },
  (table) => [
    index("reports_mod_id_idx").on(table.modId),
    index("reports_status_idx").on(table.status),
  ]
);

// ─── Type Exports ────────────────────────────────────────────────────────────
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Mod = typeof mods.$inferSelect;
export type NewMod = typeof mods.$inferInsert;
export type ModVersion = typeof modVersions.$inferSelect;
export type Star = typeof stars.$inferSelect;
export type Comment = typeof comments.$inferSelect;
export type Report = typeof reports.$inferSelect;
