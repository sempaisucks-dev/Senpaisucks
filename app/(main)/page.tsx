import React from "react";
import { fetchTrending, fetchAnimeBySeason } from "../../lib/api/anilist";
import { db } from "../../lib/db";
import Link from "next/link";
import SearchBar from "../../components/shared/SearchBar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home | Kagenime",
};

export default async function Page() {
  const [trending, season] = await Promise.all([
    fetchTrending(1),
    fetchAnimeBySeason("SPRING", new Date().getFullYear(), 1),
  ]);

  const recentEpisodes = await db.query.episodes.findMany({ limit: 12, orderBy: (e: any) => e.created_at.desc() });

  return (
    <main className="p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <SearchBar />
        </div>

        <section className="mb-6">
          <h2 className="font-semibold">Trending</h2>
          <div className="mt-3 flex gap-3 overflow-x-auto">
            {trending.map((t) => (
              <Link key={t.id} href={`/anime/${t.id}`} className="w-40 flex-shrink-0">
                <img src={t.coverImage ?? "/placeholder.png"} alt={t.title} width={160} height={220} className="rounded" />
                <div className="text-sm mt-1">{t.title}</div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-6">
          <h2 className="font-semibold">Airing This Season</h2>
          <div className="mt-3 flex gap-3 overflow-x-auto">
            {season.map((t) => (
              <Link key={t.id} href={`/anime/${t.id}`} className="w-40 flex-shrink-0">
                <img src={t.coverImage ?? "/placeholder.png"} alt={t.title} width={160} height={220} className="rounded" />
                <div className="text-sm mt-1">{t.title}</div>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-semibold">Recently Added Episodes</h2>
          <div className="mt-3 grid grid-cols-3 gap-4">
            {recentEpisodes.map((ep: any) => (
              <Link key={ep.id} href={`/watch/${ep.id}`} className="block p-2 border rounded">
                <div className="text-sm font-medium">{ep.title ?? ep.number}</div>
                <div className="text-xs text-slate-600">{ep.anime_title}</div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
