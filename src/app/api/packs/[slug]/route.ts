import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { packs, users, packVersions, packStars } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { getSession } from "@/lib/auth/session";
import { validatePackName, validateDescription, validatePackCategory, validateGithubRepo, sanitizeMarkdown } from "@/lib/validation";
import { getEnv } from "@/lib/cloudflare";

type RouteParams = { params: Promise<{ slug: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { slug } = await params;
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

  if (!pack) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const versions = await db
    .select()
    .from(packVersions)
    .where(eq(packVersions.packId, pack.id))
    .orderBy(desc(packVersions.createdAt));

  // Check if current user has starred
  let hasStarred = false;
  const session = await getSession(env.SESSIONS, env.SESSION_SECRET);
  if (session) {
    const star = await db
      .select({ id: packStars.id })
      .from(packStars)
      .where(and(eq(packStars.userId, session.userId), eq(packStars.packId, pack.id)))
      .get();
    hasStarred = !!star;
  }

  return NextResponse.json({
    pack,
    versions,
    hasStarred,
    isOwner: session?.userId === pack.ownerId,
  });
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { slug } = await params;
  const env = await getEnv();
  const session = await getSession(env.SESSIONS, env.SESSION_SECRET);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb(env.DB);
  const pack = await db.select({ id: packs.id, ownerId: packs.ownerId }).from(packs).where(eq(packs.slug, slug)).get();
  if (!pack) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (pack.ownerId !== session.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as {
    name?: string; shortDescription?: string; longDescription?: string;
    githubRepo?: string; category?: string; useGithubReadme?: boolean;
  };
  const updates: Record<string, unknown> = {};
  const errors: Record<string, string> = {};

  if (body.name !== undefined) {
    const err = validatePackName(body.name);
    if (err) errors.name = err;
    else updates.name = body.name;
  }
  if (body.shortDescription !== undefined) {
    const err = validateDescription(body.shortDescription);
    if (err) errors.shortDescription = err;
    else updates.shortDescription = body.shortDescription;
  }
  if (body.longDescription !== undefined) {
    updates.longDescription = sanitizeMarkdown(body.longDescription);
  }
  if (body.category !== undefined) {
    const err = validatePackCategory(body.category);
    if (err) errors.category = err;
    else updates.category = body.category;
  }
  if (body.githubRepo !== undefined) {
    const err = validateGithubRepo(body.githubRepo);
    if (err) errors.githubRepo = err;
    else updates.githubRepo = body.githubRepo || null;
  }
  if (body.useGithubReadme !== undefined) {
    updates.useGithubReadme = body.useGithubReadme;
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  if (Object.keys(updates).length > 0) {
    updates.updatedAt = new Date();
    await db.update(packs).set(updates).where(eq(packs.id, pack.id));
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { slug } = await params;
  const env = await getEnv();
  const session = await getSession(env.SESSIONS, env.SESSION_SECRET);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb(env.DB);
  const pack = await db.select({ id: packs.id, ownerId: packs.ownerId }).from(packs).where(eq(packs.slug, slug)).get();
  if (!pack) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (pack.ownerId !== session.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await db.delete(packs).where(eq(packs.id, pack.id));
  return NextResponse.json({ ok: true });
}
