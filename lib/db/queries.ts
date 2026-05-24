import { db } from "./index";

// Lightweight query helpers used by pages. Adjust according to your Drizzle schema.
export async function getEpisodeById(id: string) {
  const res = await db.query.episodes.findFirst({ where: (e: any) => e.id.equals(id) });
  return res ?? null;
}

export async function getNextEpisodeIdFor(id: string) {
  // find episode with same anime_id and number > this number, ordered ascending
  const ep = await db.query.episodes.findFirst({ where: (e: any) => e.id.equals(id) });
  if (!ep) return null;
  const next = await db.query.episodes.findFirst({
    where: (e: any) => e.anime_id.equals(ep.anime_id).and(e.number.gt(ep.number)),
    orderBy: (e: any) => e.number.asc(),
  });
  return next?.id ?? null;
}
