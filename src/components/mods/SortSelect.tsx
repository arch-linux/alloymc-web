"use client";

import { useRouter, useSearchParams } from "next/navigation";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "updated", label: "Recently Updated" },
  { value: "downloads", label: "Most Downloads" },
  { value: "stars", label: "Most Stars" },
];

export function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") || "newest";

  function setSort(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    params.delete("page");
    router.push(`/mods?${params.toString()}`);
  }

  return (
    <select
      value={sort}
      onChange={(e) => setSort(e.target.value)}
      className="px-3 py-2.5 rounded-lg border border-obsidian-700 bg-obsidian-900 text-stone-200 text-sm focus:outline-none focus:border-ember/50 transition-colors cursor-pointer"
    >
      {SORT_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
