"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchIcon } from "@/components/icons";

export function PackSearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") || "");

  const updateSearch = useCallback(
    (q: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (q) {
        params.set("q", q);
      } else {
        params.delete("q");
      }
      params.delete("page");
      router.push(`/packs?${params.toString()}`);
    },
    [router, searchParams]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      updateSearch(value);
    }, 300);
    return () => clearTimeout(timer);
  }, [value, updateSearch]);

  return (
    <div className="relative flex-1 max-w-md">
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search packs..."
        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-obsidian-700 bg-obsidian-900 text-stone-200 text-sm placeholder:text-stone-500 focus:outline-none focus:border-ember/50 focus:ring-1 focus:ring-ember/20 transition-colors font-mono"
      />
    </div>
  );
}
