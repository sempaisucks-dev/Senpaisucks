import React from "react";
import { notFound } from "next/navigation";
import VideoPlayer from "../../../../components/player/VideoPlayer";
import { getEpisodeById, getNextEpisodeIdFor } from "../../../../lib/db/queries";
import { Metadata } from "next";

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const episode = await getEpisodeById(params.id);
  if (!episode) return { title: "Episode | Kagenime" };
  return {
    title: `${episode.anime_title} Ep ${episode.number} | Kagenime`,
    description: episode.description ?? `${episode.anime_title} episode ${episode.number}`,
  };
}

export default async function Page({ params }: Props) {
  const episode = await getEpisodeById(params.id);
  if (!episode) notFound();
  const nextEpisodeId = await getNextEpisodeIdFor(params.id);

  return (
    <main className="py-6 px-4">
      <h1 className="text-2xl font-bold">{episode.anime_title} — Episode {episode.number}</h1>
      <p className="text-sm text-muted-foreground mt-1">{episode.published_at?.toISOString().slice(0, 10)}</p>

      <section className="mt-6">
        {/* VideoPlayer is client and will fetch proxied stream */}
        {/* Episode id passed so client can request /api/sources/:id */}
        {/* Player will navigate to next episode when finished if configured */}
        <VideoPlayer episodeId={params.id} nextEpisodeId={nextEpisodeId ?? undefined} />
      </section>

      <section className="mt-6 max-w-3xl">
        <h2 className="font-semibold">About this episode</h2>
        <p className="mt-2 text-sm text-slate-700">{episode.description}</p>
      </section>
    </main>
  );
}
