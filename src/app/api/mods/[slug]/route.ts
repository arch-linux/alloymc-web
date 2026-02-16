import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { mods, users, modVersions, stars } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { getSession } from "@/lib/auth/session";
import { validateModName, validateDescription, validateCategory, validateGithubRepo, sanitizeMarkdown } from "@/lib/validation";
import { getEnv } from "@/lib/cloudflare";

type RouteParams = { params: Promise<{ slug: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { slug } = await params;
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

  if (!mod) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const versions = await db
    .select()
    .from(modVersions)
    .where(eq(modVersions.modId, mod.id))
    .orderBy(desc(modVersions.createdAt));

  // Check if current user has starred
  let hasStarred = false;
  const session = await getSession(env.SESSIONS, env.SESSION_SECRET);
  if (session) {
    const star = await db
      .select({ id: stars.id })
      .from(stars)
      .where(and(eq(stars.userId, session.userId), eq(stars.modId, mod.id)))
      .get();
    hasStarred = !!star;
  }

  return NextResponse.json({
    mod,
    versions,
    hasStarred,
    isOwner: session?.userId === mod.ownerId,
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
  const mod = await db.select({ id: mods.id, ownerId: mods.ownerId }).from(mods).where(eq(mods.slug, slug)).get();
  if (!mod) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (mod.ownerId !== session.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json()) as {
    name?: string; shortDescription?: string; longDescription?: string;
    githubRepo?: string; category?: string; useGithubReadme?: boolean;
  };
  const updates: Record<string, unknown> = {};
  const errors: Record<string, string> = {};

  if (body.name !== undefined) {
    const err = validateModName(body.name);
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
    const err = validateCategory(body.category);
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
    await db.update(mods).set(updates).where(eq(mods.id, mod.id));
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
  const mod = await db.select({ id: mods.id, ownerId: mods.ownerId }).from(mods).where(eq(mods.slug, slug)).get();
  if (!mod) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (mod.ownerId !== session.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await db.delete(mods).where(eq(mods.id, mod.id));
  return NextResponse.json({ ok: true });
}
