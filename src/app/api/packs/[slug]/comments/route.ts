import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { packs, packComments, users } from "@/lib/db/schema";
import { eq, desc, isNull, sql, and } from "drizzle-orm";
import { getSession } from "@/lib/auth/session";
import { validateCommentContent, sanitizeMarkdown } from "@/lib/validation";
import { getEnv } from "@/lib/cloudflare";

type RouteParams = { params: Promise<{ slug: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { slug } = await params;
  const env = await getEnv();
  const db = getDb(env.DB);
  const url = new URL(request.url);

  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
  const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get("limit") || "20")));
  const offset = (page - 1) * limit;

  const pack = await db.select({ id: packs.id }).from(packs).where(eq(packs.slug, slug)).get();
  if (!pack) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const [results, countResult] = await Promise.all([
    db
      .select({
        id: packComments.id,
        content: packComments.content,
        createdAt: packComments.createdAt,
        updatedAt: packComments.updatedAt,
        userId: packComments.userId,
        authorUsername: users.githubUsername,
        authorAvatar: users.avatarUrl,
        authorDisplayName: users.displayName,
      })
      .from(packComments)
      .innerJoin(users, eq(packComments.userId, users.id))
      .where(and(eq(packComments.packId, pack.id), isNull(packComments.deletedAt)))
      .orderBy(desc(packComments.createdAt))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)` })
      .from(packComments)
      .where(and(eq(packComments.packId, pack.id), isNull(packComments.deletedAt))),
  ]);

  return NextResponse.json({
    comments: results,
    pagination: { page, limit, total: countResult[0]?.count ?? 0 },
  });
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const { slug } = await params;
  const env = await getEnv();
  const session = await getSession(env.SESSIONS, env.SESSION_SECRET);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { content: string };
  const err = validateCommentContent(body.content);
  if (err) {
    return NextResponse.json({ error: err }, { status: 400 });
  }

  const db = getDb(env.DB);
  const pack = await db.select({ id: packs.id }).from(packs).where(eq(packs.slug, slug)).get();
  if (!pack) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const result = await db
    .insert(packComments)
    .values({
      userId: session.userId,
      packId: pack.id,
      content: sanitizeMarkdown(body.content),
    })
    .returning();

  return NextResponse.json({ comment: result[0] }, { status: 201 });
}
