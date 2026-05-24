export interface Anime {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  coverImage: string | null;
  bannerImage: string | null;
  status: "ongoing" | "completed" | "upcoming";
  createdAt: string;
}

export interface Episode {
  id: number;
  animeId: number;
  episodeNumber: number;
  title: string;
  duration: number | null;
  createdAt: string;
}

export interface VideoSource {
  id: number;
  episodeId: number;
  provider: string;
  url: string;
  quality: "360p" | "480p" | "720p" | "1080p";
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
}

export interface WatchHistory {
  id: number;
  userId: string;
  episodeId: number;
  progress: number;
  watchedAt: string;
}
