import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ModGrid } from "@/components/mods/ModGrid";
import { SearchBar } from "@/components/mods/SearchBar";
import { CategoryFilter } from "@/components/mods/CategoryFilter";
import { SortSelect } from "@/components/mods/SortSelect";
import { PackageIcon } from "@/components/icons";
import { getDb } from "@/lib/db";
import { mods, users, stars } from "@/lib/db/schema";
import { eq, like, desc, and, sql, inArray } from "drizzle-orm";
import { getEnv } from "@/lib/cloudflare";
import { getSession } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Mod Explorer",
  description: "Discover, download, and share Alloy mods built by the community.",
};

async function ModResults({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) {
  const env = await getEnv();
  const db = getDb(env.DB);
  const session = await getSession(env.SESSIONS, env.SESSION_SECRET);

  const q = searchParams.q || "";
  const category = searchParams.category || "";
  const sort = searchParams.sort || "newest";
  const owner = searchParams.owner || "";
  const starred = searchParams.starred || "";
  const page = Math.max(1, parseInt(searchParams.page || "1"));
  const limit = 20;
  const offset = (page - 1) * limit;

  const conditions = [];
  if (q) {
    conditions.push(like(mods.name, `%${q}%`));
  }
  if (category) {
    conditions.push(eq(mods.category, category));
  }

  // Filter by owner (current user's mods)
  if (owner === "me" && session) {
    conditions.push(eq(mods.ownerId, session.userId));
  }

  // Filter by starred (current user's starred mods)
  if (starred === "true" && session) {
    const starredMods = await db
      .select({ modId: stars.modId })
      .from(stars)
      .where(eq(stars.userId, session.userId));
    const starredIds = starredMods.map((s) => s.modId);
    if (starredIds.length > 0) {
      conditions.push(inArray(mods.id, starredIds));
    } else {
      // No starred mods — return empty
      conditions.push(sql`0 = 1`);
    }
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const orderMap = {
    downloads: desc(mods.downloadCount),
    stars: desc(mods.starCount),
    newest: desc(mods.createdAt),
    updated: desc(mods.updatedAt),
  } as const;
  const orderBy = orderMap[sort as keyof typeof orderMap] ?? desc(mods.createdAt);

  const [results, countResult] = await Promise.all([
    db
      .select({
        slug: mods.slug,
        name: mods.name,
        shortDescription: mods.shortDescription,
        iconUrl: mods.iconUrl,
        category: mods.category,
        downloadCount: mods.downloadCount,
        starCount: mods.starCount,
        ownerUsername: users.githubUsername,
        ownerAvatar: users.avatarUrl,
      })
      .from(mods)
      .innerJoin(users, eq(mods.ownerId, users.id))
      .where(whereClause)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)` })
      .from(mods)
      .where(whereClause),
  ]);

  const total = countResult[0]?.count ?? 0;
  const totalPages = Math.ceil(total / limit);

  if (results.length === 0) {
    let heading = "No mods yet";
    let description = "Be the first to list a mod on Alloy. Point it at your GitHub repo and we handle the rest.";
    let ctaLabel = "Submit the First Mod";
    let ctaHref = "/mods/new";

    if (owner === "me") {
      heading = "You haven\u2019t submitted any mods";
      description = "List your first mod — point it at a GitHub repo and you\u2019re live.";
      ctaLabel = "Submit a Mod";
    } else if (starred === "true") {
      heading = "No starred mods";
      description = "Browse the mod explorer and star the ones you like.";
      ctaLabel = "Browse Mods";
      ctaHref = "/mods";
    } else if (q || category) {
      heading = "No mods found";
      description = "Try adjusting your search or filters.";
      ctaLabel = "Clear Filters";
      ctaHref = "/mods";
    }

    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <PackageIcon className="w-16 h-16 text-obsidian-600 mb-6" />
        <h3 className="font-heading text-2xl font-bold text-stone-200 mb-2">
          {heading}
        </h3>
        <p className="text-stone-400 text-lg mb-6 max-w-md">
          {description}
        </p>
        <Link
          href={ctaHref}
          className="px-6 py-3 rounded-lg bg-ember text-obsidian-950 font-medium hover:bg-ember-light transition-colors"
        >
          {ctaLabel}
        </Link>
      </div>
    );
  }

  return (
    <>
      <ModGrid mods={results} />

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
            const params = new URLSearchParams();
            if (searchParams.q) params.set("q", searchParams.q);
            if (searchParams.category) params.set("category", searchParams.category);
            if (searchParams.sort) params.set("sort", searchParams.sort);
            params.set("page", String(p));

            return (
              <Link
                key={p}
                href={`/mods?${params.toString()}`}
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                  p === page
                    ? "bg-ember text-obsidian-950"
                    : "bg-obsidian-800 text-stone-400 hover:text-stone-200 hover:bg-obsidian-700 border border-obsidian-700"
                }`}
              >
                {p}
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
