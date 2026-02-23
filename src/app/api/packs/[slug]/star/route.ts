import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { packs, packStars } from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { getSession } from "@/lib/auth/session";
import { getEnv } from "@/lib/cloudflare";

type RouteParams = { params: Promise<{ slug: string }> };

export async function POST(request: NextRequest, { params }: RouteParams) {
  const { slug } = await params;
  const env = await getEnv();
  const session = await getSession(env.SESSIONS, env.SESSION_SECRET);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb(env.DB);
  const pack = await db.select({ id: packs.id, starCount: packs.starCount }).from(packs).where(eq(packs.slug, slug)).get();
  if (!pack) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Check if already starred
  const existing = await db
    .select({ id: packStars.id })
    .from(packStars)
    .where(and(eq(packStars.userId, session.userId), eq(packStars.packId, pack.id)))
    .get();

  if (existing) {
    // Unstar
    await db.delete(packStars).where(eq(packStars.id, existing.id));
    await db
      .update(packs)
      .set({ starCount: sql`${packs.starCount} - 1` })
      .where(eq(packs.id, pack.id));
    return NextResponse.json({ starred: false, starCount: pack.starCount - 1 });
  } else {
    // Star
    await db.insert(packStars).values({ userId: session.userId, packId: pack.id });
    await db
      .update(packs)
      .set({ starCount: sql`${packs.starCount} + 1` })
      .where(eq(packs.id, pack.id));
    return NextResponse.json({ starred: true, starCount: pack.starCount + 1 });
  }
}
