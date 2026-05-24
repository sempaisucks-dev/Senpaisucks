"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  MediaPlayer,
  MediaOutlet,
  MediaCommunitySkin,
  MediaPlayButton,
  MediaSeekButton,
  MediaPlaybackRateMenuButton,
  MediaPlaybackRateMenuItems,
  MediaQualityMenuButton,
  MediaQualityMenuItems,
  MediaVolumeSlider,
  MediaTimeSlider,
  MediaMenu,
  MediaMenuButton,
  MediaBufferingIndicator,
} from "@vidstack/react";
import usePlayerStore from "../../store/playerStore";
import { useRouter } from "next/navigation";

type Props = {
  episodeId: string;
  nextEpisodeId?: string | null;
};

export default function VideoPlayer({ episodeId, nextEpisodeId }: Props) {
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [qualities, setQualities] = useState<string[] | null>(null);
  const volume = usePlayerStore((s) => s.volume);
  const setVolume = usePlayerStore((s) => s.setVolume);
  const playbackRate = usePlayerStore((s) => s.playbackRate);
  const setPlaybackRate = usePlayerStore((s) => s.setPlaybackRate);
  const autoPlayNext = usePlayerStore((s) => s.autoPlayNext);
  const setEpisode = usePlayerStore((s) => s.setEpisode);
  const router = useRouter();
  const playerRef = useRef<HTMLMediaElement | null>(null);

  useEffect(() => {
    setEpisode(episodeId);
  }, [episodeId, setEpisode]);

  useEffect(() => {
    // fetch proxied stream URL from our server route
    let cancelled = false;
    async function getStream() {
      const res = await fetch(`/api/sources/${episodeId}`);
      if (!res.ok) return;
      const json = await res.json();
      if (cancelled) return;
      // expected { streamUrl: string, qualities?: string[] }
      setStreamUrl(json.streamUrl ?? null);
      if (json.qualities) setQualities(json.qualities);
    }
    getStream();
    return () => {
      cancelled = true;
    };
  }, [episodeId]);

  useEffect(() => {
    // sync playbackRate from store into native player if available
    if (playerRef.current) playerRef.current.playbackRate = playbackRate;
  }, [playbackRate]);

  function handleEnded() {
    if (autoPlayNext && nextEpisodeId) {
      router.push(`/watch/${nextEpisodeId}`);
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="aspect-video bg-black rounded overflow-hidden">
        <MediaPlayer
          src={streamUrl ?? undefined}
          onEnded={handleEnded as any}
          playsInline
          preload="metadata"
        >
          <MediaOutlet />
          <MediaCommunitySkin />
        </MediaPlayer>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <MediaPlayButton />
        <MediaSeekButton seconds="-15" />
        <MediaSeekButton seconds="+85" />

        <div className="flex-1">
          <MediaTimeSlider />
        </div>

        <div className="flex items-center gap-2">
          <MediaMenu>
            <MediaMenuButton ariaLabel="Speed">Speed</MediaMenuButton>
            <MediaPlaybackRateMenuItems onChange={(e: any) => setPlaybackRate(Number(e.detail.value))} />
          </MediaMenu>

          <MediaMenu>
            <MediaMenuButton ariaLabel="Quality">Quality</MediaMenuButton>
            {qualities ? (
              <MediaQualityMenuItems />
            ) : (
              <MediaQualityMenuItems />
            )}
          </MediaMenu>

          <MediaVolumeSlider />
        </div>
      </div>
    </div>
  );
}
