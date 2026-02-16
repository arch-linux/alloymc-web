import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ModGrid } from "@/components/mods/ModGrid";
import { SearchBar } from "@/components/mods/SearchBar";
import { CategoryFilter } from "@/components/mods/CategoryFilter";
import { SortSelect } from "@/components/mods/SortSelect";
import { PackageIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Mod Explorer",
  description: "Discover, download, and share Alloy mods built by the community.",
};

async function ModResults({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) {
  const params = new URLSearchParams();
  if (searchParams.q) params.set("q", searchParams.q);
  if (searchParams.category) params.set("category", searchParams.category);
  if (searchParams.sort) params.set("sort", searchParams.sort);
  if (searchParams.page) params.set("page", searchParams.page);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://alloymc.net";
  const res = await fetch(`${baseUrl}/api/mods?${params.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return <ModGrid mods={[]} emptyMessage="Failed to load mods" />;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = (await res.json()) as any;
  const { mods, pagination } = data;

  return (
    <>
      <ModGrid mods={mods} />

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => {
            const p = new URLSearchParams();
            if (searchParams.q) p.set("q", searchParams.q);
            if (searchParams.category) p.set("category", searchParams.category);
            if (searchParams.sort) p.set("sort", searchParams.sort);
            p.set("page", String(page));

            return (
              <Link
                key={page}
                href={`/mods?${p.toString()}`}
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                  page === pagination.page
                    ? "bg-ember text-obsidian-950"
                    : "bg-obsidian-800 text-stone-400 hover:text-stone-200 hover:bg-obsidian-700 border border-obsidian-700"
                }`}
              >
                {page}
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}

export default async function ModsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;

  return (
    <div className="grid-overlay min-h-screen">
      {/* Hero */}
      <section className="relative py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-ember/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-6 text-center">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-ember/20 bg-ember/5 text-ember text-sm">
            <PackageIcon className="w-4 h-4" />
            Mod Explorer
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-stone-100 mb-4">
            Discover Alloy Mods
          </h1>
          <p className="text-stone-400 text-lg max-w-2xl mx-auto">
            Browse community-built mods, plugins, and libraries. Everything is a mod.
          </p>
        </div>
      </section>

      {/* Filters + Content */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        {/* Sticky filter bar */}
        <div className="sticky top-[73px] z-40 bg-obsidian-950/90 backdrop-blur-lg -mx-6 px-6 py-4 border-b border-obsidian-700/50 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-3">
            <Suspense>
              <SearchBar />
            </Suspense>
            <div className="flex items-center gap-3">
              <Suspense>
                <SortSelect />
              </Suspense>
              <Link
                href="/mods/new"
                className="px-4 py-2.5 rounded-lg bg-ember text-obsidian-950 text-sm font-medium hover:bg-ember-light transition-colors whitespace-nowrap"
              >
                Submit Mod
              </Link>
            </div>
          </div>
          <Suspense>
            <CategoryFilter />
          </Suspense>
        </div>

        {/* Results */}
        <Suspense
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-obsidian-700/50 bg-obsidian-900/50 p-5 animate-pulse">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 rounded-xl bg-obsidian-700" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-2/3 bg-obsidian-700 rounded" />
                      <div className="h-3 w-full bg-obsidian-700 rounded" />
                    </div>
                  </div>
                  <div className="flex justify-between mt-4">
                    <div className="h-3 w-20 bg-obsidian-700 rounded" />
                    <div className="h-3 w-16 bg-obsidian-700 rounded" />
                  </div>
                </div>
              ))}
            </div>
          }
        >
          <ModResults searchParams={sp} />
        </Suspense>
      </section>
    </div>
  );
}
