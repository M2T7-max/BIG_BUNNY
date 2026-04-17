"use client";

import { useState, useMemo, useCallback } from "react";

interface SearchableItem {
  id: string;
  name: string;
  category?: string;
  description?: string;
  tags?: string[];
  type: "lab" | "course" | "command" | "tool" | "module";
}

export function useSearch(items: SearchableItem[]) {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const results = useMemo(() => {
    if (!query.trim() && activeFilter === "all") return items;

    return items.filter((item) => {
      const matchesQuery = !query.trim() || [
        item.name,
        item.category,
        item.description,
        ...(item.tags || []),
      ].some((field) => field?.toLowerCase().includes(query.toLowerCase()));

      const matchesFilter = activeFilter === "all" || item.type === activeFilter || item.category?.toLowerCase() === activeFilter.toLowerCase();

      return matchesQuery && matchesFilter;
    });
  }, [items, query, activeFilter]);

  const clearSearch = useCallback(() => {
    setQuery("");
    setActiveFilter("all");
  }, []);

  return {
    query,
    setQuery,
    activeFilter,
    setActiveFilter,
    results,
    clearSearch,
    resultCount: results.length,
  };
}
