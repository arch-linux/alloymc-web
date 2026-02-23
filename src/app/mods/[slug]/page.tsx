import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq, and, desc } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { mods, users, modVersions, stars } from "@/lib/db/schema";
import { getEnv } from "@/lib/cloudflare";
import { getSession } from "@/lib/auth/session";
import { ModPageHeader } from "@/components/mods/ModPageHeader";
import { VersionList } from "@/components/mods/VersionList";
import { CommentSection } from "@/components/mods/CommentSection";
import { MarkdownRenderer } from "@/components/mods/MarkdownRenderer";
import { fetchReadme, parseGithubRepo } from "@/lib/utils/github";

type PageProps = { params: Promise<{ slug: string }> };

async function getModData(slug: string) {
  const env = await getEnv();
  const db = getDb(env.DB);

  const mod = await db
    .select({
      id: mods.id,
      slug: mods.slug,
      name: mods.name,
      shortDescription: mods.shortDescription,
      longDescription: mods.longDescription,
      githubRepo: mods.githubRepo,
      ownerId: mods.ownerId,
      iconUrl: mods.iconUrl,
      bannerUrl: mods.bannerUrl,
      category: mods.category,
      downloadCount: mods.downloadCount,
      starCount: mods.starCount,
      useGithubReadme: mods.useGithubReadme,
      createdAt: mods.createdAt,
      updatedAt: mods.updatedAt,
      ownerUsername: users.githubUsername,
      ownerAvatar: users.avatarUrl,
      ownerDisplayName: users.displayName,
    })
    .from(mods)
    .innerJoin(users, eq(mods.ownerId, users.id))
    .where(eq(mods.slug, slug))
    .get();

  if (!mod) return null;

  const versions = await db
    .select()
    .from(modVersions)
    .where(eq(modVersions.modId, mod.id))
    .orderBy(desc(modVersions.createdAt));

  let hasStarred = false;
  let isOwner = false;
  const session = await getSession(env.SESSIONS, env.SESSION_SECRET);
  if (session) {
    isOwner = session.userId === mod.ownerId;
    const star = await db
      .select({ id: stars.id })
      .from(stars)
      .where(and(eq(stars.userId, session.userId), eq(stars.modId, mod.id)))
      .get();
    hasStarred = !!star;
  }

  return { mod, versions, hasStarred, isOwner };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getModData(slug);
  if (!data) return { title: "Not Found" };

  return {
    title: data.mod.name,
    description: data.mod.shortDescription,
  };
}

export default async function ModDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getModData(slug);

  if (!data) {
    notFound();
  }

  const { mod, versions, hasStarred, isOwner } = data;

  // Fetch README if using GitHub readme
  let readmeContent: string | null = null;
  if (mod.useGithubReadme && mod.githubRepo) {
    const parsed = parseGithubRepo(mod.githubRepo);
    if (parsed) {
      readmeContent = await fetchReadme(parsed.owner, parsed.repo);
    }
  }

  const description = readmeContent || mod.longDescription;

  return (
    <div className="grid-overlay min-h-screen py-10">
      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}
        <ModPageHeader
          slug={slug}
          name={mod.name}
          shortDescription={mod.shortDescription}
          iconUrl={mod.iconUrl}
          bannerUrl={mod.bannerUrl}
          category={mod.category}
          downloadCount={mod.downloadCount}
          starCount={mod.starCount}
          hasStarred={hasStarred}
          isOwner={isOwner}
          githubRepo={mod.githubRepo}
          ownerUsername={mod.ownerUsername}
          ownerAvatar={mod.ownerAvatar}
          ownerDisplayName={mod.ownerDisplayName}
        />

        {/* Tabbed content */}
        <div className="mt-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-10">
              {/* Description */}
              {description && (
                <section>
                  <h2 className="font-heading text-lg font-semibold text-stone-100 mb-4">
                    Description
                  </h2>
                  <div className="rounded-xl border border-obsidian-700 bg-obsidian-900/50 p-6">
                    <MarkdownRenderer content={description} />
                  </div>
                </section>
              )}

              {/* Comments */}
              <section>
                <h2 className="font-heading text-lg font-semibold text-stone-100 mb-4">
                  Comments
                </h2>
                <CommentSection slug={slug} modOwnerId={mod.ownerId} />
              </section>
            </div>

            {/* Sidebar — Versions */}
            <div>
              <h2 className="font-heading text-lg font-semibold text-stone-100 mb-4">
                Versions
              </h2>
              <VersionList versions={versions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
