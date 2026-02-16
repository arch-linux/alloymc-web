import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { mods, reports } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { getSession } from "@/lib/auth/session";
import { getEnv } from "@/lib/cloudflare";

type RouteParams = { params: Promise<{ slug: string }> };

const VALID_REASONS = ["malware", "spam", "copyright", "other"] as const;

export async function POST(request: NextRequest, { params }: RouteParams) {
  const { slug } = await params;
  const env = await getEnv();
  const session = await getSession(env.SESSIONS, env.SESSION_SECRET);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { reason: string; description?: string };
  const { reason, description } = body;

  if (!VALID_REASONS.includes(reason as typeof VALID_REASONS[number])) {
    return NextResponse.json({ error: "Invalid reason" }, { status: 400 });
  }

  const db = getDb(env.DB);
  const mod = await db.select({ id: mods.id }).from(mods).where(eq(mods.slug, slug)).get();
  if (!mod) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Prevent duplicate reports from same user
  const existing = await db
    .select({ id: reports.id })
    .from(reports)
    .where(
      and(
        eq(reports.reporterId, session.userId),
        eq(reports.modId, mod.id),
        eq(reports.status, "open")
      )
    )
    .get();

  if (existing) {
    return NextResponse.json({ error: "You have already reported this mod" }, { status: 409 });
  }

  await db.insert(reports).values({
    reporterId: session.userId,
    modId: mod.id,
    reason: reason as "malware" | "spam" | "copyright" | "other",
    description: description || null,
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
