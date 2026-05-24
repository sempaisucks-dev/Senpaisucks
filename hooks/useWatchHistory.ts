"use client";
import { useCallback, useState } from "react";
import type { WatchHistory } from "../types";

const STORAGE_KEY = "kage_history";

export function useWatchHistory() {
  const [state, setState] = useState<WatchHistory[]>(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      return raw ? (JSON.parse(raw) as WatchHistory[]) : [];
    } catch {
      return [];
    }
  });

  const save = useCallback((h: WatchHistory) => {
    setState((s) => {
      const next = [h, ...s.filter((x) => x.episodeId !== h.episodeId)].slice(0, 100);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setState(() => {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
      return [];
    });
  }, []);

  return { history: state, save, clear };
}
