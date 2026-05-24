import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { cacheGet, cacheSet } from "../../../lib/cache/index";
import { animeMetaKey } from "../../../lib/cache/keys";
import { db } from "../../../lib/db";
import { anime as animeTable, episodes as episodesTable } from "../../../lib/db/schema";
import { eq } from "drizzle-orm";
import { fetchSearch, fetchAnimeById } from "../../../lib/api/anilist";
import type { Anime as AnimeType, Episode as EpisodeType } from "../../../types";

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = params.slug;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  // Try DB first for rich metadata
  let anime = await getAnimeFromDb(slug);
  if (!anime) {
    const results = await fetchSearch(slug.replace(/-/g, " "), 1);
    anime = results?.[0] ?? null;
  }
  if (!anime) return { title: `${slug.replace(/-/g, " ")} | Kagenime` };

  return {
    title: `${anime.title} | Kagenime`,
    description: anime.description ?? undefined,
    openGraph: {
      title: `${anime.title} | Kagenime`,
      description: anime.description ?? undefined,
      images: anime.bannerImage ? [anime.bannerImage] : anime.coverImage ? [anime.coverImage] : undefined,
    },
    alternates: { canonical: `${siteUrl}/anime/${anime.slug}` },
  };
}

async function getAnimeFromDb(slug: string): Promise<AnimeType | null> {
  const row = await db.select().from(animeTable).where(eq(animeTable.slug, slug)).limit(1);
  if (!row || row.length === 0) return null;
  const r = row[0];
  return {
    id: (r.id as unknown as number),
    title: r.title,
    slug: r.slug,
    description: r.description,
    coverImage: r.cover_image,
    bannerImage: r.banner_image,
    status: r.status as "ongoing" | "completed" | "upcoming",
    createdAt: r.created_at.toISOString(),
  };
}

export default async function Page({ params }: Props) {
  const slug = params.slug;

  // 1) Check Redis cache
  const cacheKey = animeMetaKey(slug);
  const cached = await cacheGet<AnimeType>(cacheKey);
  if (cached) return render(cached);

  // 2) Check DB
  const fromDb = await getAnimeFromDb(slug);
  if (fromDb) {
    await cacheSet(cacheKey, fromDb);
    return render(fromDb);
  }

  // 3) Fetch from AniList (search by title inferred from slug)
  const query = slug.replace(/-/g, " ");
  const results = await fetchSearch(query, 1);
  if (!results || results.length === 0) return notFound();

  const ani = results[0];

  // Save to DB
  try {
    await db.insert(animeTable).values({
      id: ani.id as any,
      title: ani.title,
      slug: ani.slug,
      description: ani.description,
      cover_image: ani.coverImage,
      banner_image: ani.bannerImage,
      status: ani.status,
    });
  } catch (err) {
    // ignore
  }

  await cacheSet(cacheKey, ani as any);

  return render(ani);
}

function render(anime: AnimeType) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name: anime.title, item: `${siteUrl}/anime/${anime.slug}` },
    ],
  } as const;

  return (
    <main className="max-w-6xl mx-auto p-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      {anime.bannerImage && (
        <div className="mb-6">
          <Image src={anime.bannerImage} alt={`${anime.title} banner`} width={1600} height={400} className="w-full h-auto object-cover rounded-lg" />
        </div>
      )}

      <div className="flex gap-6">
        {anime.coverImage && (
          <Image src={anime.coverImage} alt={`${anime.title} cover`} width={300} height={450} className="rounded-lg" />
        )}

        <div>
          <h1 className="text-4xl font-bold">{anime.title}</h1>
          <p className="mt-4 text-gray-300">{anime.description}</p>
          <div className="mt-6">
            <h2 className="text-2xl font-semibold">Episodes</h2>
            <ul className="mt-3 space-y-2">
              {/* Episode list from DB */}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
