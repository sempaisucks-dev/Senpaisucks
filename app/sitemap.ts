import { MetadataRoute } from "next";
import { getAllAnimeSlugs, getAllEpisodesForSitemap } from "./lib/db/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const animes = await getAllAnimeSlugs();
  const eps = await getAllEpisodesForSitemap();

  const animeUrls = animes.map((a) => ({ url: `${siteUrl}/anime/${a.slug}`, lastModified: a.updatedAt }));
  const episodeUrls = eps.map((e) => ({ url: `${siteUrl}/watch/${e.id}`, lastModified: e.updatedAt }));

  return [...animeUrls, ...episodeUrls];
}
