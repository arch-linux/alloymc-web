import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq, and, desc } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { packs, users, packVersions, packStars } from "@/lib/db/schema";
import { getEnv } from "@/lib/cloudflare";
import { getSession } from "@/lib/auth/session";
import { PackPageHeader } from "@/components/packs/PackPageHeader";
import { VersionList } from "@/components/mods/VersionList";
import { CommentSection } from "@/components/packs/CommentSection";
import { MarkdownRenderer } from "@/components/mods/MarkdownRenderer";
import { fetchReadme, parseGithubRepo } from "@/lib/utils/github";

type PageProps = { params: Promise<{ slug: string }> };

async function getPackData(slug: string) {
  const env = await getEnv();
  const db = getDb(env.DB);

  const pack = await db
    .select({
      id: packs.id,
      slug: packs.slug,
      name: packs.name,
      shortDescription: packs.shortDescription,
      longDescription: packs.longDescription,
      githubRepo: packs.githubRepo,
      ownerId: packs.ownerId,
      iconUrl: packs.iconUrl,
      bannerUrl: packs.bannerUrl,
      category: packs.category,
      downloadCount: packs.downloadCount,
      starCount: packs.starCount,
      useGithubReadme: packs.useGithubReadme,
      createdAt: packs.createdAt,
      updatedAt: packs.updatedAt,
      ownerUsername: users.githubUsername,
      ownerAvatar: users.avatarUrl,
      ownerDisplayName: users.displayName,
    })
    .from(packs)
    .innerJoin(users, eq(packs.ownerId, users.id))
    .where(eq(packs.slug, slug))
    .get();

  if (!pack) return null;

  const versions = await db
    .select()
    .from(packVersions)
    .where(eq(packVersions.packId, pack.id))
    .orderBy(desc(packVersions.createdAt));

  let hasStarred = false;
  let isOwner = false;
  const session = await getSession(env.SESSIONS, env.SESSION_SECRET);
  if (session) {
    isOwner = session.userId === pack.ownerId;
    const star = await db
      .select({ id: packStars.id })
      .from(packStars)
      .where(and(eq(packStars.userId, session.userId), eq(packStars.packId, pack.id)))
      .get();
    hasStarred = !!star;
  }

  return { pack, versions, hasStarred, isOwner };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPackData(slug);
  if (!data) return { title: "Not Found" };

  return {
    title: data.pack.name,
    description: data.pack.shortDescription,
  };
}

export default async function PackDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getPackData(slug);

  if (!data) {
    notFound();
  }

  const { pack, versions, hasStarred, isOwner } = data;

  // Fetch README if using GitHub readme
  let readmeContent: string | null = null;
  if (pack.useGithubReadme && pack.githubRepo) {
    const parsed = parseGithubRepo(pack.githubRepo);
    if (parsed) {
      readmeContent = await fetchReadme(parsed.owner, parsed.repo);
    }
  }

  const description = readmeContent || pack.longDescription;

  return (
    <div className="grid-overlay min-h-screen py-10">
      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}
        <PackPageHeader
          slug={slug}
          name={pack.name}
          shortDescription={pack.shortDescription}
          iconUrl={pack.iconUrl}
          bannerUrl={pack.bannerUrl}
          category={pack.category}
          downloadCount={pack.downloadCount}
          starCount={pack.starCount}
          hasStarred={hasStarred}
          isOwner={isOwner}
          githubRepo={pack.githubRepo}
          ownerUsername={pack.ownerUsername}
          ownerAvatar={pack.ownerAvatar}
          ownerDisplayName={pack.ownerDisplayName}
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
                <CommentSection slug={slug} packOwnerId={pack.ownerId} />
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
