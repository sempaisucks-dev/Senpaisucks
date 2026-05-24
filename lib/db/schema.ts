import { boolean, index, integer, pgTable, text, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: varchar("username", { length: 50 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  hashed_password: text("hashed_password").notNull(),
  avatar_url: varchar("avatar_url", { length: 512 }),
  is_active: boolean("is_active").notNull().default(true),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
}, (t) => [
  uniqueIndex("users_email_idx").on(t.email),
  uniqueIndex("users_username_idx").on(t.username),
  index("users_created_at_idx").on(t.created_at),
]);

export const anime = pgTable("anime", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  description: text("description"),
  cover_image: varchar("cover_image", { length: 512 }),
  banner_image: varchar("banner_image", { length: 512 }),
  status: varchar("status", { length: 50 }).notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
}, (t) => [
  uniqueIndex("anime_slug_idx").on(t.slug),
  index("anime_status_idx").on(t.status),
  index("anime_created_at_idx").on(t.created_at),
]);

export const episodes = pgTable("episodes", {
  id: uuid("id").primaryKey().defaultRandom(),
  anime_id: uuid("anime_id").notNull().references(() => anime.id),
  episode_number: integer("episode_number").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  duration: integer("duration"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
}, (t) => [
  uniqueIndex("episodes_anime_episode_number_idx").on(t.anime_id, t.episode_number),
  index("episodes_anime_id_idx").on(t.anime_id),
  index("episodes_created_at_idx").on(t.created_at),
]);

export const video_sources = pgTable("video_sources", {
  id: uuid("id").primaryKey().defaultRandom(),
  episode_id: uuid("episode_id").notNull().references(() => episodes.id),
  provider: varchar("provider", { length: 100 }).notNull(),
  url: varchar("url", { length: 1024 }).notNull(),
  quality: varchar("quality", { length: 50 }).notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
}, (t) => [
  uniqueIndex("video_sources_episode_provider_quality_idx").on(t.episode_id, t.provider, t.quality),
  index("video_sources_episode_id_idx").on(t.episode_id),
  index("video_sources_provider_idx").on(t.provider),
]);

export const watch_history = pgTable("watch_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").notNull().references(() => users.id),
  episode_id: uuid("episode_id").notNull().references(() => episodes.id),
  progress: integer("progress").notNull().default(0),
  watched_at: timestamp("watched_at").notNull().defaultNow(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
}, (t) => [
  uniqueIndex("watch_history_user_episode_idx").on(t.user_id, t.episode_id),
  index("watch_history_user_id_idx").on(t.user_id),
  index("watch_history_episode_id_idx").on(t.episode_id),
]);

export const watchlist = pgTable("watchlist", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").notNull().references(() => users.id),
  anime_id: uuid("anime_id").notNull().references(() => anime.id),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
}, (t) => [
  uniqueIndex("watchlist_user_anime_idx").on(t.user_id, t.anime_id),
  index("watchlist_user_id_idx").on(t.user_id),
  index("watchlist_anime_id_idx").on(t.anime_id),
]);

export const comments = pgTable("comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").notNull().references(() => users.id),
  anime_id: uuid("anime_id").references(() => anime.id),
  episode_id: uuid("episode_id").references(() => episodes.id),
  content: text("content").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
}, (t) => [
  index("comments_user_id_idx").on(t.user_id),
  index("comments_anime_id_idx").on(t.anime_id),
  index("comments_episode_id_idx").on(t.episode_id),
]);
