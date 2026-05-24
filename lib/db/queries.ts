import { db } from "./index";
import { anime, episodes } from "./schema";

// Lightweight query helpers used by pages. Adjust according to your Drizzle schema.
export async function getEpisodeById(id: string) {
  const res = await db.query.episodes.findFirst({ where: (e: any) => e.id.equals(id) });
  return res ?? null;
}

export async function getNextEpisodeIdFor(id: string) {
  // find episode with same anime_id and episode_number > this number, ordered ascending
  const ep = await db.query.episodes.findFirst({ where: (e: any) => e.id.equals(id) });
  if (!ep) return null;
  const next = await db.query.episodes.findFirst({
    where: (e: any) => e.anime_id.equals(ep.anime_id).and(e.episode_number.gt(ep.episode_number)),
    orderBy: (e: any) => e.episode_number.asc(),
  });
  return next?.id ?? null;
}

export async function getAllAnimeSlugs() {
  const rows = await db.select({ slug: anime.slug, updatedAt: anime.updated_at }).from(anime);
  return rows.map((r: any) => ({ slug: r.slug as string, updatedAt: r.updatedAt as Date }));
}

export async function getAllEpisodesForSitemap() {
  const rows = await db.select({ id: episodes.id, updatedAt: episodes.updated_at }).from(episodes).limit(10000);
  return rows.map((r: any) => ({ id: r.id as string, updatedAt: r.updatedAt as Date }));
}
