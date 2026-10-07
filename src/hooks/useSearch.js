import { useMemo, useState } from "react";

export default function useSearch(items) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) => (i.title + " " + i.subject + " " + i.type).toLowerCase().includes(q));
  }, [items, query]);
  return { query, setQuery, results };
}
