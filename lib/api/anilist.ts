import fetch from "node-fetch";
import { redis, cacheGet, cacheSet } from "../cache/index";
import { anime as animeTable, episodes as episodesTable } from "../db/schema";
import { db } from "../db";
import {
  ANILIST_ANIME_ID_PATTERN,
  ANILIST_SEARCH_PATTERN,
  ANILIST_TRENDING_PATTERN,
  ANILIST_SEASON_PATTERN,
  animeMetaKey,
} from "../cache/keys";
import type { Anime as AnimeType, Episode as EpisodeType, VideoSource } from "../../types";

const ANILIST_ENDPOINT = "https://graphql.anilist.co";

type AniListMedia = {
  id: number;
  title: { romaji?: string; english?: string; native?: string };
  description?: string | null;
  coverImage?: { extraLarge?: string; large?: string; medium?: string } | null;
  bannerImage?: string | null;
  genres?: string[] | null;
};

async function graphql(query: string, variables?: Record<string, any>) {
  const res = await fetch(ANILIST_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(`AniList API error: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

export async function fetchAnimeById(id: number): Promise<AnimeType> {
  const cacheKey = ANILIST_ANIME_ID_PATTERN.replace("{id}", String(id));
  const cached = await cacheGet<AnimeType>(cacheKey);
  if (cached) return cached;

  const query = `query ($id: Int) { Media(id: $id, type: ANIME) { id title { romaji english native } description coverImage { extraLarge large medium } bannerImage genres } }`;
  const data = await graphql(query, { id });
  const media: AniListMedia = data.Media;

  const result: AnimeType = {
    id: id,
    title: media.title?.romaji || media.title?.english || "",
    slug: (media.title?.romaji || media.title?.english || "").toLowerCase().replace(/\s+/g, "-"),
    description: media.description || null,
    coverImage: media.coverImage?.large || media.coverImage?.medium || null,
    bannerImage: media.bannerImage || null,
    status: "ongoing",
    createdAt: new Date().toISOString(),
  };

  // Save minimal record to DB if not exists
  try {
    await db.insert(animeTable).values({
      id: result.id as any,
      title: result.title,
      slug: result.slug,
      description: result.description,
      cover_image: result.coverImage,
      banner_image: result.bannerImage,
      status: result.status,
    }).onConflictDoNothing();
  } catch (err) {
    // ignore DB errors here
  }

  await cacheSet(cacheKey, result as any);
  return result;
}

export async function fetchAnimeBySeason(season: string, year: number, page = 1): Promise<AnimeType[]> {
  const cacheKey = ANILIST_SEASON_PATTERN.replace("{season}", season).replace("{year}", String(year)).replace("{page}", String(page));
  const cached = await cacheGet<AnimeType[]>(cacheKey);
  if (cached) return cached;

  const query = `query ($season: MediaSeason, $year: Int, $page: Int) { Page(page: $page) { media(season: $season, seasonYear: $year, type: ANIME) { id title { romaji english } description coverImage { large medium } bannerImage genres } } }`;
  const data = await graphql(query, { season: season.toUpperCase(), year, page });
  const list: AniListMedia[] = data.Page.media;

  const result = list.map((media) => ({
    id: media.id,
    title: media.title?.romaji || media.title?.english || "",
    slug: (media.title?.romaji || media.title?.english || "").toLowerCase().replace(/\s+/g, "-"),
    description: media.description || null,
    coverImage: media.coverImage?.large || media.coverImage?.medium || null,
    bannerImage: media.bannerImage || null,
    status: "ongoing",
    createdAt: new Date().toISOString(),
  }));

  await cacheSet(cacheKey, result as any);
  return result;
}

export async function fetchTrending(page = 1): Promise<AnimeType[]> {
  const cacheKey = ANILIST_TRENDING_PATTERN.replace("{page}", String(page));
  const cached = await cacheGet<AnimeType[]>(cacheKey);
  if (cached) return cached;

  const query = `query ($page: Int) { Page(page: $page) { media(type: ANIME, sort: TRENDING_DESC) { id title { romaji english } description coverImage { large medium } bannerImage genres } } }`;
  const data = await graphql(query, { page });
  const list: AniListMedia[] = data.Page.media;

  const result = list.map((media) => ({
    id: media.id,
    title: media.title?.romaji || media.title?.english || "",
    slug: (media.title?.romaji || media.title?.english || "").toLowerCase().replace(/\s+/g, "-"),
    description: media.description || null,
    coverImage: media.coverImage?.large || media.coverImage?.medium || null,
    bannerImage: media.bannerImage || null,
    status: "ongoing",
    createdAt: new Date().toISOString(),
  }));

  await cacheSet(cacheKey, result as any);
  return result;
}

export async function fetchSearch(queryStr: string, page = 1): Promise<AnimeType[]> {
  const cacheKey = ANILIST_SEARCH_PATTERN.replace("{query}", encodeURIComponent(queryStr)).replace("{page}", String(page));
  const cached = await cacheGet<AnimeType[]>(cacheKey);
  if (cached) return cached;

  const query = `query ($search: String, $page: Int) { Page(page: $page) { media(search: $search, type: ANIME) { id title { romaji english } description coverImage { large medium } bannerImage genres } } }`;
  const data = await graphql(query, { search: queryStr, page });
  const list: AniListMedia[] = data.Page.media;

  const result = list.map((media) => ({
    id: media.id,
    title: media.title?.romaji || media.title?.english || "",
    slug: (media.title?.romaji || media.title?.english || "").toLowerCase().replace(/\s+/g, "-"),
    description: media.description || null,
    coverImage: media.coverImage?.large || media.coverImage?.medium || null,
    bannerImage: media.bannerImage || null,
    status: "ongoing",
    createdAt: new Date().toISOString(),
  }));

  await cacheSet(cacheKey, result as any);
  return result;
}
