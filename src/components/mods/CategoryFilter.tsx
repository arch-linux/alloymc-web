"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { MOD_CATEGORIES } from "@/lib/constants";

export function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get("category") || "";

  function setCategory(cat: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (cat) {
      params.set("category", cat);
    } else {
      params.delete("category");
    }
    params.delete("page");
    router.push(`/mods?${params.toString()}`);
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
      <button
        onClick={() => setCategory("")}
        className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
          !active
            ? "bg-ember text-obsidian-950"
            : "bg-obsidian-800 text-stone-400 hover:text-stone-200 hover:bg-obsidian-700"
        }`}
      >
        All
      </button>
      {MOD_CATEGORIES.map((cat) => (
        <button
          key={cat.value}
          onClick={() => setCategory(cat.value)}
          className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            active === cat.value
              ? "bg-ember text-obsidian-950"
              : "bg-obsidian-800 text-stone-400 hover:text-stone-200 hover:bg-obsidian-700"
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
