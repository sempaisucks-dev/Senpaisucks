"use client";
import React, { useState, useRef } from "react";
import debounce from "just-debounce-it";

export default function SearchBar() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const mounted = useRef(true);

  React.useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const doSearch = debounce(async (term: string) => {
    if (!term) return setResults([]);
    setLoading(true);
    const query = `query ($search: String) { Page(page: 1, perPage: 10) { media(search: $search, type: ANIME) { id title { romaji } coverImage { large } } } }`;
    const res = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables: { search: term } }),
    });
    const json = await res.json();
    if (!mounted.current) return;
    const items = json?.data?.Page?.media ?? [];
    setResults(items);
    setLoading(false);
  }, 300);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQ(e.target.value);
    doSearch(e.target.value);
  }

  return (
    <div className="relative">
      <input aria-label="Search anime" value={q} onChange={onChange} className="w-full border rounded px-3 py-2" placeholder="Search anime..." />
      <div className="absolute left-0 right-0 mt-1 bg-white shadow-lg rounded"> 
        {loading && <div className="p-3">Searching…</div>}
        {!loading && results.map((r) => (
          <a key={r.id} href={`/anime/${r.id}`} className="block p-2 hover:bg-slate-50">{r.title?.romaji}</a>
        ))}
      </div>
    </div>
  );
}
