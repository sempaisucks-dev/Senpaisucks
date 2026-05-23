import { pgTable, serial, text, varchar, timestamp, integer, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const statusEnum = pgEnum("status", ["ongoing", "completed", "upcoming"]);
export const qualityEnum = pgEnum("quality", ["360p", "480p", "720p", "1080p"]);

export const anime = pgTable("anime", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  cover_image: varchar("cover_image", { length: 512 }),
  banner_image: varchar("banner_image", { length: 512 }),
  status: statusEnum("status").notNull().default("ongoing"),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const episodes = pgTable("episodes", {
  id: serial("id").primaryKey(),
  anime_id: integer("anime_id").notNull().references(() => anime.id),
  episode_number: integer("episode_number").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  duration: integer("duration"),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const video_sources = pgTable("video_sources", {
  id: serial("id").primaryKey(),
  episode_id: integer("episode_id").notNull().references(() => episodes.id),
  provider: varchar("provider", { length: 100 }).notNull(),
  url: varchar("url", { length: 512 }).notNull(),
  quality: qualityEnum("quality").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const watch_history = pgTable("watch_history", {
  id: serial("id").primaryKey(),
  user_id: varchar("user_id", { length: 255 }).notNull(),
  episode_id: integer("episode_id").notNull().references(() => episodes.id),
  progress: integer("progress").notNull().default(0),
  watched_at: timestamp("watched_at").notNull().defaultNow(),
});

export const animeRelations = relations(anime, ({ many }) => ({
  episodes: many(episodes),
}));

export const episodesRelations = relations(episodes, ({ one, many }) => ({
  anime: one(anime, {
    fields: [episodes.anime_id],
    references: [anime.id],
  }),
  video_sources: many(video_sources),
  watch_history: many(watch_history),
}));

export const videoSourcesRelations = relations(video_sources, ({ one }) => ({
  episode: one(episodes, {
    fields: [video_sources.episode_id],
    references: [episodes.id],
  }),
}));

export const watchHistoryRelations = relations(watch_history, ({ one }) => ({
  episode: one(episodes, {
    fields: [watch_history.episode_id],
    references: [episodes.id],
  }),
}));
