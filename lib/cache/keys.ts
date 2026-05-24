// Pattern constants (no magic strings elsewhere)
export const ANIME_META_PATTERN = "anime:{id}:meta";
export const EPISODE_META_PATTERN = "episode:{id}:meta";
export const VIDEO_SOURCE_META_PATTERN = "video_source:{id}:meta";
export const USER_PROFILE_PATTERN = "user:{id}:profile";
export const USER_WATCHLIST_PATTERN = "user:{id}:watchlist";
export const WATCH_HISTORY_PATTERN = "watchhistory:{id}";
export const WATCHLIST_ITEM_PATTERN = "watchlist:{userId}:{animeId}";
export const COMMENT_META_PATTERN = "comment:{id}:meta";

// AniList-specific cache patterns
export const ANILIST_ANIME_ID_PATTERN = "anilist:anime:{id}:meta";
export const ANILIST_TRENDING_PATTERN = "anilist:trending:page:{page}";
export const ANILIST_SEARCH_PATTERN = "anilist:search:{query}:page:{page}";
export const ANILIST_SEASON_PATTERN = "anilist:season:{season}:{year}:page:{page}";
export const RATE_LIMIT_IP_PATTERN = "rate:ip:{ip}";

// Helper functions to generate concrete keys
export const animeMetaKey = (animeId: string) => `anime:${animeId}:meta`;
export const episodeMetaKey = (episodeId: string) => `episode:${episodeId}:meta`;
export const videoSourceMetaKey = (videoSourceId: string) => `video_source:${videoSourceId}:meta`;
export const userProfileKey = (userId: string) => `user:${userId}:profile`;
export const userWatchlistKey = (userId: string) => `user:${userId}:watchlist`;
export const watchHistoryKey = (userId: string) => `watchhistory:${userId}`;
export const watchlistItemKey = (userId: string, animeId: string) => `watchlist:${userId}:${animeId}`;
export const commentMetaKey = (commentId: string) => `comment:${commentId}:meta`;
