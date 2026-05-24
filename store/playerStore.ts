"use client";
import create from "zustand";
import { persist } from "zustand/middleware";

interface PlayerState {
  episodeId?: string;
  isPlaying: boolean;
  volume: number;
  playbackRate: number;
  quality?: string;
  autoPlayNext: boolean;
  setEpisode: (id: string) => void;
  setPlaying: (p: boolean) => void;
  setVolume: (v: number) => void;
  setPlaybackRate: (r: number) => void;
  setQuality: (q?: string) => void;
  setAutoPlayNext: (v: boolean) => void;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set) => ({
      episodeId: undefined,
      isPlaying: false,
      volume: 0.8,
      playbackRate: 1,
      quality: undefined,
      autoPlayNext: true,
      setEpisode: (id: string) => set({ episodeId: id }),
      setPlaying: (p: boolean) => set({ isPlaying: p }),
      setVolume: (v: number) => set({ volume: v }),
      setPlaybackRate: (r: number) => set({ playbackRate: r }),
      setQuality: (q?: string) => set({ quality: q }),
      setAutoPlayNext: (v: boolean) => set({ autoPlayNext: v }),
    }),
    { name: "player-store" }
  )
);

export default usePlayerStore;
