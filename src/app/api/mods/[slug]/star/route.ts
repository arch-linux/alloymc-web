import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { mods, stars } from "@/lib/db/schema";
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
  const mod = await db.select({ id: mods.id, starCount: mods.starCount }).from(mods).where(eq(mods.slug, slug)).get();
  if (!mod) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Check if already starred
  const existing = await db
    .select({ id: stars.id })
    .from(stars)
    .where(and(eq(stars.userId, session.userId), eq(stars.modId, mod.id)))
    .get();

  if (existing) {
    // Unstar
    await db.delete(stars).where(eq(stars.id, existing.id));
    await db
      .update(mods)
      .set({ starCount: sql`${mods.starCount} - 1` })
      .where(eq(mods.id, mod.id));
    return NextResponse.json({ starred: false, starCount: mod.starCount - 1 });
  } else {
    // Star
    await db.insert(stars).values({ userId: session.userId, modId: mod.id });
    await db
      .update(mods)
      .set({ starCount: sql`${mods.starCount} + 1` })
      .where(eq(mods.id, mod.id));
    return NextResponse.json({ starred: true, starCount: mod.starCount + 1 });
  }
}
